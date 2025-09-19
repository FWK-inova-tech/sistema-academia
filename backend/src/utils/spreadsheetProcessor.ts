import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { AlunoType } from '../types/AlunoType';

export interface ImportedAlunoData {
  nome: string;
  objetivo: string;
  dataNascimento: string; // Formato DD/MM/AAAA
  professor: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  contato: string;
  dataInicio: string; // Formato DD/MM/AAAA
  dataRevisao: string; // Formato DD/MM/AAAA
  anaminese: string;
  agenda: string; // Lista separada por vírgula ex: "Segunda, Terça"
}

export interface ValidationError {
  linha: number;
  campo: string;
  erro: string;
  valor: any;
}

export interface ImportResult {
  dadosValidos: AlunoType[];
  erros: ValidationError[];
  totalLinhas: number;
  linhasProcessadas: number;
}

// Função para converter DD/MM/AAAA para Date
function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexado
  const year = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  
  // Validar se a data é válida
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null;
  }
  
  return date;
}

// Função para validar nivel
function validateNivel(nivel: string): 'Iniciante' | 'Intermediário' | 'Avançado' | null {
  const normalizedNivel = nivel?.trim();
  const validNiveis = ['Iniciante', 'Intermediário', 'Avançado'];
  
  return validNiveis.includes(normalizedNivel) ? normalizedNivel as any : null;
}

// Função para processar agenda (string separada por vírgulas)
function parseAgenda(agendaString: string): string[] {
  if (!agendaString) return [];
  
  return agendaString
    .split(',')
    .map(dia => dia.trim())
    .filter(dia => dia.length > 0);
}

// Validar dados de uma linha
function validateAlunoData(data: ImportedAlunoData, linha: number): { aluno: AlunoType | null, erros: ValidationError[] } {
  const erros: ValidationError[] = [];
  
  // Validar nome (obrigatório)
  if (!data.nome?.trim()) {
    erros.push({ linha, campo: 'nome', erro: 'Nome é obrigatório', valor: data.nome });
  }
  
  // Validar objetivo
  if (!data.objetivo?.trim()) {
    erros.push({ linha, campo: 'objetivo', erro: 'Objetivo é obrigatório', valor: data.objetivo });
  }
  
  // Validar data de nascimento
  const dataNascimento = parseDate(data.dataNascimento);
  if (!dataNascimento) {
    erros.push({ linha, campo: 'dataNascimento', erro: 'Data de nascimento inválida. Use formato DD/MM/AAAA', valor: data.dataNascimento });
  }
  
  // Validar professor
  if (!data.professor?.trim()) {
    erros.push({ linha, campo: 'professor', erro: 'Professor é obrigatório', valor: data.professor });
  }
  
  // Validar nível
  const nivel = validateNivel(data.nivel);
  if (!nivel) {
    erros.push({ linha, campo: 'nivel', erro: 'Nível inválido. Use: Iniciante, Intermediário ou Avançado', valor: data.nivel });
  }
  
  // Validar contato
  if (!data.contato?.trim()) {
    erros.push({ linha, campo: 'contato', erro: 'Contato é obrigatório', valor: data.contato });
  }
  
  // Validar data de início
  const dataInicio = parseDate(data.dataInicio);
  if (!dataInicio) {
    erros.push({ linha, campo: 'dataInicio', erro: 'Data de início inválida. Use formato DD/MM/AAAA', valor: data.dataInicio });
  }
  
  // Validar data de revisão
  const dataRevisao = parseDate(data.dataRevisao);
  if (!dataRevisao) {
    erros.push({ linha, campo: 'dataRevisao', erro: 'Data de revisão inválida. Use formato DD/MM/AAAA', valor: data.dataRevisao });
  }
  
  // Validar anaminese
  if (!data.anaminese?.trim()) {
    erros.push({ linha, campo: 'anaminese', erro: 'Anaminese é obrigatória', valor: data.anaminese });
  }
  
  // Processar agenda
  const agenda = parseAgenda(data.agenda);
  if (agenda.length === 0) {
    erros.push({ linha, campo: 'agenda', erro: 'Agenda deve conter pelo menos um dia da semana', valor: data.agenda });
  }
  
  // Se há erros, retorna null para aluno
  if (erros.length > 0) {
    return { aluno: null, erros };
  }
  
  // Criar objeto aluno válido
  const aluno: AlunoType = {
    nome: data.nome.trim(),
    objetivo: data.objetivo.trim(),
    dataNascimento: dataNascimento!,
    professor: data.professor.trim(),
    nivel: nivel!,
    contato: data.contato.trim(),
    dataInicio: dataInicio!,
    dataRevisao: dataRevisao!,
    anaminese: data.anaminese.trim(),
    agenda,
    treino: [], // Inicializar vazio
    perimetria: {
      data: new Date(),
      medidas: []
    }, // Inicializar vazio
    status: 'active'
  };
  
  return { aluno, erros: [] };
}

export async function processSpreadsheet(filePath: string): Promise<ImportResult> {
  try {
    // Ler arquivo
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Converter para JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    if (rawData.length < 2) {
      throw new Error('Planilha deve conter pelo menos uma linha de cabeçalho e uma linha de dados');
    }
    
    // Primeira linha são os cabeçalhos
    const headers = rawData[0];
    const dataRows = rawData.slice(1);
    
    // Verificar se todos os cabeçalhos obrigatórios estão presentes
    const requiredHeaders = [
      'nome', 'objetivo', 'dataNascimento', 'professor', 'nivel', 
      'contato', 'dataInicio', 'dataRevisao', 'anaminese', 'agenda'
    ];
    
    const missingHeaders = requiredHeaders.filter(header => 
      !headers.some((h: string) => h?.toLowerCase().trim() === header.toLowerCase())
    );
    
    if (missingHeaders.length > 0) {
      throw new Error(`Cabeçalhos obrigatórios não encontrados: ${missingHeaders.join(', ')}`);
    }
    
    // Mapear índices dos cabeçalhos
    const headerMap: { [key: string]: number } = {};
    requiredHeaders.forEach(header => {
      const index = headers.findIndex((h: string) => h?.toLowerCase().trim() === header.toLowerCase());
      headerMap[header] = index;
    });
    
    const dadosValidos: AlunoType[] = [];
    const erros: ValidationError[] = [];
    
    // Processar cada linha de dados
    dataRows.forEach((row, index) => {
      const linha = index + 2; // +2 porque começamos da linha 2 (após cabeçalho)
      
      // Pular linhas vazias
      if (!row || row.every(cell => !cell)) {
        return;
      }
      
      const importedData: ImportedAlunoData = {
        nome: row[headerMap.nome]?.toString() || '',
        objetivo: row[headerMap.objetivo]?.toString() || '',
        dataNascimento: row[headerMap.dataNascimento]?.toString() || '',
        professor: row[headerMap.professor]?.toString() || '',
        nivel: row[headerMap.nivel]?.toString() || '',
        contato: row[headerMap.contato]?.toString() || '',
        dataInicio: row[headerMap.dataInicio]?.toString() || '',
        dataRevisao: row[headerMap.dataRevisao]?.toString() || '',
        anaminese: row[headerMap.anaminese]?.toString() || '',
        agenda: row[headerMap.agenda]?.toString() || ''
      };
      
      const { aluno, erros: rowErrors } = validateAlunoData(importedData, linha);
      
      if (aluno) {
        dadosValidos.push(aluno);
      }
      
      erros.push(...rowErrors);
    });
    
    return {
      dadosValidos,
      erros,
      totalLinhas: dataRows.length,
      linhasProcessadas: dataRows.filter(row => row && row.some(cell => cell)).length
    };
    
  } catch (error: any) {
    throw new Error(`Erro ao processar planilha: ${error.message}`);
  } finally {
    // Remover arquivo temporário
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
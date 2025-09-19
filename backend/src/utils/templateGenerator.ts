import * as XLSX from 'xlsx';
import { Response } from 'express';
import path from 'path';

export const generateTemplate = (res: Response) => {
  // Definir os dados do template
  const templateData = [
    // Cabeçalhos
    ['nome', 'objetivo', 'dataNascimento', 'professor', 'nivel', 'contato', 'dataInicio', 'dataRevisao', 'anaminese', 'agenda'],
    
    // Exemplos de dados
    ['João Silva', 'Ganhar massa muscular', '15/03/1990', 'Prof. Carlos', 'Iniciante', '11999887766', '01/01/2024', '01/02/2024', 'Sem restrições médicas', 'Segunda, Quarta, Sexta'],
    ['Maria Santos', 'Perder peso', '22/07/1985', 'Prof. Ana', 'Intermediário', '11988776655', '15/01/2024', '15/02/2024', 'Dor no joelho esquerdo', 'Terça, Quinta'],
    ['Pedro Costa', 'Melhorar condicionamento', '08/12/1992', 'Prof. Roberto', 'Avançado', '11977665544', '10/01/2024', '10/02/2024', 'Atleta de futebol', 'Segunda, Terça, Quinta, Sexta']
  ];

  // Criar workbook e worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(templateData);

  // Configurar largura das colunas
  const columnWidths = [
    { wch: 20 }, // nome
    { wch: 30 }, // objetivo
    { wch: 15 }, // dataNascimento
    { wch: 15 }, // professor
    { wch: 15 }, // nivel
    { wch: 15 }, // contato
    { wch: 12 }, // dataInicio
    { wch: 12 }, // dataRevisao
    { wch: 40 }, // anaminese
    { wch: 30 }  // agenda
  ];
  worksheet['!cols'] = columnWidths;

  // Adicionar o worksheet ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Alunos');

  // Gerar buffer do arquivo Excel
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  // Configurar headers para download
  res.setHeader('Content-Disposition', 'attachment; filename=template_importacao_alunos.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Length', buffer.length);

  // Enviar o arquivo
  res.send(buffer);
};
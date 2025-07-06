import type { AlunoType } from "../../types/AlunoType";
import type { PerimetriaType } from "../../types/PerimetriaType";
import type { SectionErrorType } from "../../types/SectionTypes";
import type { TreinoType } from "../../types/TreinoType";

interface validadeFormSubmitParams {
  data: {
    infoPessoais: Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>;
    agenda: string[];
    infosTreino: Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>;
    perimetria: PerimetriaType;
    treino: TreinoType[];
  },
  setSectionErrors: (error: SectionErrorType) => void;
}
export function validadeFormSubmit(param: validadeFormSubmitParams) {
  const {infoPessoais, agenda, infosTreino, perimetria, treino} = param.data
  const newErrors: SectionErrorType = {}

  // pessoais
  if(!infoPessoais.nome.trim() || !infoPessoais.contato.trim()) {
    newErrors.pessoais = 'Todos os campos de informação pessoal devem ser preenchidos'
  }
  if(!infoPessoais.dataNascimento || isNaN(infoPessoais.dataNascimento.getTime())) {
    newErrors.pessoais = 'Informe uma data de nascimento válida.'
  }
  const currentDate = new Date()
  const minYearDate = new Date(
    currentDate.getFullYear() - 18,
    currentDate.getMonth(),
    currentDate.getDate()
  )
  if (infoPessoais.dataNascimento > minYearDate) {
    newErrors.pessoais = 'O aluno precisa ter no mínimo 18 anos ou mais.';
  }

  // agenda
  if(agenda.length === 0) {
    newErrors.agenda = 'Marque ao menos um dia da semana.'
  }

  // info treino
  if(!infosTreino.professor.trim() || !infosTreino.objetivo.trim() || !infosTreino.anaminese.trim()) {
    newErrors.infoTreino = 'Todos os campos são obrigatórios.'
  }
  if(!infosTreino.dataInicio || isNaN(infosTreino.dataInicio.getTime())) {
    newErrors.infoTreino = 'Informe uma data de início válida.'
  }
  if(!infosTreino.dataRevisao || isNaN(infosTreino.dataRevisao.getTime())) {
    newErrors.infoTreino = 'Informe uma data de revisão válida.'
  }

  // treino
  if(treino.length == 0) {
    newErrors.treino = 'A lista de treino do aluno está vazia'
  }

  param.setSectionErrors(newErrors)

  if (Object.keys(newErrors).length > 0) {
    return
  }

  const saveStudent:  Omit<AlunoType, 'id'>  = {
    nome: infoPessoais.nome,
    contato: infoPessoais.contato,
    dataNascimento: infoPessoais.dataNascimento,
    agenda,
    anaminese: infosTreino.anaminese,
    dataInicio: infosTreino.dataInicio,
    dataRevisao: infosTreino.dataRevisao,
    nivel: infosTreino.nivel,
    objetivo: infosTreino.objetivo,
    professor: infosTreino.professor,
    perimetria,
    treino,
  }
  return saveStudent
}
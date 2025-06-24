import type { Perimetria } from "./Perimetria";
import type { Treino } from "./Treino";

export interface Aluno {
  id: string;
  nome: string;
  dataNascimento: Date;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  objetivo: string;
  dataInicio: Date;
  dataRevisao: Date;
  professor: string;
  contato: string;
  anaminese: string;
  treino: Treino[];
  perimetria: Perimetria;
}

export type NovoAluno = Omit<Aluno, 'id'>

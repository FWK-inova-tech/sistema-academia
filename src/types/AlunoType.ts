import type { PerimetriaType } from "./PerimetriaType";
import type { TreinoType } from "./TreinoType";

export interface AlunoType {
  nome: string;
  objetivo: string;
  dataNascimento: Date;
  professor: string;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  contato: string;
  dataInicio: Date;
  dataRevisao: Date;
  anaminese: string;
  id: string;
  agenda: string[];
  treino: TreinoType[];
  perimetria: PerimetriaType;
}

export type NovoAluno = Omit<AlunoType, 'id'>

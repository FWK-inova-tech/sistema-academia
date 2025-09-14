import type { AlunoType } from "../types/AlunoType";
import { itensPerimetria } from "./medidasPerimetria";

export const newStudentInitialValue: Omit<AlunoType, '_id'> = {
  nome: '',
  objetivo: '',
  dataNascimento: new Date(),
  professor: '',
  nivel: "Iniciante",
  contato: '',
  dataInicio: new Date(),
  dataRevisao: new Date(),
  anaminese: '',
  agenda: [],
  status: 'active',
  treino: [],
  perimetria: {
    data: new Date(),
    medidas: itensPerimetria
  }
}

import mongoose, { Schema, Document } from 'mongoose';
import { AlunoType, PerimetriaType, TreinoType, TreinoItemType } from '../types/AlunoType';

const TreinoItemSchema: Schema = new Schema<TreinoItemType>({
    exercicio: { type: String, required: true },
    series: { type: String, required: true },
    repeticoes: { type: String, required: false },
    carga: { type: String, required: false  },
    observacoes: { type: String, required: false }
}, { _id: false });

const TreinoSchema: Schema = new Schema<TreinoType>({
    nomeTreino: { type: String, required: true },
    dataTreino: { type: Date, required: true },
    intensidade: { type: String, required: true },
    exercicio: { type: [TreinoItemSchema], required: true },
    observacoesGerais: { type: String, required: false },
}, { _id: false });

const PerimetriaSchema: Schema = new Schema<PerimetriaType>({
    bracoDireito: { type: Number, required: true },
    bracoEsquerdo: { type: Number, required: true },
    coxaDireita: { type: Number, required: true },
    coxaEsquerda: { type: Number, required: true },
    panturrilhaDireita: { type: Number, required: true },
    panturrilhaEsquerda: { type: Number, required: true },
    peito: { type: Number, required: true },
    cintura: { type: Number, required: true },
    quadril: { type: Number, required: true },
    dataMedicao: { type: Date, required: true, default: Date.now },
}, { _id: false });

export interface IAluno extends AlunoType, Document {}

const AlunoSchema: Schema = new Schema<IAluno>({
    nome: { type: String, required: true },
    objetivo: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    professor: { type: String, required: true },
    nivel: { type: String, enum: ['Iniciante', 'Intermediário', 'Avançado'], required: true },
    contato: { type: String, required: true },
    dataInicio: { type: Date, required: true },
    dataRevisao: { type: Date, required: true },
    anaminese: { type: String, required: true },
    agenda: { type: [String], required: true },
    treino: { type: [TreinoSchema], required: true },
    perimetria: { type: [PerimetriaSchema], required: true }
}, { timestamps: true });

const Aluno = mongoose.model<IAluno>('Aluno', AlunoSchema);

export default Aluno;
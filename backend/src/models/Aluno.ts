import mongoose, { Schema, Document } from 'mongoose';
import { AlunoType, PerimetriaType, TreinoType } from '../types/AlunoType';

// const TreinoItemSchema: Schema = new Schema<TreinoItemType>({
//     exercicio: { type: String, required: true },
//     series: { type: String, required: true },
//     repeticoes: { type: String, required: false },
//     carga: { type: String, required: false  },
//     observacoes: { type: String, required: false }
// }, { _id: false });



const TreinoSchema: Schema = new Schema<TreinoType>({
    exercicios: { type: [String], required: true },
    categoria: { type: String, required: true },
}, { _id: false });

const PerimetriaSchema: Schema = new Schema<PerimetriaType>({
    data: { type: Date, required: true, default: Date.now },
    medidas: [{
        type: {
            nome: {type: String},
            valor: {type: Number}
        }, required: true
    }]
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
export interface PerimetriaType {
    bracoDireito: number;
    bracoEsquerdo: number;
    coxaDireita: number;
    coxaEsquerda: number;
    panturrilhaDireita: number;
    panturrilhaEsquerda: number;
    peito: number;
    cintura: number;
    quadril: number;
    dataMedicao: Date;
}

export interface TreinoItemType {
    exercicio: string;
    series: string;
    repeticoes: string;
    carga: string;
    observacoes: string;
}

export interface TreinoType {
    nomeTreino: string;
    dataTreino: Date;
    intensidade: string;
    exercicio: TreinoItemType[];
    observacoesGerais?: string;
}

export type NivelAluno = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface AlunoType {
    nome: string;
    objetivo: string;
    dataNascimento: Date;
    professor: string;
    nivel: NivelAluno;
    contato: string;
    dataInicio: Date;
    dataRevisao: Date;
    anaminese: string;
    agenda: string[];
    treino: TreinoType[];
    perimetria: PerimetriaType[];
}
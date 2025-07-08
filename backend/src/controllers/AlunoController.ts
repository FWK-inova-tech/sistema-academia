import { Request, Response } from "express";
import Aluno, { IAluno } from "../models/Aluno";

// Criar um novo aluno
export const createAluno = async (req: Request, res: Response): Promise<void> => {
    try {
        const novoAluno: IAluno = new Aluno(req.body);
        await novoAluno.save();
        res.status(201).json(novoAluno);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Obter todos os alunos
export const getAlunos = async (req: Request, res: Response): Promise<void> => {
    try {
        const alunos: IAluno[] = await Aluno.find();
        res.status(200).json(alunos);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Obter aluno pelo ID
export const getAlunoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const aluno: IAluno | null = await Aluno.findById(req.params.id);
        if (!aluno) {
            res.status(404).json({ message: 'Aluno não encontrado' });
            return;
        }
        res.status(200).json(aluno);
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
};

// Atualizar um aluno por ID
export const updateAluno = async (req: Request, res: Response): Promise<void> => {
    try {
        const aluno: IAluno | null = await Aluno.findById(req.params.id);
        if (!aluno) {
            res.status(404).json({ message: 'Aluno não encontrado' });
            return;
        }

        // Atualizando apenas os campos que estão no req.body
        Object.assign(aluno, req.body);

        await aluno.save();
        res.status(200).json(aluno);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

// Deletar um aluno por ID
export const deleteAluno = async (req: Request, res: Response): Promise<void> => {
    try {
    const aluno: IAluno | null = await Aluno.findByIdAndDelete(req.params.id);
    if (!aluno) {
        res.status(404).json({ message: 'Aluno não encontrado' });
        return;
    }
    res.status(200).json({ message: 'Aluno excluído com sucesso' });
    } catch (err: any) {
    res.status(500).json({ message: err.message });
    }
};
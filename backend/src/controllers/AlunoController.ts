/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import Aluno, { IAluno } from "../models/Aluno";
import { AlunoListItemType } from "../types/AlunoType";

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

export const getAlunos = async (req: Request, res: Response): Promise<void> => {
    try {
        const alunosRaw = await Aluno.find({}, { nome: 1 }).lean();
        const alunos: AlunoListItemType[] = (alunosRaw as any[]).map(a => ({ _id: a._id.toString(), nome: a.nome }));
        res.status(200).json(alunos);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getAlunoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const aluno: IAluno | null = await Aluno.findById(req.params.id);
        if (!aluno) {
            res.status(404).json({ message: 'Aluno não encontrado' });
            return;
        }
        res.status(200).json(aluno);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const updateAluno = async (req: Request, res: Response): Promise<void> => {
    try {
        const aluno: IAluno | null = await Aluno.findById(req.params.id);
        if (!aluno) {
            res.status(404).json({ message: 'Aluno não encontrado' });
            return;
        }

        Object.assign(aluno, req.body);

        await aluno.save();
        res.status(200).json(aluno);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

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
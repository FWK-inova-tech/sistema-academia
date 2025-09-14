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
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59, 999);

    const alunosRaw = await Aluno.find({}, { nome: 1, dataInicio: 1, status: 1 }).lean()

    let novosMes = 0;
    const alunos: AlunoListItemType[] = (alunosRaw as any[]).map(a => {
      const dataInicio = a.dataInicio ? new Date(a.dataInicio) : null;
      if (dataInicio && dataInicio >= inicioMes && dataInicio <= fimMes) {
        novosMes += 1;
      }
      return { _id: a._id.toString(), nome: a.nome };
    });

    const alunosAtivos = alunosRaw.filter(a => a.status === 'active').length;

    const stats = {
      total: alunos.length,
      novosMes,
      alunosAtivos
    };

    res.status(200).json({ alunos, stats });
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
    res.status(500).json({ message: err.message })
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

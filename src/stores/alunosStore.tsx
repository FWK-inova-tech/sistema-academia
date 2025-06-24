import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Aluno } from "../types/Aluno";

const initialState = {
  alunos: [] as Aluno[]
}


export const alunosSlice = createSlice({
  name: 'alunos',
  initialState,
  reducers: {
    setAlunos: (state, action: PayloadAction<Aluno[]>) => {
      state.alunos = action.payload
    },
    addAluno: (state, action: PayloadAction<Aluno>) => {
      state.alunos.push(action.payload)
    },
    deleteAluno: (state, action: PayloadAction<string>) => {
      state.alunos = state.alunos.filter(aluno => aluno.id == action.payload)
    },
    updateAluno: (state, action: PayloadAction<Aluno>) => {
      state.alunos = state.alunos.map(aluno => {
        return aluno.id == action.payload.id ? action.payload : aluno
      })
    }
  }
})

export const { addAluno, deleteAluno, setAlunos, updateAluno } = alunosSlice.actions
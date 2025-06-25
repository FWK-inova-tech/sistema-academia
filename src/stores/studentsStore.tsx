import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Aluno } from "../types/Aluno";

const initialState = {
  students: [] as Aluno[],
  loading: false as boolean
}

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setAlunos: (state, action: PayloadAction<Aluno[]>) => {
      state.students = action.payload
    },
    addAluno: (state, action: PayloadAction<Aluno>) => {
      state.students.push(action.payload)
    },
    deleteAluno: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(student=> student.id == action.payload)
    },
    updateAluno: (state, action: PayloadAction<Aluno>) => {
      state.students = state.students.map(student=> {
        return student.id == action.payload.id ? action.payload : student
      })
    }
  }
})

export const { addAluno, deleteAluno, setAlunos, updateAluno } = studentsSlice.actions
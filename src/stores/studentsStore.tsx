import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AlunoType } from "../types/AlunoType";

const initialState = {
  studentsList: [] as Pick<AlunoType, 'id' | 'nome'>[],
  loading: false as false | string
}

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setAlunos: (state, action: PayloadAction<Pick<AlunoType, 'id' | 'nome'>[]>) => {
      state.studentsList = action.payload
    },
    addAluno: (state, action: PayloadAction<Pick<AlunoType, 'id' | 'nome'>>) => {
      state.studentsList.push(action.payload)
    },
    deleteAluno: (state, action: PayloadAction<string>) => {
      state.studentsList = state.studentsList.filter(student=> student.id == action.payload)
    },
    setLoading: (state, action: PayloadAction<false | string>) => {
      state.loading = action.payload
    }
  }
})

export const { addAluno, deleteAluno, setAlunos, setLoading } = studentsSlice.actions
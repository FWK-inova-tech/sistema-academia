import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AlunoType } from "../types/AlunoType";

const initialState = {
  studentsList: [] as Pick<AlunoType, 'id' | 'nome'>[],
  loading: false as false | string,
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
    removeAluno: (state, action: PayloadAction<string>) => {
      state.studentsList = state.studentsList.filter(student=> student.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<false | string>) => {
      state.loading = action.payload
    },
    updateStudentNameOnList: (state, action: PayloadAction<{nome: string, id: string}>) =>{
      state.studentsList = state.studentsList.map(student => {
        if(student.id === action.payload.id){
          return {id:student.id, nome: action.payload.nome}
        } else {
          return student
        }
      })
    }
  }
})

export const { addAluno, removeAluno, setAlunos, setLoading, updateStudentNameOnList } = studentsSlice.actions
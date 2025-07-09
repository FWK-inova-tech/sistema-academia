import axios from "axios";
import type { AlunoType, NovoAluno } from "../types/AlunoType";
import type { Adm } from "../types/Adm";
import { listAllStudents, allStudents } from "../constants/studentsListForTest";

const backendUrl = import.meta.env.VITE_BACKEND_URL
const getToken = () => {
  const token = localStorage.getItem('token')
  return 'stoken'
  if(!token){
    throw new Error("Token ausente, operação não permitida")
  } else {
    return token
  }
}

export const login = async (credentials: Adm): Promise<string> => {
  const { data } = await axios.post<{message: string, token: string}>(`${backendUrl}/login`, {
    email: credentials.email,
    password: credentials.password
  })

  return data.token
}

export const getAlunos = async (): Promise<Pick<AlunoType, 'nome' | 'id'>[]> => {
  const { data } = await axios.get<AlunoType[]>(backendUrl, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })
  return data
  
  // const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  // await delay(10000)
  // return listAllStudents
}

export const getAluno = async (id: string): Promise<AlunoType | null> => {
  // const { data } = await axios.get<{message: string; student: AlunoType}>(`${backendUrl}/${id}`, {
  //   headers: {
  //     Authorization: `Bearer ${getToken()}`,
  //   }
  // })
  // return data.student
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  await delay(10000)
  const search = allStudents.find(student => student.id === id)
  return  search ? search : null
}

export const registerAluno = async (student: NovoAluno): Promise<string> => {
  // const { data } = await axios.post<{message: string; id: string}>(`${backendUrl}/register/`, {student}, {
  //   headers: {
  //     Authorization: `Bearer ${getToken()}`,
  //   }
  // })

  // return data.id

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  await delay(10000)
  return  '003'
}

export const updateAluno = async (student: AlunoType) => {
  // const { data } = await axios.put<{message: string, student: AlunoType}>(`${backendUrl}/update/${student.id}`, {student}, {
  //   headers: {
  //     Authorization: `Bearer ${getToken()}`,
  //   }
  // })

  // return data

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  await delay(10000)
  return  'ok'
}

export const deleteAluno = async (id: string) => {
  // const { data } = await axios.delete<{message: string; deletedStatus: number}>(`${backendUrl}/delete/${id}`,  {
  //   headers: {
  //     Authorization: `Bearer ${getToken()}`,
  //   }
  // })

  // return data.deletedStatus

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  await delay(10000)
  return  'ok'
}

export const changePassword = async (newPassword: string) => {
  // const { data } = await axios.post<{message: string; updatedStatus: number}>(`${backendUrl}/change-password`, {password: newPassword} ,{
  //   headers: {
  //     Authorization: `Bearer ${getToken()}`,
  //   }
  // })

  // return data.updatedStatus

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  await delay(10000)
  return  200
}
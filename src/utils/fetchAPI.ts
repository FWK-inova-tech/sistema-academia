import axios from "axios";
import type { Aluno, NovoAluno } from "../types/Aluno";
import type { Adm } from "../types/Adm";

const backendUrl = import.meta.env.VITE_BACKEND_URL
const getToken = () => {
  const token = localStorage.getItem('token')
  if(!token){
    throw new Error("Token ausente, operação não permitida")
  } else {
    return token
  }
}

export const login = async (credentials: Adm) => {
  const { data } = await axios.post<{message: string, token: string}>(`${backendUrl}/login`, {
    email: credentials.email,
    password: credentials.password
  })

  return data.token
}

export const getAlunos = async () => {
  const { data } = await axios.get<{message: string; students: Aluno[]}>(backendUrl, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })

  return data.students
}

export const registerAluno = async (student: NovoAluno) => {
  const { data } = await axios.post<{message: string; id: string}>(`${backendUrl}/register/`, {student}, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })

  return data.id
}

export const updateAluno = async (student: Aluno) => {
  const { data } = await axios.put(`${backendUrl}/update/${student.id}`, {student}, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })

  return data
}

export const deleteAluno = async (id: string) => {
  const { data } = await axios.delete<{message: string; deletedStatus: number}>(`${backendUrl}/delete/${id}`,  {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })

  return data.deletedStatus
}
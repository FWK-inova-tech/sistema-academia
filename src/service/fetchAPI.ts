import axios from "axios";
import type { AlunoType, NovoAluno } from "../types/AlunoType";
import type { Adm } from "../types/Adm";
import type { ReplaceDateWithString } from "../types/replaceDate";
import type { PerimetriaType } from "../types/PerimetriaType";

const backendUrl = import.meta.env.VITE_BACKEND_URL

const getToken = () => {
  const token = localStorage.getItem('userToken')
  if (!token) {
    throw new Error("Token ausente, operação não permitida")
  } else {
    return token
  }
}

export const login = async (credentials: Adm): Promise<string> => {
  if (!backendUrl) {
    throw new Error("Backend URL não configurada. Verifique o arquivo .env")
  }
  
  const { data } = await axios.post<{ message: string, token: string }>(`${backendUrl}/auth/login`, {
    email: credentials.email,
    password: credentials.password
  })
  return data.token
}

export const getAlunos = async (): Promise<Pick<AlunoType, 'nome' | '_id'>[]> => {
  const { data } = await axios.get<Pick<AlunoType, 'nome' | '_id'>[]>(`${backendUrl}/alunos`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })
  return data

}

type RequestAlunoDataType = ReplaceDateWithString<AlunoType>;

export const getAluno = async (_id: string): Promise<AlunoType | null> => {
  const { data } = await axios.get<RequestAlunoDataType>(`${backendUrl}/alunos/${_id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })

  const formatedPerimetria: PerimetriaType = {
    ...data.perimetria,
    data: new Date(data.perimetria.data)
  }
  const formatedData: AlunoType = {
    ...data,
    perimetria: formatedPerimetria,
    dataNascimento: new Date(data.dataNascimento),
    dataInicio: new Date(data.dataInicio),
    dataRevisao: new Date(data.dataRevisao),
  }
  return formatedData

}

export const registerAluno = async (student: Omit<NovoAluno, '_id'>): Promise<string> => {
  const { data } = await axios.post<AlunoType>(`${backendUrl}/alunos`, {
    nome: student.nome,
    objetivo: student.objetivo,
    dataNascimento: student.dataNascimento,
    professor: student.professor,
    nivel: student.nivel,
    contato: student.contato,
    dataInicio: student.dataInicio,
    dataRevisao: student.dataRevisao,
    anaminese: student.anaminese,
    agenda: student.agenda,
    treino: student.treino,
    perimetria: student.perimetria
  }, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })
  return data._id

}

export const updateAluno = async (student: AlunoType) => {
  const { data } = await axios.put<{ message: string, student: AlunoType }>(`${backendUrl}/alunos/${student._id}`, {
    nome: student.nome,
    objetivo: student.objetivo,
    dataNascimento: student.dataNascimento,
    professor: student.professor,
    nivel: student.nivel,
    contato: student.contato,
    dataInicio: student.dataInicio,
    dataRevisao: student.dataRevisao,
    anaminese: student.anaminese,
    agenda: student.agenda,
    treino: student.treino,
    perimetria: student.perimetria
  }, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })
  console.log('update data', data)
  return data

}

export const deleteAluno = async (id: string) => {
  const { data } = await axios.delete<{ message: string }>(`${backendUrl}/alunos/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })
  return data

}

export const changePassword = async (newPassword: string, oldPassword: string) => {
  const { data } = await axios.put<{ message: string; updatedStatus: number }>(`${backendUrl}/auth/change-password`, { newPassword, oldPassword }, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    }
  })
  console.log('data:', data)
  return data.updatedStatus

}

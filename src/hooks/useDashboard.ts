import { useState } from "react";
import type { AlunoType } from "../types/AlunoType";

interface useDashboardParams {
  students: Pick<AlunoType, '_id' | 'nome'>[];
}
export const useDashboard = ({ students }: useDashboardParams) => {
  const [current, setCurrent] = useState<'students' | 'settings' | 'register/edit/sheet'>('students')
  type apiErrorType = {
    message: string;
    callback: () => Promise<void> | void;
  }
  const [apiError, setApiError] = useState<false | apiErrorType>(false)
  const [currentStudentsList, setCurrentStudentsList] = useState<Pick<AlunoType, '_id' | 'nome'>[]>(students)
  const [openRegister, setOpenRegister] = useState(false)

  function handleSearch(name: string) {
    if (name.trim() === "") {
      setCurrentStudentsList(students)
    } else {
      const filtered = students.filter(aluno =>
        aluno.nome.toLowerCase().includes(name.toLowerCase())
      )
      setCurrentStudentsList(filtered)
    }
  }

  function handleOpenRegister() {
    setOpenRegister(true)
    setCurrent('register/edit/sheet')
  }

  function handleCloseRegister() {
    setOpenRegister(false)
    setCurrent('students')
  }

  function handleCloseOpenEdit(action: 'close' | 'open') {
    if (action === 'open') {
      setCurrent('register/edit/sheet')
    } else {
      setCurrent('students')
    }
  }

  function handleOpenStudentsheet() {
    // ao abrir um aluno da lista, caso a lista esteja filtrada, ela deve ser 'zerada' pra quando 
    // o usuário fechar o studentsheet a lista esteja correta
    setCurrentStudentsList(students)
  }
  const handlers = { handleOpenRegister, handleCloseRegister, handleCloseOpenEdit, handleSearch, handleOpenStudentsheet }

  return {
    current, apiError, currentStudentsList, openRegister, handlers,
    setCurrent, setApiError, setCurrentStudentsList
  }
}

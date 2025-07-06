import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/appStore"
import { closeStudentSheet, openStudentSheet, setLoading } from "../../stores/studentsStore"
import { getAluno } from "../../utils/fetchAPI"
import type { AlunoType } from "../../types/AlunoType";
import { StudentSheet } from "./StudentSheet";
import { StudentForm } from "../studentForm/@StudentForm";
import { Loading } from "../Loading";

interface studentsProps {
  currentStudentsList: Pick<AlunoType, 'id' | 'nome'>[];
  setError: ( error: {
    message: string;
    callback: ()=> Promise<void> | void;
  }) => void;
  controlOpenSheet: (action: 'close' | 'open') => void;
}
export const Students = ({ setError, currentStudentsList, controlOpenSheet } : studentsProps) => {
  const [openEdit, setOpenEdit] = useState(false)
  
  const loading = useAppSelector((state)=> state.students.loading)

  // currentStudentSheet == false => nenhuma ficha de aluno aberta, mostrar lista normalmente
  // currentStudentSheet == null => tentou abrir a ficha mas nenhum aluno com aquele id foi retornado 
  const currentStudentSheet = useAppSelector((state)=> state.students.currentStudentSheet)
  const dispatch = useAppDispatch()

  async function handleOpenStudentSheet(id: string){
    dispatch(setLoading("Buscando dados do aluno"))
    try{
      const req = await getAluno(id)
      if(req){
        dispatch(setLoading(false))
        dispatch(openStudentSheet(req))
      } else {
        dispatch(openStudentSheet(null))
      }
    }catch(error){
      const errorMessage = error instanceof Error? error.message : "Erro na requisição para buscar a lista de alunos"
      setError({
        message: errorMessage, 
        callback: () => {handleOpenStudentSheet(id)}})
    }
  }

  function handleCloseStudentSheet(){
    dispatch(closeStudentSheet())
    controlOpenSheet('close')
  }

  function handleOpenEdit(){
    controlOpenSheet('open')
    setOpenEdit(true)
  }
  
  function handleCloseEdit(){
    setOpenEdit(false)
  }


  return (
    <>
      { loading ? 
        <Loading loadingMessage={loading}/>
      : <>
        {currentStudentSheet ? <>
          {openEdit ? 
            <StudentForm 
            closeForm={handleCloseEdit}/> 
            : <>
            <button type="button"
            onClick={handleCloseStudentSheet}>
              Voltar para a lista de alunos
            </button>
            <StudentSheet 
            openEdit={handleOpenEdit}/>
          </>}
        </>
        : currentStudentSheet !== false ? <p>Não foi encontrado nenhum aluno com o id informado</p> 
        : 
        <>
        {currentStudentsList.length > 0 ? 
          <table className="students-list">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentStudentsList.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.nome}</td>
                  <td className="student-actions">
                    <button 
                    type='button'
                    onClick={()=>{
                      handleOpenStudentSheet(student.id)
                      controlOpenSheet('open')}}>
                      Abrir ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          : <p>Não há nenhum aluno registrado</p>}
          </>
        }
        </>
      }
    </>
  )
}
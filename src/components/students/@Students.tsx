import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/appStore"
import { setLoading } from "../../stores/studentsStore"
import { getAluno } from "../../utils/fetchAPI"
import type { AlunoType } from "../../types/AlunoType";
import { StudentSheet } from "./StudentSheet";
import { StudentForm } from "../studentForm/@StudentForm";
import { Loading } from "../Loading";

interface studentsProps {
  currentStudentsList: Pick<AlunoType, '_id' | 'nome'>[];
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
  const [currentStudentSheet, setCurrentStudentSheet] = useState<false | AlunoType | null>(false)
  const dispatch = useAppDispatch()

  async function handleOpenStudentSheet(id: string){
    dispatch(setLoading("Buscando dados do aluno"))
    try{
      const req = await getAluno(id)
      if(req){
        dispatch(setLoading(false))
        setCurrentStudentSheet(req)
      } else {
        setCurrentStudentSheet(null)
      }
    }catch(error){
      const errorMessage = error instanceof Error? error.message : "Erro na requisição para buscar a lista de alunos"
      setError({
        message: errorMessage, 
        callback: () => {handleOpenStudentSheet(id)}})
    }
  }

  function handleCloseStudentSheet(){
    setCurrentStudentSheet(false)
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
            currentStudentSheet={{student: currentStudentSheet, updateCurrentStudentSheet: setCurrentStudentSheet}}
            closeForm={handleCloseEdit}/> 
            : <>
            <button type="button"
            onClick={handleCloseStudentSheet}>
              Voltar para a lista de alunos
            </button>
            <StudentSheet
            closeStudentSheet={handleCloseStudentSheet}
            currentStudentSheet={currentStudentSheet} 
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
                <tr key={student._id}>
                  <td>{student._id}</td>
                  <td>{student.nome}</td>
                  <td className="student-actions">
                    <button 
                    type='button'
                    onClick={()=>{
                      handleOpenStudentSheet(student._id)
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
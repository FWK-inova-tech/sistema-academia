import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/appStore"
import { setLoading } from "../../stores/studentsStore"
import { getAluno } from "../../service/fetchAPI"
import type { AlunoType } from "../../types/AlunoType";
import { StudentSheet } from "./StudentSheet";
import { StudentForm } from "../studentForm/@StudentForm";
import { Loading } from "../../components/Loading";

interface studentsProps {
  currentStudentsList: Pick<AlunoType, '_id' | 'nome'>[];
  setError: (error: {
    message: string;
    callback: () => Promise<void> | void;
  }) => void;
  handleOpensheet: () => void;
  controlOpenSheet: (action: 'close' | 'open') => void;
}
export const Students = ({ currentStudentsList, setError, handleOpensheet, controlOpenSheet }: studentsProps) => {
  const [openEdit, setOpenEdit] = useState(false)

  // currentStudentSheet == false => nenhuma ficha de aluno aberta, mostrar lista normalmente
  // currentStudentSheet == null => tentou abrir a ficha mas nenhum aluno com aquele id foi retornado 
  const [currentStudentSheet, setCurrentStudentSheet] = useState<false | AlunoType | null>(false)
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.students.loading)
  useEffect(() => {
    console.log(currentStudentSheet)
  }, [currentStudentSheet])

  async function handleOpenStudentSheet(id: string) {
    dispatch(setLoading("Buscando dados do aluno"))
    try {
      const req = await getAluno(id)
      if (req) {
        setCurrentStudentSheet(req)
        handleOpensheet()
      } else {
        setCurrentStudentSheet(null)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro na requisição para buscar os dados do aluno"
      setError({
        message: errorMessage,
        callback: () => { handleOpenStudentSheet(id) }
      })
    } finally {
      dispatch(setLoading(false))
    }
  }

  function handleCloseStudentSheet() {
    setCurrentStudentSheet(false)
    controlOpenSheet('close')
  }

  function handleOpenEdit() {
    controlOpenSheet('open')
    setOpenEdit(true)
  }

  function handleCloseEdit() {
    setOpenEdit(false)
  }


  return (
    <>
      {loading ?
        <Loading loadingMessage={loading} />
        : <>
          {currentStudentSheet ? <>
            {openEdit ?
              <StudentForm
                currentStudentSheet={{ student: currentStudentSheet, updateCurrentStudentSheet: setCurrentStudentSheet }}
                closeForm={handleCloseEdit} />
              : <>
                <span className='w-full flex justify-start'>
                  <button type="button"
                    className='btn btn-green shadow px-3 py-1 mt-4 ml-4'
                    onClick={handleCloseStudentSheet}>
                    Voltar para a lista de alunos
                  </button>
                </span>
                <StudentSheet
                  closeStudentSheet={handleCloseStudentSheet}
                  currentStudentSheet={currentStudentSheet}
                  openEdit={handleOpenEdit} />
              </>}
          </>
            : currentStudentSheet !== false ? <p>Não foi encontrado nenhum aluno com o id informado</p>
              :
              <div className="content students-list">
                <h1 className='text-3xl mb-2'>Alunos</h1>
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
                          <td className={'id'} title={student._id}>
                            #{student._id.slice(0, 7)}...
                          </td>
                          <td>{student.nome}</td>
                          <td className="student-actions">
                            <button
                              className='btn btn-green px-3'
                              type='button'
                              onClick={() => {
                                handleOpenStudentSheet(student._id)
                              }}>
                              Abrir ficha
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  : <p>Não há nenhum aluno registrado</p>}
              </div>
          }
        </>
      }
    </>
  )
}

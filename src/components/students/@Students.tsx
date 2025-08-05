import { useState } from "react"
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

  const tdBodyClasses = "border-b-2 border-[var(--secondaryColor)]"


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
              <div className="content students-list w-full md:py-8 md:px-8 px-0 flex flex-col justify-center">
                <h1 className='text-3xl mb-2 font-medium text-[var(--primaryColor)]'>Alunos</h1>
                {currentStudentsList.length > 0 ?
                  <table className="students-list bg-white">
                    <thead>
                      <tr>
                        <th className="p-2.5 border-b-2 border-[var(--secondaryColor)]">Id</th>
                        <th className="p-2.5 border-b-2 border-[var(--secondaryColor)]">Nome</th>
                        <th className="p-2.5 border-b-2 border-[var(--secondaryColor)]">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStudentsList.map((student, index) => (
                        <tr key={student._id}>
                          <td className={`id text-gray-500 max-w-20
m-auto md:p-5 p-2 text-[0.85rem] break-words px-0 md:px-2 ${index !== currentStudentsList.length - 1 && tdBodyClasses}`} title={student._id}>
                            #{student._id.slice(0, 7)}...
                          </td>
                          <td className={`id max-w-32 md:max-w-max m-auto md:p-5 p-2 ${index !== currentStudentsList.length - 1 && tdBodyClasses}`}>{student.nome}</td>
                          <td className={`student-actions m-auto md:p-5 p-2 ${index !== currentStudentsList.length - 1 && tdBodyClasses}`}>
                            <button
                              className='btn btn-green px-1 md:px-3 text-[0.85rem] rounded-none md:rounded-3xl'
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

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../stores/appStore"
import { setLoading } from "../../../stores/studentsStore"
import { getAluno } from "../../../service/fetchAPI"
import type { AlunoType } from "../../../types/AlunoType";
import { StudentSheet } from "./StudentSheet";
import { StudentForm } from "../../studentForm/components/@StudentForm";
import { Loading } from "../../../components/Loading";
import { Button } from "../../../components/ui";
import '../style/Students.css';

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
    setOpenEdit(true)
  }

  function handleCloseEdit() {
    setOpenEdit(false)
  }

  return (
    <>
      {loading ? (
        <Loading loadingMessage={loading} />
      ) : (
        <>
          {currentStudentSheet ? (
            <>
              {openEdit ? (
                <StudentForm
                  currentStudentSheet={{ student: currentStudentSheet, updateCurrentStudentSheet: setCurrentStudentSheet }}
                  closeForm={handleCloseEdit}
                />
              ) : (
                <div className="h-fit bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                  {/* Header da Ficha do Aluno */}
                  <div className="bg-white shadow-lg border-b border-gray-200">
                    <div className="w-full mx-auto px-6 py-6">
                      <div className="flex flex-wrap items-center gap-6">
                        {/* Botão Voltar */}
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={handleCloseStudentSheet}
                          leftIcon={
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                          }
                          className="hover:bg-gray-100 transition-colors"
                        >
                          Voltar
                        </Button>

                        {/* Informações Principais do Aluno */}
                        <div className="flex items-center gap-6 flex-1">
                          <div className="w-20 h-20 bg-emerald-900 opacity-85 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                            {currentStudentSheet.nome?.charAt(0).toUpperCase() || 'A'}
                          </div>
                          <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                              {currentStudentSheet.nome || 'Nome não informado'}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                </svg>
                                <span className="font-semibold">ID: #{currentStudentSheet._id?.slice(-6) || '------'}</span>
                              </span>
                              {currentStudentSheet.objetivo && (
                                <span className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-lg">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                                    <path d="M9 11l3 3l8-8"></path>
                                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9s4.03-9 9-9c1.51 0 2.93 0.37 4.18 1.03"></path>
                                  </svg>
                                  <span className="font-semibold">{currentStudentSheet.objetivo}</span>
                                </span>
                              )}
                            </div>

                            {/* Badge do Nível e Ações */}
                            <div className="flex flex-wrap justify-start items-center gap-4">
                              {(() => {
                                const nivel = currentStudentSheet.nivel || 'Iniciante';
                                const nivelConfig = {
                                  'Iniciante': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', icon: '🌱' },
                                  'Intermediário': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', icon: '🔥' },
                                  'Avançado': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: '💪' }
                                };
                                const config = nivelConfig[nivel as keyof typeof nivelConfig] || nivelConfig.Iniciante;
                                const nivelSemEmoji = nivel.replace('🌱', '').replace('🔥', '').replace('💪', '').trim();
                                return (
                                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 ${config.bg} ${config.text} ${config.border}`}>
                                    <span className="text-lg">{config.icon}</span>
                                    Nível {nivelSemEmoji}
                                  </span>
                                );
                              })()}

                              {/* Botões de Ação */}
                              <div className="flex flex-wrap gap-3 ml-auto">
                                <button
                                  className='bg-[#006043] text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2'
                                  type="button"
                                  onClick={handleOpenEdit}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  className='bg-[#BE2528] text-white px-6 py-2 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2'
                                  onClick={() => {

                                    const event = new CustomEvent('openDeleteModal');
                                    window.dispatchEvent(event);
                                  }}>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                  Deletar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo da Ficha */}
                  <div className="w-full mx-auto px-6 py-8">
                    <StudentSheet
                      closeStudentSheet={handleCloseStudentSheet}
                      currentStudentSheet={currentStudentSheet}
                    />
                  </div>
                </div>
              )}
            </>
          ) : currentStudentSheet !== false ? (
            <div className="error-message">
              <p>Não foi encontrado nenhum aluno com o id informado</p>
            </div>
          ) : (
            <div className="bg-white min-h-fit rounded-xl shadow-sm border border-gray-200">
              {/* Header da Tabela */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 items-center font-semibold text-gray-700 text-sm">
                  <div className="col-span-2 text-center">ID</div>
                  <div className="col-span-6">Nome do Aluno</div>
                  <div className="col-span-2 text-center">Ações</div>
                </div>
              </div>
              {/* Corpo da Tabela */}
              {currentStudentsList.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum aluno cadastrado</h3>
                  <p className="text-gray-500">Clique em "Novo Aluno" para começar a cadastrar seus alunos!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {currentStudentsList.map((student, index) => (
                    <div
                      key={student._id}
                      className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* ID */}
                      <div className="col-span-2 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700">
                          #{student._id.slice(-4)}
                        </span>
                      </div>

                      {/* Nome do Aluno */}
                      <div className="col-span-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {student.nome.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {student.nome}
                            </p>
                            <p className="text-xs text-gray-500">
                              Aluno #{index + 1}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="col-span-2 text-center">
                        <button
                          onClick={() => handleOpenStudentSheet(student._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-150"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Ver Ficha
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

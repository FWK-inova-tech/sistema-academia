import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/appStore"
import { setAlunos, setLoading } from "../../stores/studentsStore"
import { getAlunos } from "../../service/fetchAPI"
import axios from "axios"
import { logout } from "../../stores/authStore";
import { useHomepage } from "../../hooks/useHomepage";
import { ToastContainer, toast } from "react-toastify";
import { Sidebar } from "../../components/Sidebar";
import { SearchStudent } from "../../features/students/components/SearchStudent";
import { StudentForm } from "../../features/studentForm/components/@StudentForm";
import { Students } from "../../features/students/components/@Students";
import { Settings } from "../../features/settings/components/Settings";
import { Button } from "../../components/ui/Button/Button";
import { Card } from "../../components/ui/Card/Card";
import { DashboardStats } from "../../features/dashboard/components/DashboardStats";
import { ImportAlunos } from "../../features/students/components/ImportAlunos";
import { ImportResultModal } from "../../features/students/components/ImportResultModal";

export const Homepage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const students = useAppSelector((state) => state.students.studentsList)
  const [dashboardStats, setDashboardStats] = useState<{ total: number; novosMes: number, alunosAtivos: number } | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [openImport, setOpenImport] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const { handlers, onSearch, apiError, current, currentStudentsList, openRegister, setApiError, setCurrent, setCurrentStudentsList } = useHomepage({ students, fetchData })
  const { handleCloseOpenEdit, handleCloseRegister, handleOpenRegister, handleSearch, handleOpenStudentsheet } = handlers

  // Handlers para importação
  const handleOpenImport = () => setOpenImport(true)
  const handleCloseImport = () => setOpenImport(false)

  const handleImportComplete = (result: any) => {
    setImportResult(result)
    setOpenImport(false)
    // Recarregar lista de alunos após importação
    fetchData()

    // Mostrar toast de sucesso
    if (result.resumo.alunosImportados > 0) {
      toast.success(`${result.resumo.alunosImportados} aluno(s) importado(s) com sucesso!`)
    }
  }

  const handleCloseImportResult = () => setImportResult(null)

  useEffect(() => {
    dispatch(setLoading("Carregando lista de alunos"))

    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, 30000)

    return () => clearInterval(interval)
  }, [dispatch])

  useEffect(() => {
    setCurrentStudentsList(students)
  }, [students])

  async function fetchData() {
    try {
      const { alunos, stats } = await getAlunos()
      dispatch(setAlunos(alunos))
      setDashboardStats(stats)
      setLastUpdate(new Date())
      dispatch(setLoading(false))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro na requisição para buscar a lista de alunos"
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        dispatch(logout())
        navigate('/login')

      }
      setApiError({ message: errorMessage, callback: fetchData })
    }
  }

  return (
    <div className="flex h-full min-h-fit bg-[#006043] flex-col md:flex-row">
      <ToastContainer />
      {!importResult && !openImport && (

        <Sidebar
          current={current}
          openAlunos={() => setCurrent('students')}
          openConfig={() => setCurrent('settings')}
        />
      )}


      <main className="flex-1 flex flex-col bg-gray-50 min-h-screen h-fit">
        {apiError && !openImport && !importResult && (
          <div className="p-6">
            <Card className="text-center shadow-lg border-0">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Erro</h2>
              <p className="text-gray-700 mb-2">{apiError.message}</p>
              <p className="text-gray-600 mb-4">Tente novamente em alguns minutos</p>
              <Button
                variant="primary"
                onClick={apiError.callback}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Tentar novamente
              </Button>
            </Card>
          </div>
        )}

        {!apiError && !openImport && !importResult && (
          <>
            {current === 'students' && (
              <div className="min-h-screen">
                <section className="bg-[#008058] p-6 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-8 right-12 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute bottom-6 left-16 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></div>
                    <div className="absolute bottom-4 right-6 w-2 h-2 bg-white rounded-full animate-ping delay-150"></div>
                    <div className="absolute top-12 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
                    <div className="absolute bottom-8 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping delay-500"></div>
                  </div>

                  <div className="relative z-10 max-w-none">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-white text-sm font-normal flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span>Atualização automática</span>
                          {lastUpdate && (
                            <span className="text-xs opacity-75">
                              {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <DashboardStats
                      totalStudents={dashboardStats ? dashboardStats.total : students.length}
                      newThisMonth={dashboardStats ? dashboardStats.novosMes : 0}
                      activeStudents={dashboardStats ? dashboardStats.alunosAtivos : 0}
                    />
                  </div>
                </section>

                <section className="p-6 space-y-6 min-h-fit">
                  <div className="bg-[#ffffff54] min-h-fit flex flex-col gap-2 rounded-lg p-2">
                    <div className="p-0">
                      <div className="p-2 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900 mb-1 md:pl-3">Alunos</h2>
                          <p className="text-gray-600 text-sm flex items-center gap-2">
                            {currentStudentsList.length === 0 && (
                              <span className="flex items-center gap-1">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="text-gray-400"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="M8 12h8M12 8v8"></path>
                                </svg>
                                Nenhum aluno cadastrado ainda
                              </span>
                            )}
                            {onSearch && (
                              <span className="flex items-center gap-1">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#006043"
                                  strokeWidth="2"
                                  className="text-green-500"
                                >
                                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="9" cy="7" r="4"></circle>
                                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span className="font-medium text-gray-800">{currentStudentsList.length}</span>
                                aluno{currentStudentsList.length !== 1 ? 's' : ''} encontrado{currentStudentsList.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                          <div className="flex-1 lg:flex-none lg:min-w-[300px]">
                            <SearchStudent handleSearch={handleSearch} />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleOpenImport}
                              className="group relative bg-blue-600 text-white font-medium h-12 px-4 rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                              title="Importar alunos por planilha"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                                <polyline points="14,2 14,8 20,8"></polyline>
                                <path d="M12 11l-4 4 4 4"></path>
                                <path d="M8 15h8"></path>
                              </svg>
                              <span className="hidden sm:inline">Importar</span>
                            </button>
                            <button
                              onClick={handleOpenRegister}
                              className="group relative bg-[#006043] text-white font-medium h-12 px-6 rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px]"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M19 8l5 5m0 0l-5 5m5-5H14"></path>
                              </svg>
                              <span>Novo Aluno</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Students
                      handleOpensheet={handleOpenStudentsheet}
                      controlOpenSheet={handleCloseOpenEdit}
                      currentStudentsList={currentStudentsList}
                      setError={setApiError}
                    />
                  </div>
                </section>
              </div>
            )}

            {current !== 'settings' && current !== 'students' && !openImport && !importResult && (
              <div className="p-6">
                {openRegister ? (
                  <StudentForm closeForm={handleCloseRegister} />
                ) : (
                  <Students
                    handleOpensheet={handleOpenStudentsheet}
                    controlOpenSheet={handleCloseOpenEdit}
                    currentStudentsList={currentStudentsList}
                    setError={setApiError}
                  />
                )}
              </div>
            )}

            {current === 'settings' && <Settings />}
          </>
        )}
      </main>

      {/* Modais de Importação */}
      {openImport && (
        <ImportAlunos
          onImportComplete={handleImportComplete}
          onClose={handleCloseImport}
        />
      )}

      {importResult && (
        <ImportResultModal
          result={importResult}
          onClose={handleCloseImportResult}
        />
      )}
    </div>

  )
}

import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/appStore"
import { setAlunos, setLoading } from "../../stores/studentsStore"
import { getAlunos } from "../../service/fetchAPI"
import '../../style/homepage.css'
import axios from "axios"
import { logout } from "../../stores/authStore";
import { useHomepage } from "../../hooks/useHomepage";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "../../components/Sidebar";
import { SearchStudent } from "../../features/students/components/SearchStudent";
import { StudentForm } from "../../features/studentForm/components/@StudentForm";
import { Students } from "../../features/students/components/@Students";
import { Settings } from "../../features/settings/components/Settings";
import { Button } from "../../components/ui/Button/Button";
import { Card } from "../../components/ui/Card/Card";
import { DashboardStats } from "../../features/dashboard/components/DashboardStats";

export const Homepage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const students = useAppSelector((state) => state.students.studentsList)
  const { handlers, apiError, current, currentStudentsList, openRegister, setApiError, setCurrent, setCurrentStudentsList } = useHomepage({ students })
  const { handleCloseOpenEdit, handleCloseRegister, handleOpenRegister, handleSearch, handleOpenStudentsheet } = handlers

  useEffect(() => {
    dispatch(setLoading("Carregando lista de alunos"))
  }, [dispatch])

  useEffect(() => {
    setCurrentStudentsList(students)
  }, [students])

  async function fetchData() {
    try {
      const req = await getAlunos()
      dispatch(setAlunos(req))
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

  useEffect(() => {
    dispatch(setLoading("Buscando lista de alunos"))

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='flex flex-col w-screen md:flex-row min-h-screen bg-white'>
      <ToastContainer />
      <Sidebar
        current={current}
        openAlunos={() => setCurrent('students')}
        openConfig={() => setCurrent('settings')} />
      <main className='flex-1 bg-gray-50'>
        {apiError ? (
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
        ) : (
          <>
            {current === 'students' && (
              <>
                <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
                  <Card className="border-0 shadow-md">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Gestão de Alunos</h1>
                        <p className="text-gray-600">Gerencie todos os alunos da academia</p>
                      </div>
                      <div className="flex gap-3">
                        <SearchStudent handleSearch={handleSearch} />
                        <Button
                          variant="primary"
                          onClick={handleOpenRegister}
                          className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                        >
                          + Cadastrar aluno
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="p-6">
                  {/* Dashboard Stats */}
                  <div className="mb-8">
                    <DashboardStats 
                      totalStudents={students.length}
                      activeStudents={Math.max(0, students.length - 2)} // Simulação
                      newThisMonth={Math.floor(students.length * 0.1)} // Simulação de 10% novos
                    />
                  </div>
                  
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
              </>
            )}
            
            {current !== 'settings' && current !== 'students' && (
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
    </div>
  )
}

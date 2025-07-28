import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/appStore"
import { setAlunos, setLoading } from "../../stores/studentsStore"
import { getAlunos } from "../../utils/fetchAPI"
import '../../style/dashboard.css'
import '../../style/studentsList.css'
import axios from "axios"
import { logout } from "../../stores/authStore";
import { useDashboard } from "../../hooks/useDashboard";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "../../components/Sidebar";
import { SearchStudent } from "../../components/students/SearchStudent";
import { StudentForm } from "../../components/studentForm/@StudentForm";
import { Students } from "../../components/students/@Students";
import { Settings } from "../../components/Settings";

export const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const students = useAppSelector((state) => state.students.studentsList)
  const { handlers, apiError, current, currentStudentsList, openRegister, setApiError, setCurrent, setCurrentStudentsList } = useDashboard({ students })
  const { handleCloseOpenEdit, handleCloseRegister, handleOpenRegister, handleSearch } = handlers

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
    <div className='flex flex-col w-screen md:flex-row'>
      <ToastContainer />
      <Sidebar
        current={current}
        openAlunos={() => setCurrent('students')}
        openConfig={() => setCurrent('settings')} />
      <main className='w-full h-full bg-[var(--secondaryColor)]'
        id='dashboard'>
        {apiError ? <div>
          <p>Erro</p>
          <p>{apiError.message}</p>
          <p>Tente novamente em alguns minutos</p>
        </div>
          :
          <>
            {current !== 'settings' && <>
              {current === 'students' &&
                <div className="top-bar flex flex-row justify-between w-full px-2 py-4 bg-white">
                  <SearchStudent
                    handleSearch={handleSearch} />
                  <button
                    className='btn btn-green px-3'
                    type="button"
                    onClick={handleOpenRegister}>
                    Cadastrar aluno
                  </button>
                </div>
              }
              {openRegister ?
                <>
                  <StudentForm
                    closeForm={handleCloseRegister} />
                </>
                :
                <Students
                  controlOpenSheet={handleCloseOpenEdit}
                  currentStudentsList={currentStudentsList}
                  setError={setApiError} />
              }
            </>}
            {current === 'settings' && <Settings />}
          </>
        }
      </main>
    </div>)
}

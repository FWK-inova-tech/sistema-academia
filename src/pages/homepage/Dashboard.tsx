import { useEffect, useState } from "react"
import { Sidebar } from "../../components/Sidebar"
import { Students } from "../../components/students/@Students"
import { Settings } from "../../components/Settings"
import { useAppDispatch, useAppSelector } from "../../stores/appStore"
import { setAlunos, setLoading } from "../../stores/studentsStore"
import { getAlunos } from "../../utils/fetchAPI"
import { SearchStudent } from "../../components/students/SearchStudent"
import type { AlunoType } from "../../types/AlunoType"

export const Dashboard = ()=>{
  const [current, setCurrent] = useState<'students' | 'settings' | 'register/edit'>('students')
  type apiErrorType = {
    message: string;
    callback: ()=> Promise<void> | void;
  }
  const [apiError, setApiError] = useState<false | apiErrorType>(false)
  const dispatch = useAppDispatch()
  const students = useAppSelector((state)=> state.students.studentsList)
  const [currentStudentsList, setCurrentStudentsList] = useState<Pick<AlunoType, 'id' | 'nome'>[]>(students)
  

  useEffect(() => {
    dispatch(setLoading("Carregando lista de alunos"))
  }, [dispatch])

  async function fetchData(){
    try{
      const req = await getAlunos()
      dispatch(setAlunos(req))
      dispatch(setLoading(false))
    }catch(error){
      const errorMessage = error instanceof Error ? error.message : "Erro na requisição para buscar a lista de alunos"
      setApiError({message: errorMessage, callback: fetchData})
    }
  }

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

  useEffect(()=>{
    dispatch(setLoading("Buscando lista de alunos"))
    
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div>
      <Sidebar 
      current={current}
      openAlunos={()=> setCurrent('students')}
      openConfig={()=> setCurrent('settings')}/>
      <main>
        {apiError ? <div>
          <p>Erro</p>
          <p>{apiError.message}</p>
          <p>Tente novamente em alguns minutos</p>
          </div>
        : 
        <>
          {current !== 'settings' && <>
            {current === 'students' &&
              <div className="top-bar">
                <SearchStudent
                handleSearch={handleSearch}/>
              </div>
            }
            <Students 
            currentStudentsList={currentStudentsList}
            setError={setApiError}/>
          </>}
          {current === 'settings' && <Settings/>}
        </>
        }
      </main>
    </div>
  )
}
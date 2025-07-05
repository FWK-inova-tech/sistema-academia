import { useEffect, useState } from "react"
import { Sidebar } from "../../components/Sidebar"
import { Students } from "../../components/students/@Students"
import { Settings } from "../../components/Settings"
import { useAppDispatch } from "../../stores/appStore"
import { setAlunos, setLoading } from "../../stores/studentsStore"
import { getAlunos } from "../../utils/fetchAPI"

export const Dashboard = ()=>{
  const [current, setCurrent] = useState<'students' | 'settings' | 'register/edit'>('students')
  type apiErrorType = {
    message: string;
    callback: ()=> Promise<void> | void;
  }
  const [apiError, setApiError] = useState<false | apiErrorType>(false)
  const dispatch = useAppDispatch()

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
                barra de pesquisa + button cadastrar aluno
              </div>
            }
            <Students setError={setApiError}/>
          </>}
          {current === 'settings' && <Settings/>}
        </>
        }
      </main>
    </div>
  )
}
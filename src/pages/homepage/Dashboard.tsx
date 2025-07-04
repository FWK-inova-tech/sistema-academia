import { useEffect, useState } from "react"
import { Sidebar } from "../../components/Sidebar"
import { Students } from "../../components/students/@Students"
import { Settings } from "../../components/Settings"
import { useAppDispatch } from "../../stores/appStore"
import { setAlunos, setLoading } from "../../stores/studentsStore"
import { getAlunos } from "../../utils/fetchAPI"

export const Dashboard = ()=>{
  const [current, setCurrent] = useState<'students' | 'settings'>('students')
  const [apiError, setApiError] = useState<false | string>(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setLoading("Carregando lista de alunos"))
  }, [dispatch])


  useEffect(()=>{
    dispatch(setLoading("Buscando lista de alunos"))
    async function fetchData(){
      try{
        const req = await getAlunos()
        dispatch(setAlunos(req))
        dispatch(setLoading(false))
      }catch(error){
        const errorMessage = error instanceof Error ? error.message : "Erro na requisição para buscar a lista de alunos"
        setApiError(errorMessage)
      }
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


  
  return (
    <div>
      <p>Teste</p>
      <Sidebar 
      current={current}
      openAlunos={()=> setCurrent('students')}
      openConfig={()=> setCurrent('settings')}/>
      
      {apiError ? <div>
        <p>Erro</p>
        <p>{apiError}</p>
        <p>Tente novamente em alguns minutos</p>
        </div>
      : 
      <>
        {current === 'students' && <Students/>}
        {current === 'settings' && <Settings/>}
      </>
      }
    </div>
  )
}
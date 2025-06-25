import { useState } from "react"
import { Sidebar } from "../../components/Sidebar"
import { Alunos } from "../../components/Alunos"
import { Config } from "../../components/Config"

export const Dashboard = ()=>{
  const [current, setCurrent] = useState<'alunos' | 'config'>('alunos')
  return (
    <div>
      <Sidebar 
      current={current}
      openAlunos={()=> setCurrent('alunos')}
      openConfig={()=> setCurrent('config')}/>
      {current === 'alunos' && <Alunos/>}
      {current === 'config' && <Config/>}
    </div>
  )
}
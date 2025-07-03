import { useState } from "react"
import { Sidebar } from "../../components/Sidebar"
import { Students } from "../../components/Students"
import { Settings } from "../../components/Settings"
import { StudentForm } from "../../components/studentForm/@StudentForm"

export const Dashboard = ()=>{
  const [current, setCurrent] = useState<'students' | 'settings'>('students')
  return (
    <div>
      <p>Teste</p>
      <Sidebar 
      current={current}
      openAlunos={()=> setCurrent('students')}
      openConfig={()=> setCurrent('settings')}/>
      {current === 'students' && <Students/>}
      {current === 'settings' && <Settings/>}
      <StudentForm/>
    </div>
  )
}
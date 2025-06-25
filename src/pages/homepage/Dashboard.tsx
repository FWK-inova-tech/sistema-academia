import { useState } from "react"
import { Sidebar } from "../../components/Sidebar"
import { Students } from "../../components/Students"
import { Settings } from "../../components/Settings"

export const Dashboard = ()=>{
  const [current, setCurrent] = useState<'students' | 'settings'>('students')
  return (
    <div>
      <Sidebar 
      current={current}
      openAlunos={()=> setCurrent('students')}
      openConfig={()=> setCurrent('settings')}/>
      {current === 'students' && <Students/>}
      {current === 'settings' && <Settings/>}
    </div>
  )
}
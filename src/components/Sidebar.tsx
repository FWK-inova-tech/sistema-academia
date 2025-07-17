import { useAppSelector } from "../stores/appStore"

interface sidebarProps {
  current: 'students' | 'settings' | 'register/edit/sheet'
  openAlunos: () => void;
  openConfig: () => void;
}
export const Sidebar = ({ openAlunos, openConfig, current } : sidebarProps) => {
  const isStudentsLoading = useAppSelector((state)=> state.students.loading)
  const isAuthLoading = useAppSelector((state)=> state.auth.loading)

  return (
  <aside className='sidebar'>
    <button 
    id='butao-abrir-alunos'
    type="button" 
    onClick={openAlunos}
    disabled={isStudentsLoading || isAuthLoading || current !== 'settings' ? true : false}> 
      Alunos
    </button>
    <button 
    type="button"
    onClick={openConfig} 
    disabled={isStudentsLoading || isAuthLoading  || current === 'settings' ? true : false}>
      Configurações
    </button>
  </aside>)
}
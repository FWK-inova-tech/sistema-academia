import { useAppSelector } from "../stores/appStore"

interface sidebarProps {
  current: 'students' | 'settings' | 'register/edit/sheet'
  openAlunos: () => void;
  openConfig: () => void;
}
export const Sidebar = ({ openAlunos, openConfig, current } : sidebarProps) => {
  const isLoading = useAppSelector((state)=> state.students.loading
)
  return (
  <aside>
    <button 
    id='butao-abrir-alunos'
    type="button" 
    onClick={openAlunos}
    disabled={isLoading || current !== 'settings' ? true : false}> 
      Alunos
    </button>
    <button 
    type="button"
    onClick={openConfig} 
    disabled={isLoading || current === 'settings' ? true : false}>
      Configurações
    </button>
  </aside>)
}
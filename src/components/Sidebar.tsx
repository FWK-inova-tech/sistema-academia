import { useAppSelector } from "../stores/appStore"

interface sidebarProps {
  current: 'alunos' | 'config'
  openAlunos: () => void;
  openConfig: () => void;
}
export const Sidebar = ({ openAlunos, openConfig, current } : sidebarProps) => {
  const isLoading = useAppSelector((state)=> state.alunos.loading)
  return (
  <aside>
    <button 
    type="button" 
    onClick={openAlunos}
    disabled={isLoading || current === 'alunos'}> 
      Alunos
    </button>
    <button 
    type="button"
    onClick={openConfig} 
    disabled={isLoading || current === 'config'}>
      Configurações
    </button>
  </aside>)
}
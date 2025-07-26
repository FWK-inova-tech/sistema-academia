import { useAppSelector } from "../stores/appStore"

interface sidebarProps {
  current: 'students' | 'settings' | 'register/edit/sheet'
  openAlunos: () => void;
  openConfig: () => void;
}
export const Sidebar = ({ openAlunos, openConfig, current }: sidebarProps) => {
  const isStudentsLoading = useAppSelector((state) => state.students.loading)
  const isAuthLoading = useAppSelector((state) => state.auth.loading)


  return (
    <aside
      className='sidebar flex flex-col bg-[var(--primaryColor)] w-[200px] px-2 pt-2'>
      <button
        id='botao-abrir-alunos'
        type="button"
        onClick={openAlunos}
        className={`rounded-[10px] font-medium text-[1.25em]
        ${current !== "settings" ?
            'active bg-[var(--secondaryColor)] text-[var(--primaryColor)]'
            :
            'bg-[var(--primaryColor)] text-[var(--secondaryColor)]'}`}
        disabled={isStudentsLoading || isAuthLoading || current !== 'settings' ? true : false}>
        Alunos
      </button>
      <button
        type="button"
        onClick={openConfig}
        className={`rounded-[10px] font-medium text-[1.25em]
        ${current === "settings" && 'active' ?
            'active bg-[var(--secondaryColor)] text-[var(--primaryColor)]'
            :
            'bg-[var(--primaryColor)] text-[var(--secondaryColor)]'}`}
        disabled={isStudentsLoading || isAuthLoading || current === 'settings' ? true : false}>
        Configurações
      </button>
    </aside>)
}

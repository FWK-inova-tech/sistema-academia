import { useAppSelector } from "../stores/appStore"
import './Sidebar.css'

interface sidebarProps {
  current: 'students' | 'settings' | 'register/edit/sheet'
  openAlunos: () => void;
  openConfig: () => void;
}

export const Sidebar = ({ openAlunos, openConfig, current }: sidebarProps) => {
  const isStudentsLoading = useAppSelector((state) => state.students.loading)
  const isAuthLoading = useAppSelector((state) => state.auth.loading)

  const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  )

  const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  )

  return (
    <aside className='sidebar'>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">💪</span>
          <span className="sidebar-logo-text">ProFitness</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          type="button"
          onClick={openAlunos}
          className={`sidebar-button ${current !== "settings" ? 'sidebar-button--active' : ''}`}
          disabled={Boolean(isStudentsLoading || isAuthLoading || current !== 'settings')}
        >
          <UsersIcon />
          <span>Alunos</span>
        </button>
        
        <button
          type="button"
          onClick={openConfig}
          className={`sidebar-button ${current === "settings" ? 'sidebar-button--active' : ''}`}
          disabled={Boolean(isStudentsLoading || isAuthLoading || current === 'settings')}
        >
          <SettingsIcon />
          <span>Configurações</span>
        </button>
      </nav>
    </aside>
  )
}

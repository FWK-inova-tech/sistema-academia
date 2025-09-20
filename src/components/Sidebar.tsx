import { useAppSelector } from "../stores/appStore"
// import '../style/Sidebar.css'
import Logo from "../assets/logo.png"

interface sidebarProps {
  current: 'students' | 'settings' | 'register/edit/sheet'
  openAlunos: () => void;
  openConfig: () => void;
}

export const Sidebar = ({ openAlunos, openConfig, current }: sidebarProps) => {
  const isStudentsLoading = useAppSelector((state) => state.students.loading)
  const isAuthLoading = useAppSelector((state) => state.auth.loading)

  const UsersIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  )

  const SettingsIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  )

  return (
    <aside
      className="
    bg-[#06302b] w-screen md:w-[280px] lg:w-[300px] md:min-h-full md:h-full
     flex flex-col 
    md:flex-col
    border-r border-green-800/50
  "
    >
      {/* Header */}
      <div
        className="
      hidden md:flex justify-center items-center shrink-0 text-center
      px-6 pt-8 pb-6
      
    "
      >
        <div className="hidden md:flex">
          <img
            className="
          h-[60px] w-auto max-w-full object-contain
          transition-transform duration-300 ease-in-out
          hover:scale-105
        "
            src={Logo}
            alt="Academia Pro"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="
      flex flex-row flex-1 gap-3 p-6
      md:flex-col md:p-4 md:gap-4
      justify-center md:justify-start
    "
      >
        <button
          type="button"
          onClick={openAlunos}
          disabled={Boolean(isStudentsLoading || isAuthLoading || current !== 'settings')}
          className={`
flex items-center justify-center md:justify-between gap-4 min-w-fit w-5/12 md:w-full
        px-2 md:px-4 py-4 rounded-xl font-medium text-white
        border border-white/20 bg-white/10 backdrop-blur-md
        transition-all duration-300
        hover:translate-y-[-2px] hover:bg-white/20 hover:border-white/30
        hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:border-2 disabled:transform-none
        [&>svg]:w-5 [&>svg]:h-5 [&>svg]:transition-transform [&>svg]:duration-200
        hover:[&>svg]:scale-110
        ${current === "settings" ? "bg-white/25 border-white/40 shadow-[0_4px_15px_rgba(0,0,0,0.2)]" : ""}

              `}
        >
          <UsersIcon />
          <span className="flex justify-start w-fit md:w-full">Alunos</span>
        </button>

        <button
          type="button"
          onClick={openConfig}
          disabled={Boolean(isStudentsLoading || isAuthLoading || current === 'settings')}
          className={`
        flex items-center justify-center md:justify-between gap-4 min-w-fit w-5/12 md:w-full
        px-2 md:px-4 py-4 rounded-xl font-medium text-white
        border border-white/20 bg-white/10 backdrop-blur-md
        transition-all duration-300
        hover:translate-y-[-2px] hover:bg-white/20 hover:border-white/30
        hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        [&>svg]:w-5 [&>svg]:h-5 [&>svg]:transition-transform [&>svg]:duration-200
        hover:[&>svg]:scale-110
        ${current === "settings" ? "bg-white/25 border-white/40 shadow-[0_4px_15px_rgba(0,0,0,0.2)]" : ""}
      `}
        >
          <SettingsIcon />
          <span className="flex justify-start w-fit md:w-full">Configurações</span>
        </button>
      </nav>

    </aside>

  )

}

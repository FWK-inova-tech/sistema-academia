import type { AlunoType } from "../../../types/AlunoType"
import { Perimetria } from "./Perimetria";
import { InformacoesPessoais } from "./InformacoesPessoais";
import { InfoTreino } from "./InfoTreino";
import { Agenda } from "./Agenda";
import { ItemTreino } from "./ItemTreino";
import { treinosOpcoes } from "../../../constants/treinosOpcoes";
import { newStudentInitialValue } from "../../../constants/newStudentInitialValue";
import { useStudentForm } from "../hooks/useStudentForm";
import type { sectionType } from "../../../types/SectionTypes";
import "../style/StudentForm.css";

interface buttonProps {
  name: sectionType;
}

interface studentFormProps {
  currentStudentSheet?: { student: AlunoType; updateCurrentStudentSheet: (data: AlunoType) => void };
  closeForm: () => void;
}
export const StudentForm = ({ closeForm, currentStudentSheet }: studentFormProps) => {

  const studentInitialValue: Omit<AlunoType, '_id'> | AlunoType =
    currentStudentSheet ? currentStudentSheet.student : newStudentInitialValue

  const {
    infoPessoais, agenda, infosTreino, perimetria, treino, activeSections, sectionErrors,
    setInfoPessoais, setAgenda, setInfosTreino, setPerimetria, handleTreinoChecklist, setActiveSections, setSectionErrors, submitForm
  } = useStudentForm({ student: studentInitialValue, closeForm })

  const SectionButton = ({ name }: buttonProps) => {
    const isOpen = activeSections.includes(name)
    return (
      <button
        type="button"
        onClick={() =>
          setActiveSections((prev) =>
            prev.includes(name)
              ? prev.filter((s) => s !== name)
              : [...prev, name]
          )
        }
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isOpen 
            ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-primary-200)] border border-[var(--color-primary-300)]' 
            : 'bg-gray-300/90 text-gray-700 hover:bg-gray-400/80 border border-gray-500/50 shadow-sm backdrop-blur-sm'
        }`}
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
        {isOpen ? 'Fechar' : 'Abrir'}
      </button>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    submitForm(currentStudentSheet)
  }

  const sectionElements = [{
    title: 'Informações Pessoais',
    name: 'pessoais',
    icon: '👤',
    description: 'Nome, contato e data de nascimento',
    element: <InformacoesPessoais
      editingStudent={infoPessoais}
      resetError={() => setSectionErrors(prev => ({ ...prev, pessoais: undefined }))}
      handleUpdateInformacoes={setInfoPessoais}
      erroMsg={sectionErrors.pessoais} />
  },
  {
    title: 'Agenda',
    name: 'agenda',
    icon: '📅',
    description: 'Dias da semana para treino',
    element:
      <Agenda
        resetError={() => setSectionErrors(prev => ({ ...prev, agenda: undefined }))}
        editingAgenda={agenda}
        setAgenda={setAgenda}
        erroMsg={sectionErrors.agenda} />
  },
  {
    title: 'Informações para treino',
    name: 'infoTreino',
    icon: '💪',
    description: 'Nível, professor e observações',
    element:
      <InfoTreino
        editingInfoTreino={infosTreino}
        updateInfo={(newInfo) => {
          setInfosTreino(newInfo)
          setSectionErrors(prev => ({ ...prev, infoTreino: undefined }))
        }}
        erroMsg={sectionErrors.infoTreino} />
  },
  {
    title: 'Perimetria',
    name: 'perimetria',
    icon: '📏',
    description: 'Medidas corporais do aluno',
    element:
      <Perimetria
        editingPerimetria={perimetria}
        resetError={() => setSectionErrors(prev => ({ ...prev, perimetria: undefined }))}
        setPerimetria={setPerimetria}
        erroMsg={sectionErrors.perimetria} />
  },
  {
    title: 'Treino',
    name: 'treino',
    icon: '🏋️',
    description: 'Exercícios por categoria',
    element:
      <div className='treino flex flex-col gap-6 w-full'>
        {treinosOpcoes.map(categoria => <ItemTreino
          item={categoria}
          studentList={treino.find(item => item.categoria === categoria.categoria)?.exercicios ?? []}
          key={categoria.categoria}
          editing={{ handleTreinoChecklist }} />
        )}
      </div>
  }
  ]

  return (
    <div className="w-full h-full min-h-screen bg-[#0b453a] flex flex-col">
      {/* Header/Navbar fixo - alinhado com sidebar */}
      <div className="bg-[#0b453a] shadow-lg border-b border-green-800/30 sticky top-0 z-10">
        <div className="flex">
          {/* Espaço para alinhamento com sidebar */}
          <div className="hidden md:block w-[280px] lg:w-[300px] bg-[#0b453a]">
            <div className="px-6 py-5 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-primary-700)] rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md">
                {currentStudentSheet ? '✏️' : '➕'}
              </div>
            </div>
          </div>
          
          {/* Conteúdo principal do header */}
          <div className="flex-1 px-6 py-5 bg-[#0b453a]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Ícone mobile */}
                <div className="md:hidden w-12 h-12 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-primary-700)] rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {currentStudentSheet ? '✏️' : '➕'}
                </div>
                <div>
                  <h1 className='text-2xl md:text-3xl font-bold text-white tracking-tight'>
                    {currentStudentSheet ? 'Editando aluno' : 'Novo cadastro'}
                  </h1>
                  {currentStudentSheet && (
                    <p className="text-green-200 font-medium text-base md:text-lg mt-1">{currentStudentSheet.student.nome}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={closeForm}
                  className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 text-green-200 hover:text-white hover:bg-green-800/50 rounded-xl transition-all duration-200 font-medium border border-green-700/50 backdrop-blur-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span className="hidden sm:inline">Fechar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Container principal ocupando todo espaço disponível */}
      <div className="flex-1 bg-[#0b453a] overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-6 pb-32">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Progress indicator */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-green-700/30 p-6 shadow-lg">
              <div className="flex items-center justify-between text-sm text-green-100 mb-3">
                <span className="font-medium">Progresso do cadastro</span>
                <span className="text-green-200">{activeSections.length} de {sectionElements.length} seções abertas</span>
              </div>
              <div className="bg-green-900/50 rounded-full h-3 border border-green-700/50">
                <div 
                  className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-400)] h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${(activeSections.length / sectionElements.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Sections organizadas em layout limpo */}
            <div className="space-y-6">
              {sectionElements.map(section => (
                <div 
                  key={section.name} 
                  className={`bg-gray-200/95 backdrop-blur-sm rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
                    sectionErrors[section.name as sectionType] 
                      ? 'border-red-400 shadow-red-200/50 bg-red-100/90' 
                      : activeSections.includes(section.name as sectionType)
                        ? 'border-[var(--color-primary-400)] shadow-green-200/30 bg-gray-150/95'
                        : 'border-green-200/50 hover:border-green-300/70 hover:shadow-xl hover:bg-gray-150/95'
                  }`}
                >
                  {/* Header da seção */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-300/80 bg-gradient-to-r from-gray-300/80 to-gray-200/90">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[var(--color-primary-700)] rounded-xl flex items-center justify-center text-white text-xl shadow-md">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 font-medium">
                          {section.description}
                        </p>
                      </div>
                    </div>
                    <SectionButton name={section.name as sectionType} />
                  </div>
                  
                  {/* Conteúdo da seção */}
                  {activeSections.includes(section.name as sectionType) && (
                    <div className="p-6 bg-gray-100/95">
                      {section.element}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* Rodapé com ações fixo - sempre no final da tela */}
      <div className="fixed bottom-0 left-0 right-0 z-20 shadow-2xl">
        <div className="flex">
          {/* Espaço do sidebar */}
          <div className="hidden md:block w-[280px] lg:w-[300px] bg-[#06302b]">
          </div>
          {/* Área dos botões */}
          <div className="flex-1 bg-[#0b453a] px-6 py-4">
            <div className="flex justify-center gap-4">
              <button 
                type="button" 
                onClick={closeForm}
                className="px-8 py-3 text-white bg-red-400 hover:bg-red-500 border border-red-300 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] px-12 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {currentStudentSheet ? 'Atualizar Aluno' : 'Cadastrar Aluno'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

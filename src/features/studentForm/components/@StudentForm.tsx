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
            : 'bg-white/90 text-gray-700 hover:bg-white border border-gray-300 shadow-sm backdrop-blur-sm'
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
    <div className="min-h-screen bg-[#0b453a]">
      {/* Header/Navbar fixo */}
      <div className="bg-[#06302b] shadow-lg border-b border-green-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--color-primary-700)] rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
                {currentStudentSheet ? '✏️' : '➕'}
              </div>
              <div>
                <h1 className='text-2xl font-bold text-white'>
                  {currentStudentSheet ? 'Editando aluno' : 'Novo cadastro'}
                </h1>
                {currentStudentSheet && (
                  <p className="text-green-200 font-medium">{currentStudentSheet.student.nome}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={closeForm}
                className="flex items-center gap-2 px-4 py-2 text-green-200 hover:text-white hover:bg-green-800 rounded-lg transition-all duration-200 font-medium"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Container principal com padding e máxima largura */}
      <div className="max-w-6xl mx-auto p-6">
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
                className={`bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border transition-all duration-300 overflow-hidden ${
                  sectionErrors[section.name as sectionType] 
                    ? 'border-red-400 shadow-red-200/50 bg-red-50/95' 
                    : activeSections.includes(section.name as sectionType)
                      ? 'border-[var(--color-primary-400)] shadow-green-200/30 bg-white/98'
                      : 'border-green-200/50 hover:border-green-300/70 hover:shadow-xl'
                }`}
              >
                {/* Header da seção */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/80 to-white/90">
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
                  <div className="p-6 bg-white/98">
                    {section.element}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Rodapé com ações fixo */}
          <div className="bg-[#06302b]/95 backdrop-blur-sm border-t border-green-700/50 sticky bottom-0 py-6 mt-8 rounded-t-xl shadow-2xl">
            <div className="flex justify-center gap-6">
              <button 
                type="button" 
                onClick={closeForm}
                className="px-8 py-3 text-green-200 bg-green-800/50 hover:bg-green-700/70 border border-green-600/50 rounded-lg font-medium transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
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
        </form>
      </div>
    </div>
  )
}

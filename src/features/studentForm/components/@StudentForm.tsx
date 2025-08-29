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
            ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header fixo */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {currentStudentSheet ? '✏️' : '➕'}
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-800'>
                  {currentStudentSheet ? 'Editando aluno' : 'Novo cadastro'}
                </h1>
                {currentStudentSheet && (
                  <p className="text-gray-600 font-medium">{currentStudentSheet.student.nome}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={closeForm}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium"
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

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progresso do cadastro</span>
              <span>{activeSections.length} de {sectionElements.length} seções abertas</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(activeSections.length / sectionElements.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Sections em layout vertical */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {sectionElements.map(section => (
            <div 
              key={section.name} 
              className={`bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                sectionErrors[section.name as sectionType] 
                  ? 'border-red-300 shadow-red-100' 
                  : activeSections.includes(section.name as sectionType)
                    ? 'border-green-300 shadow-green-100'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {section.icon} {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 font-medium">
                      {section.description}
                    </p>
                  </div>
                </div>
                <SectionButton name={section.name as sectionType} />
              </div>
              
              {activeSections.includes(section.name as sectionType) && (
                <div className="p-6 bg-gray-50 rounded-b-xl">
                  {section.element}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions fixas no bottom */}
        <div className="bg-white border-t border-gray-200 sticky bottom-0 py-4 shadow-lg">
          <div className="flex justify-center gap-4">
            <button 
              type="button" 
              onClick={closeForm}
              className="px-8 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-12 py-3 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              {currentStudentSheet ? 'Atualizar Aluno' : 'Cadastrar Aluno'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

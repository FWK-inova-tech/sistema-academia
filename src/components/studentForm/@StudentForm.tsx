import type { AlunoType } from "../../types/AlunoType"
import { Perimetria } from "./Perimetria";
import { InformacoesPessoais } from "./InformacoesPessoais";
import { InfoTreino } from "./InfoTreino";
import { Agenda } from "./Agenda";
import { ItemTreino } from "../treino/@ItemTreino";
import { treinosOpcoes } from "../../constants/treinosOpcoes";
import { newStudentInitialValue } from "../../constants/newStudentInitialValue";
import { useStudentForm } from "../../hooks/useStudentForm";
import type { sectionType } from "../../types/SectionTypes";
import { Button } from "../ui/Button/Button";
import { Card } from "../ui/Card/Card";
import "./StudentForm.css";

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
    return <Button
      variant="secondary"
      size="sm"
      onClick={() =>
        setActiveSections((prev) =>
          prev.includes(name)
            ? prev.filter((s) => s !== name)
            : [...prev, name]
        )
      }>
      {activeSections.includes(name) ? 'Fechar' : 'Abrir'}
    </Button>
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    submitForm(currentStudentSheet)
  }



  const sectionElements = [{
    title: 'Informações Pessoais',
    name: 'pessoais',
    element: <InformacoesPessoais
      editingStudent={infoPessoais}
      resetError={() => setSectionErrors(prev => ({ ...prev, pessoais: undefined }))}
      handleUpdateInformacoes={setInfoPessoais}
      erroMsg={sectionErrors.pessoais} />
  },
  {
    title: 'Agenda',
    name: 'agenda',
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
    element:
      <div className='treino flex flex-col items-center justify-center gap-3 w-full'>
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
    <div className="student-form-container bg-gray-50 min-h-screen p-6">
      <Card className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <h1 className='text-3xl font-semibold text-gray-900 mb-2'>
              {currentStudentSheet ? 'Editando ' : 'Cadastrando '} aluno
            </h1>
            {currentStudentSheet && (
              <h2 className="text-lg text-gray-600">{currentStudentSheet.student.nome}</h2>
            )}
          </div>
          
          <div className="space-y-4">
            {sectionElements.map(section => (
              <Card 
                key={section.name} 
                className={`border-2 ${
                  sectionErrors[section.name as sectionType] 
                    ? 'border-red-500' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {section.title}
                  </h3>
                  <SectionButton name={section.name as sectionType} />
                </div>
                
                {activeSections.includes(section.name as sectionType) && (
                  <div className="pt-4 border-t border-gray-200">
                    {section.element}
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <Button type="submit" variant="primary" size="lg">
              Salvar
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              size="lg" 
              onClick={closeForm}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

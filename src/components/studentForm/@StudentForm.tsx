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
    return <button
      className="btn btn-green px-6 py-[2px]"
      onClick={() =>
        setActiveSections((prev) =>
          prev.includes(name)
            ? prev.filter((s) => s !== name)
            : [...prev, name]
        )
      }>
      {activeSections.includes(name) ? 'Fechar' : 'Abrir'}
    </button>
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
    <form onSubmit={handleSubmit} className="form-student bg-white">
      <h1 className='text-3xl text-[var(--primaryColor)] font-medium'>
        {currentStudentSheet ? 'Editando ' : 'Cadastrando '} aluno
      </h1>
      {currentStudentSheet && <h2>{currentStudentSheet.student.nome}</h2>}
      {sectionElements.map(section => <>
        <span key={section.name} className={`
        form-item border py-2 w-[40em] px-3 gap-2
        ${sectionErrors[section.name as sectionType] ? 'border-red-600' : 'border-[var(--primaryColor)]'}`}>
          <h3 className="font-medium text-[var(--primaryColor)]">
            {section.title}
          </h3>
          {activeSections.includes(section.name as sectionType) && (
            <> {section.element} </>
          )}
          <SectionButton name={section.name as sectionType} />
        </span>
      </>)}

      <button type="submit" className='btn btn-blue px-3'>Salvar</button>
      <button type="button" className='btn btn-red px-3' onClick={closeForm}>
        Cancelar
      </button>
    </form >
  )
}

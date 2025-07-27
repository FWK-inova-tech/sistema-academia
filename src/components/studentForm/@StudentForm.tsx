import type { AlunoType } from "../../types/AlunoType"
import { Perimetria } from "./Perimetria";
import { InformacoesPessoais } from "./InformacoesPessoais";
import { InfoTreino } from "./InfoTreino";
import { Agenda } from "./Agenda";
import { validadeFormSubmit } from "./formHooks";
import { ItemTreino } from "../treino/@ItemTreino";
import { treinosOpcoes } from "../../constants/treinosOpcoes";
import { toast } from "react-toastify";
import { registerAluno, updateAluno } from "../../utils/fetchAPI";
import { useAppDispatch } from "../../stores/appStore";
import { addAluno, setLoading, updateStudentNameOnList } from "../../stores/studentsStore";
import { newStudentInitialValue } from "../../constants/newStudentInitialValue";
import { useStudentForm } from "../../hooks/useStudentForm";
import type { sectionType } from "../../types/SectionTypes";

interface buttonProps {
  name: sectionType;
}


interface studentFormProps {
  currentStudentSheet?: {
    student: AlunoType;
    updateCurrentStudentSheet: (data: AlunoType) => void
  };
  closeForm: () => void;
}
export const StudentForm = ({ closeForm, currentStudentSheet }: studentFormProps) => {
  const dispatch = useAppDispatch()

  const studentInitialValue: Omit<AlunoType, '_id'> | AlunoType =
    currentStudentSheet ? currentStudentSheet.student : newStudentInitialValue

  const {
    infoPessoais, agenda, infosTreino, perimetria, treino, activeSections, sectionErrors,
    setInfoPessoais, setAgenda, setInfosTreino, setPerimetria, setTreino, setActiveSections, setSectionErrors
  } = useStudentForm(studentInitialValue)

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

  function handleTreinoChecklist(e: React.ChangeEvent<HTMLInputElement>, categoria: string) {
    const { value, checked } = e.target

    setTreino(prev => {
      const existing = prev.find(item => item.categoria === categoria)
      if (checked) {
        if (existing) {
          return prev.map(item =>
            item.categoria === categoria
              ? { ...item, exercicios: [...item.exercicios, value] }
              : item
          )
        } else {
          return [...prev, { categoria, exercicios: [value] }]
        }
      } else {
        return prev
          .map(item =>
            item.categoria === categoria
              ? { ...item, exercicios: item.exercicios.filter(ex => ex !== value) }
              : item
          )
          .filter(item => item.exercicios.length > 0)
      }
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    let validatedData: Omit<AlunoType, '_id'> | AlunoType | undefined = validadeFormSubmit({
      data: { infoPessoais, agenda, infosTreino, perimetria, treino },
      setSectionErrors: setSectionErrors
    })

    async function handleRegister() {
      closeForm()
      await registerAluno(validatedData as Omit<AlunoType, '_id'>)
        .then((data) => {
          // atualiza a lista de alunos da store com o novo aluno agora com o _id retornado pelo backend
          dispatch(addAluno({ _id: data, nome: validatedData!.nome }))
        })
        .catch(error => {
          const errorMessage = error instanceof Error ? error.message : 'Erro ao tentar registrar ficha'
          throw new Error(errorMessage)
        })
    }

    async function handleUpdate() {
      const oldData = currentStudentSheet?.student
      dispatch(setLoading("Atualizando ficha do aluno"))

      await updateAluno(validatedData as AlunoType)
        .then(() => {
          if (oldData && validatedData && oldData.nome !== validatedData.nome) {
            // atualiza o nome do aluno na lista de alunos
            dispatch(updateStudentNameOnList({ _id: oldData._id, nome: validatedData.nome }))
          }
          // atualiza as informações de studentSheet
          if (currentStudentSheet) currentStudentSheet.updateCurrentStudentSheet(validatedData as AlunoType)

        })
        .catch((error) => {
          const errorMessage = error instanceof Error ? `Erro ao tentar registrar ficha: ${error.message}` : 'Erro ao tentar registrar ficha'
          toast.error(errorMessage)
        })
        .finally(() => {
          closeForm()
          dispatch(setLoading(false))
        })
    }

    if (validatedData) {
      if ('_id' in studentInitialValue) {
        validatedData = { ...validatedData, _id: studentInitialValue._id }
      }

      if ('_id' in validatedData) {
        handleUpdate()
      } else {
        toast.promise(handleRegister, {
          pending: 'Registrando ficha do aluno',
          error: 'Erro ao tentar salvar ficha',
          success: 'Ficha registrada com sucesso'
        })
      }
    }

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
    name: 'perimetria',
    element:
      <div className='treino'>
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
        <span className={`
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

      <button type="submit">Salvar</button>
      <button type="button" onClick={closeForm}>
        Cancelar
      </button>
    </form >
  )
}

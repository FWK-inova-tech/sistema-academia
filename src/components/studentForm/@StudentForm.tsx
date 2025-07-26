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
    infoPessoais, agenda, infosTreino, perimetria, treino, section, sectionErrors,
    setInfoPessoais, setAgenda, setInfosTreino, setPerimetria, setTreino, setSection, setSectionErrors
  } = useStudentForm(studentInitialValue)

  const SectionButton = ({ name }: buttonProps) => {
    return <button onClick={() =>
      setSection((prev) =>
        prev.includes(name)
          ? prev.filter((s) => s !== name)
          : [...prev, name]
      )
    }>
      {section.includes(name) ? 'Fechar' : 'Abrir'}
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

  return (
    <form onSubmit={handleSubmit} className="form-student">
      <h1>{currentStudentSheet ? 'Editando ' : 'Cadastrando '} aluno</h1>
      {currentStudentSheet && <h2>{currentStudentSheet.student.nome}</h2>}
      <span className={`form-item ${sectionErrors.pessoais && 'error-section'}`}>
        <h3>Informações pessoais</h3>
        {section.includes('pessoais') && (
          <InformacoesPessoais
            editingStudent={infoPessoais}
            resetError={() => setSectionErrors(prev => ({ ...prev, pessoais: undefined }))}
            handleUpdateInformacoes={setInfoPessoais}
            erroMsg={sectionErrors.pessoais}
          />
        )}
        <SectionButton name="pessoais" />
      </span>

      <span className={`form-item ${sectionErrors.agenda && 'error-section'}`}>
        <h3>Agenda</h3>
        {section.includes('agenda') && (
          <Agenda
            resetError={() => setSectionErrors(prev => ({ ...prev, agenda: undefined }))}
            editingAgenda={agenda}
            setAgenda={setAgenda}
            erroMsg={sectionErrors.agenda}
          />
        )}
        <SectionButton name='agenda' />
      </span>

      <span className={`form-item ${sectionErrors.infoTreino && 'error-section'}`}>
        <h3>Informações para treino</h3>
        {section.includes('infoTreino') && (
          <InfoTreino
            editingInfoTreino={infosTreino}
            updateInfo={(newInfo) => {
              setInfosTreino(newInfo)
              setSectionErrors(prev => ({ ...prev, infoTreino: undefined }))
            }}
            erroMsg={sectionErrors.infoTreino} />

        )}
        <SectionButton name='infoTreino' />
      </span>

      <span className={`form-item ${sectionErrors.perimetria && 'error-section'}`}>
        <h3>Perimetria</h3>
        {section.includes('perimetria') && (
          <Perimetria
            editingPerimetria={perimetria}
            resetError={() => setSectionErrors(prev => ({ ...prev, perimetria: undefined }))}
            setPerimetria={setPerimetria}
            erroMsg={sectionErrors.perimetria} />

        )}
        <SectionButton name='perimetria' />
      </span>

      <span className={`form-item ${sectionErrors.treino && 'error-section'}`}>
        <h3>Treino</h3>
        {section.includes('treino') && (
          <div className='treino'>
            {treinosOpcoes.map(categoria => <ItemTreino
              item={categoria}
              studentList={treino.find(item => item.categoria === categoria.categoria)?.exercicios ?? []}
              key={categoria.categoria}
              editing={{ handleTreinoChecklist }} />
            )}
          </div>
        )}
        <SectionButton
          name='treino' />
      </span>

      <button type="submit">Salvar</button>
      <button type="button" onClick={closeForm}>
        Cancelar
      </button>
    </form >
  )
}

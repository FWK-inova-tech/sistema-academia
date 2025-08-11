import { useState } from "react";
import type { AlunoType } from "../../../types/AlunoType";
import type { PerimetriaType } from "../../../types/PerimetriaType";
import type { TreinoType } from "../../../types/TreinoType";
import type { SectionErrorType, sectionType } from "../../../types/SectionTypes";
import { useAppDispatch } from "../../../stores/appStore";
import { registerAluno, updateAluno } from "../../../service/fetchAPI";
import { addAluno, setLoading, updateStudentNameOnList } from "../../../stores/studentsStore";
import { toast } from "react-toastify";

interface useStudentFormParams {
  student: Omit<AlunoType, '_id'> | AlunoType;
  closeForm: () => void;
}

export function useStudentForm({ student, closeForm }: useStudentFormParams) {
  const [activeSections, setActiveSections] = useState<sectionType[]>([])
  const [sectionErrors, setSectionErrors] = useState<SectionErrorType>({})
  const dispatch = useAppDispatch()


  const [infoPessoais, setInfoPessoais] = useState<Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>>({
    contato: student.contato,
    dataNascimento: student.dataNascimento,
    nome: student.nome
  })

  const [agenda, setAgenda] = useState(student.agenda)

  const [infosTreino, setInfosTreino] = useState<Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>>({
    anaminese: student.anaminese,
    dataInicio: student.dataInicio,
    dataRevisao: student.dataRevisao,
    nivel: student.nivel,
    objetivo: student.objetivo,
    professor: student.professor
  })

  const [perimetria, setPerimetria] = useState<PerimetriaType>
    ({
      medidas: student.perimetria.medidas,
      data: student.perimetria.data
    })

  const [treino, setTreino] = useState<TreinoType[]>(student.treino)

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

  function validateFormSubmit() {
    const newErrors: SectionErrorType = {}

    // pessoais
    if (!infoPessoais.nome.trim() || !infoPessoais.contato.trim()) {
      newErrors.pessoais = 'Todos os campos de informação pessoal devem ser preenchidos'
    }
    if (!infoPessoais.dataNascimento || isNaN(infoPessoais.dataNascimento.getTime())) {
      newErrors.pessoais = 'Informe uma data de nascimento válida.'
    }
    const currentDate = new Date()
    const minYearDate = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate()
    )
    if (infoPessoais.dataNascimento > minYearDate) {
      newErrors.pessoais = 'O aluno precisa ter no mínimo 18 anos ou mais.';
    }

    // agenda
    if (agenda.length === 0) {
      newErrors.agenda = 'Marque ao menos um dia da semana.'
    }

    // info treino
    if (!infosTreino.professor.trim() || !infosTreino.objetivo.trim() || !infosTreino.anaminese.trim()) {
      newErrors.infoTreino = 'Todos os campos são obrigatórios.'
    }
    if (!infosTreino.dataInicio || isNaN(infosTreino.dataInicio.getTime())) {
      newErrors.infoTreino = 'Informe uma data de início válida.'
    }
    if (!infosTreino.dataRevisao || isNaN(infosTreino.dataRevisao.getTime())) {
      newErrors.infoTreino = 'Informe uma data de revisão válida.'
    }

    // treino
    if (treino.length == 0) {
      newErrors.treino = 'A lista de treino do aluno está vazia'
    }

    setSectionErrors(newErrors)
    // se existir algum erro, retonar undefined
    if (Object.keys(newErrors).length > 0) {
      return
    }

    const saveStudent: Omit<AlunoType, '_id'> = {
      nome: infoPessoais.nome,
      contato: infoPessoais.contato,
      dataNascimento: infoPessoais.dataNascimento,
      agenda,
      anaminese: infosTreino.anaminese,
      dataInicio: infosTreino.dataInicio,
      dataRevisao: infosTreino.dataRevisao,
      nivel: infosTreino.nivel,
      objetivo: infosTreino.objetivo,
      professor: infosTreino.professor,
      perimetria,
      treino,
    }
    return saveStudent
  }


  interface submitFormParams {
    student: AlunoType;
    updateCurrentStudentSheet: (data: AlunoType) => void
  }
  function submitForm(currentStudentSheet?: submitFormParams) {
    let validatedData: Omit<AlunoType, '_id'> | AlunoType | undefined = validateFormSubmit()

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
      // form data validado, agora se existe um _id em student === atualizar aluno existe, se não é um registro
      if ('_id' in student) {
        validatedData = { ...validatedData, _id: student._id }
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

  return {
    infoPessoais, agenda, infosTreino, perimetria, treino, activeSections, sectionErrors,
    setInfoPessoais, setAgenda, setInfosTreino, setPerimetria, setActiveSections, setSectionErrors, handleTreinoChecklist, submitForm
  }
}

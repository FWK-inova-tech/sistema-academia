import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType"
import type { TreinoType } from "../../types/TreinoType";
import type { PerimetriaType } from "../../types/PerimetriaType";
import { Perimetria } from "./Perimetria";
import { InformacoesPessoais } from "./InformacoesPessoais";
import { InfoTreino } from "./InfoTreino";
import { Agenda } from "./Agenda";
import type { SectionErrorType, sectionType } from "../../types/SectionTypes";
import { validadeFormSubmit } from "./formHooks";
import { ItemTreino } from "../treino/@ItemTreino";
import { treinosOpcoes } from "../../constants/treinosOpcoes";
import { toast } from "react-toastify";
import { registerAluno, updateAluno } from "../../utils/fetchAPI";
import { useAppDispatch } from "../../stores/appStore";
import { addAluno, setLoading, updateStudentNameOnList } from "../../stores/studentsStore";
import { newStudentInitialValue } from "../../constants/newStudentInitialValue";

interface studentFormProps {
  currentStudentSheet?: {
    student: AlunoType;
    updateCurrentStudentSheet: (data: AlunoType) => void
  };
  closeForm: () => void;
}
export const StudentForm = ({ closeForm, currentStudentSheet } : studentFormProps) => {
  const dispatch = useAppDispatch()

  const studentInitialValue: Omit<AlunoType, '_id'> | AlunoType = 
    currentStudentSheet ? currentStudentSheet.student : newStudentInitialValue

  const [section, setSection] = useState<sectionType[]>([])
  const [sectionErrors, setSectionErrors] = useState<SectionErrorType>({})
  
  const [infoPessoais, setInfoPessoais] = useState<Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>>({
    contato: studentInitialValue.contato,
    dataNascimento: studentInitialValue.dataNascimento,
    nome: studentInitialValue.nome
  })
  const [agenda, setAgenda] = useState(studentInitialValue.agenda)
  const [infosTreino, setInfosTreino] = useState<Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>>({
    anaminese: studentInitialValue.anaminese,
    dataInicio: studentInitialValue.dataInicio,
    dataRevisao: studentInitialValue.dataRevisao,
    nivel: studentInitialValue.nivel,
    objetivo: studentInitialValue.objetivo,
    professor: studentInitialValue.professor 
  })
  const [perimetria, setPerimetria] = useState<PerimetriaType>
  ({
    medidas: studentInitialValue.perimetria.medidas, 
    data: studentInitialValue.perimetria.data
  })
  const [treino, setTreino] = useState<TreinoType[]>(studentInitialValue.treino)


  function handleUpdatePerimetriaMedidas(name: string, value: number) {
    setPerimetria(prev => ({
      ...prev,
      medidas: prev.medidas.map(medida =>
        medida.nome === name
          ? (medida.valor !== value ? { ...medida, valor: value } : medida)
          : medida
      )
    }))
  } 

  function handleUpdatePerimetriaDate(newDate: Date){
    setPerimetria(prev => ({
      ...prev,
      data: newDate
    }))
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
      data: {infoPessoais, agenda, infosTreino, perimetria, treino},
      setSectionErrors: setSectionErrors
    }) 

    async function handleRegister(){
      closeForm()
      await registerAluno(validatedData as Omit<AlunoType, '_id'>)
      .then((data)=>{
        // atualiza a lista de alunos da store com o novo aluno agora com o _id retornado pelo backend
        dispatch(addAluno({_id: data, nome: validatedData!.nome}))
      })
      .catch(error =>{
        const errorMessage = error instanceof Error ? error.message : 'Erro ao tentar registrar ficha'
        throw new Error(errorMessage) 
      })
    }

    async function handleUpdate(){
      const oldData = currentStudentSheet?.student
      dispatch(setLoading("Atualizando ficha do aluno"))

      await updateAluno(validatedData as AlunoType)
      .then(()=>{
        if(oldData && validatedData && oldData.nome !== validatedData.nome){
          // atualiza o nome do aluno na lista de alunos
          dispatch(updateStudentNameOnList({_id: oldData._id, nome: validatedData.nome}))
        }
        // atualiza as informações de studentSheet
        if(currentStudentSheet) currentStudentSheet.updateCurrentStudentSheet(validatedData as AlunoType)
        
      })
      .catch((error)=>{
        const errorMessage = error instanceof Error ? `Erro ao tentar registrar ficha: ${error.message}` : 'Erro ao tentar registrar ficha'
        toast.error(errorMessage)
      })
      .finally(()=>{
        closeForm()
        dispatch(setLoading(false))
      })
    }
    
    if(validatedData){
      if('_id' in studentInitialValue){
        validatedData = {...validatedData, _id: studentInitialValue._id}
      }

      if('_id' in validatedData ){
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
      <span className={`form-item ${sectionErrors.pessoais && 'error-section'}`}>
      Informações pessoais
      {section.includes('pessoais') && (
        <InformacoesPessoais
          editingStudent={infoPessoais}
          resetError={()=>setSectionErrors(prev => ({ ...prev, pessoais: undefined }))}
          handleUpdateInformacoes={setInfoPessoais}
          erroMsg={sectionErrors.pessoais}
        />
      )}
        <button
          type="button"
          onClick={() =>
            setSection((prev) =>
              prev.includes('pessoais')
                ? prev.filter((s) => s !== 'pessoais')
                : [...prev, 'pessoais']
            )
          }
        >
          {section.includes('pessoais') ? 'Fechar' : 'Abrir'}
        </button>
      </span>

      <span className={`form-item ${sectionErrors.agenda && 'error-section'}`}>
        Agenda
        {section.includes('agenda') && (
          <Agenda
            resetError={()=>setSectionErrors(prev => ({ ...prev, agenda: undefined }))}
            editingAgenda={agenda}
            setAgenda={setAgenda}
            erroMsg={sectionErrors.agenda}
          />
        )}
        <button
          type="button"
          onClick={() =>
            setSection((prev) =>
              prev.includes('agenda')
                ? prev.filter((s) => s !== 'agenda')
                : [...prev, 'agenda']
            )
          }
        >
          {section.includes('agenda') ? 'Fechar' : 'Abrir'}
        </button>
      </span>

      <span className={`form-item ${sectionErrors.infoTreino && 'error-section'}`}>
        Informações para treino
        {section.includes('infoTreino') && (
          <InfoTreino
            editingInfoTreino={infosTreino}
            updateInfo={(newInfo) => {
              setInfosTreino(newInfo)
              setSectionErrors(prev => ({ ...prev, infoTreino: undefined }))
            }}
            erroMsg={sectionErrors.infoTreino}/>

        )}
        <button
          type="button"
          onClick={() =>
            setSection((prev) =>
              prev.includes('infoTreino')
                ? prev.filter((s) => s !== 'infoTreino')
                : [...prev, 'infoTreino']
            )
          }
        >
          {section.includes('infoTreino') ? 'Fechar' : 'Abrir'}
        </button>
      </span>

      <span className={`form-item ${sectionErrors.perimetria && 'error-section'}`}>
        Perimetria
        {section.includes('perimetria') && (
          <Perimetria
          editingPerimetria={perimetria}
          handleUpdatePerimetriaDate={(newDate) => {
            handleUpdatePerimetriaDate(newDate)
            setSectionErrors(prev => ({ ...prev, perimetria: undefined }))
          }}
          handleUpdatePerimetriaMedidas={(name, value) => {
            handleUpdatePerimetriaMedidas(name, value)
            setSectionErrors(prev => ({ ...prev, perimetria: undefined }))
          }}
          erroMsg={sectionErrors.perimetria}/>

        )}
        <button
          type="button"
          onClick={() =>
            setSection((prev) =>
              prev.includes('perimetria')
                ? prev.filter((s) => s !== 'perimetria')
                : [...prev, 'perimetria']
            )
          }
        >
          {section.includes('perimetria') ? 'Fechar' : 'Abrir'}
        </button>
      </span>

      <span className={`form-item ${sectionErrors.treino && 'error-section'}`}>
        Treino
        {section.includes('treino') && (
          <div>
            {treinosOpcoes.map(categoria => <ItemTreino
              item={categoria}
              studentList={treino.find(item => item.categoria === categoria.categoria)?.exercicios ?? []}
              key={categoria.categoria}
              editing={{handleTreinoChecklist}}/>
            )}
          </div>
        )}
        <button
          type="button"
          onClick={() =>
            setSection((prev) =>
              prev.includes('treino')
                ? prev.filter((s) => s !== 'treino')
                : [...prev, 'treino']
            )
          }
        >
          {section.includes('treino') ? 'Fechar' : 'Abrir'}
        </button>
      </span>

      <button type="submit">Salvar</button>
      <button type="button" onClick={closeForm}>
        Cancelar
      </button>
    </form>
  )
}
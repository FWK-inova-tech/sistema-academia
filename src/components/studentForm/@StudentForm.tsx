import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType"
import type { TreinoType } from "../../types/TreinoType";
import type { PerimetriaType } from "../../types/PerimetriaType";
import { itensPerimetria } from "../../constants/medidasPerimetria";
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
import { addAluno } from "../../stores/studentsStore";

interface studentFormProps {
  editingStudent?: {
    student: AlunoType;
    update: (newInfo: AlunoType) => void;
  };
  closeForm: () => void;
}
export const StudentForm = ({ editingStudent, closeForm } : studentFormProps) => {
  const dispatch = useAppDispatch()

  const studentInitialValue: Omit<AlunoType, 'id'> | AlunoType = editingStudent?.student as AlunoType ?? {
    nome: '',
    objetivo: '',
    dataNascimento: new Date(),
    professor: '',
    nivel: "Iniciante",
    contato: '',
    dataInicio: new Date(),
    dataRevisao: new Date(),
    anaminese: '',
    agenda: [],
    treino: [],
    perimetria: { 
      data: new Date(),
      medidas: itensPerimetria} 
  } as Omit<AlunoType, 'id'> 


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

  function handleAgendaChecklist(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target
      setAgenda(prev => {
        if (checked) {
          return [...prev, value]
        } else {
          return prev.filter(agenda => agenda !== value)
        }
    })
  }

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
    let validatedData: Omit<AlunoType, 'id'> | AlunoType | undefined = validadeFormSubmit({
      data: {infoPessoais, agenda, infosTreino, perimetria, treino},
      setSectionErrors: setSectionErrors
    }) 

    

    async function handleRegister(){
      closeForm()
      try{
        const registerAndGetId = await registerAluno(validatedData as Omit<AlunoType, 'id'>)
        // atualiza a lista de alunos da store com o novo aluno agora com o id retornado pelo backend
        dispatch(addAluno({id: registerAndGetId, nome: validatedData!.nome}))
      } catch (error){
        const errorMessage = error instanceof Error ? error.message : 'Erro ao tentar registrar ficha'
        throw new Error(errorMessage)
      }
    }

    async function handleUpdate(){
      // fecha o form e volta pro studentSheet mas com as informações atualizadas
      const oldData = editingStudent?.student
      closeForm()
      editingStudent?.update(validatedData as AlunoType)
      await updateAluno(validatedData as AlunoType).catch((error)=>{
        const errorMessage = error instanceof Error ? error.message : 'Erro ao tentar registrar ficha'
        if (editingStudent?.student) editingStudent?.update(oldData!)
          
        throw new Error(errorMessage)
      })
    }
    
    if(validatedData){
      if('id' in studentInitialValue){
        validatedData = {...validatedData, id: studentInitialValue.id}
      }

      if('id' in validatedData ){
        console.log('is uodate')
        toast.promise(handleUpdate,{
          pending: 'Salvando alterações na ficha',
          error: 'Erro ao tentar salvar alterações',
          success: 'Alteraçoes salvas com sucesso'
        })
      } else {
        console.log('is register')
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
          handleUpdateInformacoes={(updated) => {
          setInfoPessoais(updated)
          setSectionErrors(prev => ({ ...prev, pessoais: undefined }))
        }}
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
            editingAgenda={agenda}
            erroMsg={sectionErrors.agenda}
            handleAgendaChecklist={(e) => {
            handleAgendaChecklist(e)
            setSectionErrors(prev => ({ ...prev, agenda: undefined }))
          }}
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
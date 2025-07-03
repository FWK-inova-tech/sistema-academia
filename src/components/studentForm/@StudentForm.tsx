import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType"
import type { TreinoType } from "../../types/TreinoType";
import { Treino } from "./Treino";
import type { PerimetriaType } from "../../types/PerimetriaType";
import { itensPerimetria } from "../../constants/medidasPerimetria";
import { Perimetria } from "./Perimetria";
import { InformacoesPessoais } from "./InformacoesPessoais";
import { InfoTreino } from "./InfoTreino";
import { Agenda } from "./Agenda";

interface studentFormProps {
  editingStudent?: AlunoType;
  closeForm: () => void;
}
export const StudentForm = ({ editingStudent, closeForm } : studentFormProps) => {
  const studentInitialValue: Omit<AlunoType, 'id'> = editingStudent ?? {
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
  }

  type sectionType = 
    'pessoais' | 'agenda' | 'infoTreino' | 'perimetria' | 'treino'
  const [section, setSection] = useState<sectionType[]>([])

  type SectionError = {
  [key in sectionType]?: string;
  }
  const [sectionErrors, setSectionErrors] = useState<SectionError>({})

  
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

  // form
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const newErrors: SectionError = {}

    // pessoais
    if(!infoPessoais.nome.trim() || !infoPessoais.contato.trim()) {
      newErrors.pessoais = 'Todos os campos de informação pessoal devem ser preenchidos'
    }
    if(!infoPessoais.dataNascimento || isNaN(infoPessoais.dataNascimento.getTime())) {
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
    if(agenda.length === 0) {
      newErrors.agenda = 'Marque ao menos um dia da semana.'
    }

    // info treino
    if(!infosTreino.professor.trim() || !infosTreino.objetivo.trim() || !infosTreino.anaminese.trim()) {
      newErrors.infoTreino = 'Todos os campos são obrigatórios.'
    }
    if(!infosTreino.dataInicio || isNaN(infosTreino.dataInicio.getTime())) {
      newErrors.infoTreino = 'Informe uma data de início válida.'
    }
    if(!infosTreino.dataRevisao || isNaN(infosTreino.dataRevisao.getTime())) {
      newErrors.infoTreino = 'Informe uma data de revisão válida.'
    }

    // treino
    if(treino.length == 0) {
      newErrors.treino = 'A lista de treino do aluno está vazia'
    }

    setSectionErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const saveStudent:  Omit<AlunoType, 'id'>  = {
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
    console.log('aluno:', saveStudent )
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
          <Treino
          editingTreino={treino}
            handleTreinoChecklist={(e, categoria) => {
              handleTreinoChecklist(e, categoria)
              setSectionErrors(prev => ({ ...prev, treino: undefined }))
            }}
            erroMsg={sectionErrors.treino} />
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
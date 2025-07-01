import { useEffect, useState } from "react";
import type { AlunoType } from "../../types/AlunoType"
import type { TreinoType } from "../../types/TreinoType";
import { Treino } from "./Treino";
import type { PerimetriaType } from "../../types/PerimetriaType";
import { itensPerimetria } from "../../constants/medidasPerimetria";
import { Perimetria } from "./Perimetria";
import { InformacoesPessoais } from "./InformacoesPessoais";
import { InfoTreino } from "./InfoTreino";

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
    false | 'pessoais' | 'agenda' | 'infoTreino' | 'perimetria' | 'treino'
  const [section, setSection] = useState<sectionType>(false)
  
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

  useEffect(()=>{
    console.log(infosTreino)
  },[infosTreino])

  function handleUpdatePerimetriaMedidas(name: string, value: number) {
    setPerimetria(prev => ({
      ...prev,
      medidas: prev.medidas.map(medida =>
        medida.nome === name ? { ...medida, valor: value } : medida
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


  
  return (
    <form>
      <span>
        Informações pessoais
        { section === 'pessoais' && <InformacoesPessoais 
        editingStudent={infoPessoais}
        handleUpdateInformacoes={setInfoPessoais}/> }
        <button type="button"
        onClick={()=> setSection( section === 'pessoais' ? false : 'pessoais')}>
          {section === 'pessoais' ? 'Fechar' : 'Abrir'}
        </button>
      </span>

      <span>
        Agenda
      </span>

      <span>
        Informações para treino
        { section === 'infoTreino' && 
        <InfoTreino 
        editingInfoTreino={infosTreino}
        updateInfo={setInfosTreino}/> }
        <button type="button"
        onClick={()=> setSection( section === 'infoTreino' ? false : 'infoTreino')}>
          {section === 'infoTreino' ? 'Fechar' : 'Abrir'}
        </button>
      </span>

      <span>
        Perimetria
        { section === 'perimetria' && 
        <Perimetria
        editingPerimetria={perimetria}
        handleUpdatePerimetriaDate={handleUpdatePerimetriaDate}
        handleUpdatePerimetriaMedidas={handleUpdatePerimetriaMedidas}/> }
        <button type="button"
        onClick={()=> setSection( section === 'perimetria' ? false : 'perimetria')}>
          {section === 'perimetria' ? 'Fechar' : 'Abrir'}
        </button>
      </span>

      <span>
        Treino
        { section === 'treino' && <Treino handleTreinoChecklist={handleTreinoChecklist}/> }
        <button type="button"
        onClick={()=> setSection( section === 'treino' ? false : 'treino')}>
          {section === 'treino' ? 'Fechar' : 'Abrir'}
        </button>
      </span>

      <button type="submit">Salvar</button>
      <button type="button"
      onClick={closeForm}>
        Cancelar
      </button>
    </form>
  )
}
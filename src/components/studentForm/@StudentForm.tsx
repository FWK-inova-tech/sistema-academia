import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType"
import type { TreinoType } from "../../types/TreinoType";
import { Treino } from "./Treino";
import type { PerimetriaType } from "../../types/PerimetriaType";
import { itensPerimetria } from "../../constants/medidasPerimetria";
import { Perimetria } from "./Perimetria";

interface studentFormProps {
  editingStudent?: AlunoType;
  closeForm: () => void;
}
export const StudentForm = ({ editingStudent, closeForm } : studentFormProps) => {
  type sectionType = 
    false | 'pessoais' | 'agenda' | 'infoTreino' | 'perimetria' | 'treino'
  const [section, setSection] = useState<sectionType>(false)

  const [infoPessoais, setInfoPessoais] = useState<null| Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>>(null)
  const [agenda, setAgenda] = useState<null | Pick<AlunoType, 'agenda'>>(null)
  const [infoTreino, setInfoTreino] = useState<null | Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>>(null)
  const [perimetria, setPerimetria] = useState<PerimetriaType>(
    editingStudent?.perimetria ?? 
    {medidas: itensPerimetria, data: ''})
  const [treino, setTreino] = useState<null | TreinoType[]>(editingStudent?.treino ?? null)


  function handleUpdatePerimetriaMedidas(name: string, value: number){
    setPerimetria(prev => {
      prev.medidas.forEach(medida => {
        if(medida.nome === name){
          medida.valor = value
        }
      })

      return prev
    })
  }

  function handleUpdatePerimetriaDate(newDate: string){
    setPerimetria(prev => {
      prev.data = newDate
      return prev
    })
  }

  function handleTreinoChecklist(e: React.ChangeEvent<HTMLInputElement>, categoria: string){
    const { value, checked } = e.target
    if(checked){
      setTreino(prev => {
        if(!prev){
          return [{categoria, exercicios: [value]}]
        }

        prev.forEach(item => {
          if (item.categoria == categoria){
            item.exercicios.push(value)
          }
        })
        return prev
      })

    } else {
      setTreino(prev => {
        if(!prev){ return null }

        prev.forEach(item => {
          if(item.categoria == categoria){
            item.exercicios = item.exercicios.filter(exercicio => exercicio !== value)
          }
        })
        return prev
      })

    }
  }
  
  return (
    <form>
      <span onClick={()=> setSection('pessoais')}>
        Informações pessoais
      </span>
      <span onClick={()=> setSection('agenda')}>
        Agenda
      </span>
      <span onClick={()=> setSection('infoTreino')}>
        Informações para treino
      </span>
      <span onClick={()=> setSection('perimetria')}>
        <Perimetria
        editingPerimetria={perimetria}
        handleUpdatePerimetriaDate={handleUpdatePerimetriaDate}
        handleUpdatePerimetriaMedidas={handleUpdatePerimetriaMedidas}/>
      </span>
      <span onClick={()=> setSection('treino')}>
        {section === 'treino' && <Treino handleTreinoChecklist={handleTreinoChecklist}/>}
      </span>

      <button type="submit">Salvar</button>
      <button type="button"
      onClick={closeForm}>
        Cancelar
      </button>
    </form>
  )
}
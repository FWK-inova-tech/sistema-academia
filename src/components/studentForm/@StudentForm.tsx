import { useEffect, useState } from "react";
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
    false | 'pessoais' | 'agenda' | 'infoTreino' | 'perimetria' | 'treino'
  const [section, setSection] = useState<sectionType[]>([])
  
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

  useEffect(()=>{
    console.log(agenda)
  },[agenda])

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

  // form
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const isEmptyString = (val: string) => val.trim() === '';
    const invalidFields: string[] = [];

    if (isEmptyString(infoPessoais.nome)) invalidFields.push('Nome');
    if (isEmptyString(infoPessoais.contato)) invalidFields.push('Contato');

    if (!infoPessoais.dataNascimento || isNaN(infoPessoais.dataNascimento.getTime())) {
      invalidFields.push('Data de nascimento');
    }

    if (agenda.length === 0) invalidFields.push('Agenda (mínimo 1 dia)');

    if (isEmptyString(infosTreino.professor)) invalidFields.push('Professor');
    if (isEmptyString(infosTreino.nivel)) invalidFields.push('Nível');
    if (isEmptyString(infosTreino.objetivo)) invalidFields.push('Objetivo');
    if (isEmptyString(infosTreino.anaminese)) invalidFields.push('Anamnese');

    if (!infosTreino.dataInicio || isNaN(infosTreino.dataInicio.getTime())) {
      invalidFields.push('Data de início');
    }

    if (!infosTreino.dataRevisao || isNaN(infosTreino.dataRevisao.getTime())) {
      invalidFields.push('Data de revisão');
    }

    if (invalidFields.length > 0) {
      alert(`Preencha os seguintes campos corretamente:\n- ${invalidFields.join('\n- ')}`);
      return;
    }

    console.log('Dados prontos para envio:', {
      ...infoPessoais,
      agenda,
      ...infosTreino,
      perimetria,
      treino
    });


}

  
  return (
    <form onSubmit={handleSubmit} className="form-student">
  <span className="form-item">
    Informações pessoais
    {section.includes('pessoais') && (
      <InformacoesPessoais
        editingStudent={infoPessoais}
        handleUpdateInformacoes={setInfoPessoais}
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

  <span className="form-item">
    Agenda
    {section.includes('agenda') && (
      <Agenda
        editingAgenda={agenda}
        handleAgendaChecklist={handleAgendaChecklist}
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

  <span className="form-item">
    Informações para treino
    {section.includes('infoTreino') && (
      <InfoTreino
        editingInfoTreino={infosTreino}
        updateInfo={setInfosTreino}
      />
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

  <span className="form-item">
    Perimetria
    {section.includes('perimetria') && (
      <Perimetria
        editingPerimetria={perimetria}
        handleUpdatePerimetriaDate={handleUpdatePerimetriaDate}
        handleUpdatePerimetriaMedidas={handleUpdatePerimetriaMedidas}
      />
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

  <span className="form-item">
    Treino
    {section.includes('treino') && (
      <Treino handleTreinoChecklist={handleTreinoChecklist} />
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
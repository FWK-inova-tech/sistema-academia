import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType";
import { IMaskInput } from "react-imask";
import { getLocalDate } from "../../utils/getLocalDate";


interface informacoesPessoaisProps {
  editingStudent: Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>,
  handleUpdateInformacoes: (updatedInfos: Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>) => void;
} 
export const InformacoesPessoais = ({ editingStudent, handleUpdateInformacoes } : informacoesPessoaisProps) => {
  const [name, setName] = useState(editingStudent.nome)
  const [contact, setContact] = useState(editingStudent.nome)
  const [date, setDate] = useState(editingStudent.dataNascimento.toISOString().split('T')[0])

  function handleInputChange(info: 'nome' | 'contato'| 'dataNascimento', value: string){
    const updatedInfo = {
      ...editingStudent,
      [info]: value
    }
    if(info === 'nome') { setName(value) } 
    if(info === 'contato') { setContact(value) } 

    handleUpdateInformacoes(updatedInfo)
  }

  function handleDateInput(dateString: string){
    setDate(dateString)
    handleUpdateInformacoes({
      ...editingStudent,
      dataNascimento: getLocalDate(dateString)
    })
  }

  return(
  <div>
    <span>
      <label htmlFor="student-name">Nome</label>
      <input id="student-name" name="student-name"
      value={name}
      maxLength={150}
      minLength={10}
      type="text"
      placeholder="Nome do aluno"
      onChange={(e)=> handleInputChange('nome', e.target.value)}/>
    </span>

    <span>
      <label htmlFor="birth-date">Data de nascimento</label>
      <input id="birth-date" name="birth-date"
      value={date}
      type="date"
      placeholder="Data de nascimento"
      onChange={(e)=> handleDateInput(e.target.value)} />
    </span>

    <span>
      <label htmlFor="contact">Contato</label>
      <IMaskInput
      mask="(00) 0 0000-0000"
      placeholder="(00) 0 0000-0000"
      id="contact"
      name="contact"
      value={contact}
      onChange={(e) => handleInputChange('contato', (e.target as HTMLInputElement).value)}/>
    </span>
  </div>
  )
}
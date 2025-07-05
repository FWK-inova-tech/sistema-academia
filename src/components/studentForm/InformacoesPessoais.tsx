import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType";
import { IMask, IMaskInput } from "react-imask";
import { getLocalDate } from "../../utils/getLocalDate";


interface informacoesPessoaisProps {
  editingStudent: Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>,
  handleUpdateInformacoes: (updatedInfos: Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>) => void;
  erroMsg?: string;
} 
export const InformacoesPessoais = ({ editingStudent, handleUpdateInformacoes, erroMsg } : informacoesPessoaisProps) => {
  const [name, setName] = useState(editingStudent.nome)
  const [contact, setContact] = useState(editingStudent.contato)
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

  function getFormatedMaskContact(defaultString: string){
    const mask = IMask.createMask({ mask: '(00) 0 0000-0000' })
    mask.resolve(defaultString)
    return mask.value
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
      unmask="typed"
      name="contact"
      value={getFormatedMaskContact(contact)}
      onAccept={(value) => handleInputChange('contato', value)}/>
    </span>
    {erroMsg && <p className='form-error-text'>{erroMsg}</p>}
  </div>
  )
}
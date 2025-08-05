import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType";
import { IMask, IMaskInput } from "react-imask";
import { getLocalDate } from "../../utils/getLocalDate";


interface informacoesPessoaisProps {
  editingStudent: Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>,
  resetError: () => void;
  handleUpdateInformacoes: (updatedInfos: Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento'>) => void;
  erroMsg?: string;
}
export const InformacoesPessoais = ({ editingStudent, erroMsg, handleUpdateInformacoes, resetError }: informacoesPessoaisProps) => {
  const [name, setName] = useState(editingStudent.nome)
  const [contact, setContact] = useState(editingStudent.contato)
  const [date, setDate] = useState(editingStudent.dataNascimento.toISOString().split('T')[0])

  function handleInputChange(info: 'nome' | 'contato' | 'dataNascimento', value: string) {
    resetError()
    const updatedInfo = {
      ...editingStudent,
      [info]: value
    }
    if (info === 'nome') { setName(value) }
    if (info === 'contato') { setContact(value) }
    handleUpdateInformacoes(updatedInfo)
  }

  function handleDateInput(dateString: string) {
    resetError()
    setDate(dateString)
    if (dateString.length === 10) {
      handleUpdateInformacoes({
        ...editingStudent,
        dataNascimento: getLocalDate(dateString)
      })
    }
  }

  function getFormatedMaskContact(defaultString: string) {
    const mask = IMask.createMask({ mask: '(00) 0 0000-0000' })
    mask.resolve(defaultString)
    return mask.value
  }
  const spanContainerClassname = 'flex flex-col md:flex-row items-center gap-2'
  const inputClassname = 'bg-[var(--secondaryColor)] border border-[var(--primaryColor)] px-3 rounded-3xl max-w-[90%]'


  return (
    <div className="info-pessoais flex flex-col items-center gap-3">
      <span className={spanContainerClassname}>
        <label htmlFor="student-name" className="border-none bg-none">Nome:</label>
        <input id="student-name" name="student-name"
          className={inputClassname}
          value={name}
          maxLength={150}
          minLength={10}
          type="text"
          placeholder="Nome do aluno"
          onChange={(e) => handleInputChange('nome', e.target.value)} />
      </span>

      <span className={spanContainerClassname}>
        <label htmlFor="birth-date">Data de nascimento:</label>
        <input id="birth-date" name="birth-date"
          className={inputClassname}
          value={date}
          type="date"
          placeholder="Data de nascimento"
          onChange={(e) => handleDateInput(e.target.value)} />
      </span>

      <span className={spanContainerClassname}>
        <label htmlFor="contact">Contato:</label>
        <IMaskInput
          className={inputClassname}
          mask="(00) 0 0000-0000"
          placeholder="(00) 0 0000-0000"
          id="contact"
          unmask="typed"
          name="contact"
          value={getFormatedMaskContact(contact)}
          onAccept={(value) => handleInputChange('contato', value)} />
      </span>
      {erroMsg && <p className='form-error-text'>{erroMsg}</p>}
    </div>
  )
}

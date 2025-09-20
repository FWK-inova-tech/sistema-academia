import { useState } from "react";
import type { AlunoType } from "../../../types/AlunoType";
import { IMask, IMaskInput } from "react-imask";
import { getLocalDate } from "../../../utils/getLocalDate";


interface informacoesPessoaisProps {
  editingStudent: Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento' | 'status'>,
  resetError: () => void;
  handleUpdateInformacoes: (updatedInfos: Pick<AlunoType, 'nome' | 'contato' | 'dataNascimento' | 'status'>) => void;
  erroMsg?: string;
}
export const InformacoesPessoais = ({ editingStudent, erroMsg, handleUpdateInformacoes, resetError }: informacoesPessoaisProps) => {
  const [name, setName] = useState(editingStudent.nome)
  const [contact, setContact] = useState(editingStudent.contato)
  const [date, setDate] = useState(editingStudent.dataNascimento.toISOString().split('T')[0])
  const [status, setStatus] = useState(editingStudent.status)

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

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatus(e.target.value as 'active' | 'inactive')
    resetError()
    handleUpdateInformacoes({
      ...editingStudent,
      status: e.target.value as 'active' | 'inactive'
    })
  }


  function getFormatedMaskContact(defaultString: string) {
    const mask = IMask.createMask({ mask: '(00) 0 0000-0000' })
    mask.resolve(defaultString)
    return mask.value
  }
  const spanContainerClassname = 'flex flex-col gap-2 w-full'
  const labelClassname = 'text-sm font-semibold text-gray-800'
  const inputClassname = 'w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] transition-all duration-200 outline-none placeholder-gray-400'


  return (
    <div className="space-y-6">
      <div className={spanContainerClassname}>
        <label htmlFor="student-name" className={labelClassname}>Status da matricula</label>
        <select
          id='level'
          required
          value={status}
          onChange={handleStatusChange}
          className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] transition-all duration-200 font-medium"
        >
          <option value='active'>🟢 Ativo</option>
          <option value='inactive'>🔴 Inativo</option>
        </select>
      </div>

      <div className={spanContainerClassname}>
        <label htmlFor="student-name" className={labelClassname}>Nome completo</label>
        <input
          id="student-name"
          name="student-name"
          className={inputClassname}
          value={name}
          maxLength={150}
          minLength={10}
          type="text"
          placeholder="Digite o nome completo do aluno"
          onChange={(e) => handleInputChange('nome', e.target.value)}
        />
      </div>

      <div className={spanContainerClassname}>
        <label htmlFor="birth-date" className={labelClassname}>Data de nascimento</label>
        <input
          id="birth-date"
          name="birth-date"
          className={inputClassname}
          value={date}
          type="date"
          onChange={(e) => handleDateInput(e.target.value)}
        />
      </div>

      <div className={spanContainerClassname}>
        <label htmlFor="contact" className={labelClassname}>Telefone para contato</label>
        <IMaskInput
          className={inputClassname}
          mask="(00) 0 0000-0000"
          placeholder="(00) 0 0000-0000"
          id="contact"
          unmask="typed"
          name="contact"
          value={getFormatedMaskContact(contact)}
          onAccept={(value) => handleInputChange('contato', value)}
        />
      </div>

      {erroMsg && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{erroMsg}</p>
        </div>
      )}
    </div>
  )
}

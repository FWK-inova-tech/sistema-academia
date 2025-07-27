interface agendaProps {
  editingAgenda: string[];
  erroMsg?: string;
  setAgenda: React.Dispatch<React.SetStateAction<string[]>>;
  resetError: () => void;

}

export const Agenda = ({ editingAgenda, erroMsg, setAgenda, resetError }: agendaProps) => {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  function checkValue(check: string) {
    return editingAgenda.find(item => item === check)
  }

  function handleAgendaChecklist(e: React.ChangeEvent<HTMLInputElement>) {
    resetError()
    const { value, checked } = e.target
    setAgenda(prev => {
      if (checked) {
        return [...prev, value]
      } else {
        return prev.filter(agenda => agenda !== value)
      }
    })
  }

  return (
    <div className='agenda flex flex-row gap-1'>
      {days.map((day) => (
        <label key={day} className="checklist-circle">
          <input
            type="checkbox"
            value={day}
            checked={checkValue(day) ? true : false}
            onChange={handleAgendaChecklist}
          />
          <span className="checkmark-circle"></span>
          {day}
        </label>
      ))}
      {erroMsg && <p className='form-error-text'>{erroMsg}</p>}
    </div>
  )
}

interface agendaProps {
  handleAgendaChecklist: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editingAgenda: string[];
  erroMsg?: string;
}

export const Agenda = ({ editingAgenda, handleAgendaChecklist, erroMsg } : agendaProps) => {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  function checkValue(check: string){
    return editingAgenda.find(item => item === check)
  }

  return (
    <div>
      {days.map((day) => (
        <label key={day}>
          <input
            type="checkbox"
            value={day}
            checked={checkValue(day) ? true : false}
            onChange={handleAgendaChecklist}
          />
          {day}
        </label>
      ))}
      {erroMsg && <p className='form-error-text'>{erroMsg}</p>}
    </div>
  )
}
interface agendaProps {
  handleAgendaChecklist: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editingAgenda: string[]
}

export const Agenda = ({ editingAgenda, handleAgendaChecklist } : agendaProps) => {
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
    </div>
  )
}
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {days.map((day) => (
          <label 
            key={day} 
            className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium ${
              checkValue(day) 
                ? 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)] text-white shadow-sm' 
                : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]'
            }`}
          >
            <input
              type="checkbox"
              value={day}
              checked={checkValue(day) ? true : false}
              onChange={handleAgendaChecklist}
              className="hidden"
            />
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              checkValue(day) 
                ? 'bg-white border-white' 
                : 'bg-white border-gray-400'
            }`}>
              {checkValue(day) && <span className="text-[var(--color-primary-600)] text-sm font-bold">✓</span>}
            </div>
            <span className="font-medium">{day}</span>
          </label>
        ))}
      </div>
      
      {erroMsg && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{erroMsg}</p>
        </div>
      )}
    </div>
  )
}

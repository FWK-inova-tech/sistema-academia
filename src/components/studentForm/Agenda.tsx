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
    <div className="agenda bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 border-l-4 border-[#4CAF50] pl-4">
          📅 Agenda Semanal
        </h3>
        <p className="text-gray-600 mt-2">Selecione os dias da semana para treino</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {days.map((day) => (
          <label 
            key={day} 
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
              checkValue(day) 
                ? 'bg-[#4CAF50] border-[#4CAF50] text-white shadow-md' 
                : 'bg-white border-gray-300 text-gray-700 hover:border-[#4CAF50] hover:bg-green-50'
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
              {checkValue(day) && <span className="text-[#4CAF50] text-sm font-bold">✓</span>}
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

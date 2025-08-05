import { treinosOpcoes } from "../../constants/treinosOpcoes";

interface treinoExerciciosProps {
  exercicios: string[]; 
  categoria: string;
  editing?: {
    handleTreinoChecklist: (e: React.ChangeEvent<HTMLInputElement>, categoria: string) => void;
  }
}

export const TreinoExercicios = ( props : treinoExerciciosProps) => {
  const { editing, exercicios, categoria } = props

  const exerciciosList = editing ? 
    treinosOpcoes.find(treino => treino.categoria === categoria)!.exercicios 
    : exercicios

  function checkValue(checkExercicio: string){
    const check = exercicios!.find(exercicio => exercicio === checkExercicio)
    return check ? true : false
  }

  return (
    <div className="space-y-3">
      {exerciciosList.map(exercicio =>
        <div key={exercicio} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
          <div className="relative">
            <input 
              type="checkbox"
              value={exercicio}
              checked={!editing ? true : checkValue(exercicio)}
              disabled={!editing}
              onChange={(e) => editing && editing.handleTreinoChecklist(e, categoria)}
              className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
            />
            {(editing ? checkValue(exercicio) : true) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-gray-700 font-medium">{exercicio}</p>
          </div>
          <div className="text-green-600 text-sm">
            {(editing ? checkValue(exercicio) : true) ? '✅' : '⏸️'}
          </div>
        </div>
      )}
    </div>
  )
}
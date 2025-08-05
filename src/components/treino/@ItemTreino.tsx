import { useState } from "react";
import type { TreinoType } from "../../types/TreinoType"

interface itemTreinoProps {
  item: TreinoType;
  studentList: string[];
  editing?: {
    handleTreinoChecklist: (e: React.ChangeEvent<HTMLInputElement>, categoria: string) => void;
  }
}
export const ItemTreino = ({ item, editing, studentList }: itemTreinoProps) => {
  const [open, setOpen] = useState(false)

  function checkValue(checkExercicio: string) {
    const check = studentList.find(exercicio => exercicio === checkExercicio)
    return check ? true : false
  }

  return (
    <div className={`
      w-full mb-4 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl
      ${open ? 'bg-green-50 border-2 border-green-300' : 'bg-white border-2 border-gray-200 hover:border-green-300'}
    `}>
      {/* Header Simples */}
      <div className={`p-4 ${open ? 'bg-green-600' : 'bg-gray-600'} transition-all`}>
        <h3 className="text-white font-bold text-lg text-center flex items-center justify-center gap-3">
          <span className="text-xl">💪</span>
          {item.categoria}
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
            {item.exercicios.length}
          </span>
        </h3>
      </div>
      
      {/* Content */}
      {open && (
        <div className="p-4 space-y-3">
          {item.exercicios.map((exercicio, index) =>
            <label key={exercicio} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
              <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <input
                type="checkbox"
                id={exercicio}
                value={exercicio}
                checked={!editing ? true : checkValue(exercicio)}
                disabled={!editing}
                onChange={(e) => editing && editing.handleTreinoChecklist(e, item.categoria)}
                className="w-5 h-5 text-green-600 bg-white border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <span className="text-gray-700 font-medium flex-1">{exercicio}</span>
              <span className="text-green-600">
                {(editing ? checkValue(exercicio) : true) ? '✅' : '⏸️'}
              </span>
            </label>
          )}
        </div>
      )}
      
      {/* Footer Button */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <button
          type="button"
          className={`
            w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
            ${open 
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
              : 'bg-white hover:bg-green-50 text-green-600 border-2 border-green-600 hover:border-green-700'
            }
          `}
          onClick={() => setOpen(!open)}>
          <span>{open ? '🔼' : '🔽'}</span>
          {open ? 'Fechar Exercícios' : 'Ver Exercícios'}
        </button>
      </div>
    </div>
  )
}

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
  const treinoCardClass = 'treino-card p2 w-[90%] flex flex-col items-center rounded-2xl ' + (open ? 'bg-[var(--secondaryColor)] text-black' : 'bg-[var(--primaryColor)] text-white')
  const buttonCardClass = (open ? 'btn btn-green' : 'btn bg-[var(--secondaryColor)] text-black') + ' py-0 px-5 mb-2'
  const titleCardClass = 'my-3 text-[1.25rem] ' + (open ? 'font-semibold' : 'font-normal')

  return (
    <div className={treinoCardClass}>
      <p className={titleCardClass}>{item.categoria}</p>
      {open && <>
        {item.exercicios.map(exercicio =>
          <label key={exercicio} className="checklist-square w-[70%]">
            {exercicio}
            <input
              type="checkbox"
              id={exercicio}
              value={exercicio}
              checked={!editing ? true : checkValue(exercicio)}
              disabled={!editing}
              onChange={(e) => editing && editing.handleTreinoChecklist(e, item.categoria)} />
            <span className="checkmark-square"></span>
          </label>
        )}
      </>}
      <button
        type="button"
        className={buttonCardClass}
        onClick={() => setOpen(!open)}>
        {open ? 'Fechar' : 'Abrir'}
      </button>
    </div>
  )
}

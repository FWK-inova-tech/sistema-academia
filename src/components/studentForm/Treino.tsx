import { treinos } from "../../constants/exercicios"
import type { TreinoType } from "../../types/TreinoType";

interface treinoProps {
  handleTreinoChecklist: (e: React.ChangeEvent<HTMLInputElement>, categoria: string) => void;
  editingTreino?: TreinoType[];
}
export const Treino = ({ handleTreinoChecklist, editingTreino } : treinoProps) => {

  // caso esteja tratando um Treino de um aluno existente, verifica quais exercicios estão marcados
  function checkValue(exercicio: string, categoria: string){
    const check = editingTreino!.find(treino => treino.categoria === categoria && treino.exercicios.includes(exercicio))
    return check ? true : false
  }
  
  return (
    <div>
      {treinos.map(treino =>
        <div>
          <p>{treino.categoria}</p>
          <span>
            {treino.exercicios.map(exercicioNome =>
              <div>
                <p>{ exercicioNome }</p>
                <input type="checkbox"
                value={ exercicioNome }
                checked={!editingTreino ? false : checkValue(exercicioNome, treino.categoria)}
                onChange={(e)=> handleTreinoChecklist(e, treino.categoria)}/>
              </div>
            )}
          </span>
        </div>
      )}
    </div>
)
}
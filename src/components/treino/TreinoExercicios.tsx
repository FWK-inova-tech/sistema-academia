import { treinosOpcoes } from "../../constants/treinosOpcoes";

interface treinoExerciciosProps {
  exercicios: string[]; 
  categoria: string;
  // handleTreinoChecklist: (e: React.ChangeEvent<HTMLInputElement>, categoria: string) => void;
  // editing: boolean;
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


  return (<>
    {exerciciosList.map(exercicio =>
      <div key={exercicio}>
        <p>{ exercicio }</p>
        <input type="checkbox"
        value={ exercicio }
        checked={!editing ? true : checkValue(exercicio)}
        disabled={!editing}
        onChange={(e) => editing && editing.handleTreinoChecklist(e, categoria)}/>
      </div>
    )}
  </>)
}
import type { AlunoType } from "../../types/AlunoType"

interface infoTreinoProps {
  editingInfoTreino: Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>;
  updateInfo: (newInfoTreino: Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>) => void;
}
export const InfoTreino = ({ editingInfoTreino, updateInfo } : infoTreinoProps) => {

  function handleLevelChange(e: React.ChangeEvent<HTMLSelectElement>){
    updateInfo({...editingInfoTreino, nivel: e.target.value as 'Iniciante' | 'Intermediário' | 'Avançado'})
    console.log('info atualizada', editingInfoTreino)
  }

  return (
  <div>
    <label htmlFor='nivel'>Nível</label>
    <select id='nivel' 
    required
    value={editingInfoTreino.nivel}
    onChange={handleLevelChange}>
      <option value='Iniciante'>Iniciante</option>
      <option value='Intermediário'>Intermediário</option>
      <option value='Avançado'>Avançado</option>
    </select>
  </div>
)
}
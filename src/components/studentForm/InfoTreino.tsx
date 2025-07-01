import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType"
import { getLocalDate } from "../../utils/getLocalDate";

interface infoTreinoProps {
  editingInfoTreino: Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>;
  updateInfo: (newInfoTreino: Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>) => void;
}
export const InfoTreino = ({ editingInfoTreino, updateInfo } : infoTreinoProps) => {
  const [teacher, setTeacher] = useState(editingInfoTreino.professor)
  const [startDate, setStartDate] = useState(
    editingInfoTreino.dataInicio.toISOString().split('T')[0]
  );
  const [reviewDate, setReviewDate] = useState(
    editingInfoTreino.dataRevisao.toISOString().split('T')[0]
  );



  function handleLevelChange(e: React.ChangeEvent<HTMLSelectElement>){
    updateInfo({...editingInfoTreino, nivel: e.target.value as 'Iniciante' | 'Intermediário' | 'Avançado'})
    console.log('info atualizada', editingInfoTreino)
  }

  function handleTeacherChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setTeacher(value);
    updateInfo({
      ...editingInfoTreino,
      professor: value
    });
  }

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setStartDate(value);
    updateInfo({
      ...editingInfoTreino,
      dataInicio: getLocalDate(value)
    });
  }

  function handleReviewDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setReviewDate(value);
    updateInfo({
      ...editingInfoTreino,
      dataRevisao: getLocalDate(value)
    });
  }


  return (
  <div>
    <span>
      <label htmlFor='level'>Nível</label>
      <select id='level' 
      required
      value={editingInfoTreino.nivel}
      onChange={handleLevelChange}>
        <option value='Iniciante'>Iniciante</option>
        <option value='Intermediário'>Intermediário</option>
        <option value='Avançado'>Avançado</option>
      </select>
    </span>

    <span>
        <label htmlFor="teacher">Professor(a)</label>
        <input
          id="teacher"
          type="text"
          maxLength={150}
          minLength={10}
          value={teacher}
          onChange={handleTeacherChange}/>
      </span>

      <span>
        <label htmlFor="start-date">Data de início</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}/>
      </span>

      <span>
        <label htmlFor="review-date">Data de revisão</label>
        <input
          id="review-date"
          type="date"
          value={reviewDate}
          onChange={handleReviewDateChange} />
      </span>
  </div>
)
}
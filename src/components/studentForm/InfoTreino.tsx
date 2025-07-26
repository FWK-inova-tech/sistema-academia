import { useState } from "react";
import type { AlunoType } from "../../types/AlunoType"
import { getLocalDate } from "../../utils/getLocalDate";

interface infoTreinoProps {
  editingInfoTreino: Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>;
  updateInfo: (newInfoTreino: Pick<AlunoType, 'nivel' | 'professor' | 'dataInicio' | 'dataRevisao' | 'objetivo' | 'anaminese'>) => void;
  erroMsg?: string;
}
export const InfoTreino = ({ editingInfoTreino, updateInfo, erroMsg }: infoTreinoProps) => {
  const [teacher, setTeacher] = useState(editingInfoTreino.professor)
  const [goal, setGoal] = useState(editingInfoTreino.objetivo)
  const [anaminese, setAnaminese] = useState(editingInfoTreino.anaminese)
  const [startDate, setStartDate] = useState(
    editingInfoTreino.dataInicio.toISOString().split('T')[0]
  )
  const [reviewDate, setReviewDate] = useState(
    editingInfoTreino.dataRevisao.toISOString().split('T')[0]
  )



  function handleLevelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    updateInfo({ ...editingInfoTreino, nivel: e.target.value as 'Iniciante' | 'Intermediário' | 'Avançado' })
  }

  // inputs teacher, goal
  function handleInputChange(info: string, value: string) {
    updateInfo({
      ...editingInfoTreino,
      [info]: value,
    })

    if (info === 'objetivo') { setGoal(value) }
    if (info === 'professor') { setTeacher(value) }
    if (info === 'anaminese') { setAnaminese(value) }
  }

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setStartDate(value)
    if (value.length === 10) {
      updateInfo({
        ...editingInfoTreino,
        dataInicio: getLocalDate(value)
      });
    }
  }

  function handleReviewDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setReviewDate(value)
    if (value.length === 10) {
      updateInfo({
        ...editingInfoTreino,
        dataRevisao: getLocalDate(value)
      })
    }
  }

  return (
    <div className='info-treino'>
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
          placeholder="Nome do professor(a)"
          onChange={(e) => handleInputChange('professor', e.target.value)} />
      </span>

      <span>
        <label htmlFor="start-date">Data de início</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange} />
      </span>

      <span>
        <label htmlFor="review-date">Data de revisão</label>
        <input
          id="review-date"
          type="date"
          value={reviewDate}
          onChange={handleReviewDateChange} />
      </span>

      <span>
        <label htmlFor="goal">Objetivo</label>
        <input
          id="goal"
          type="text"
          maxLength={500}
          minLength={20}
          value={goal}
          placeholder="Objetivo do aluno"
          onChange={(e) => handleInputChange('objetivo', e.target.value)} />
      </span>

      <span>
        <label htmlFor="anaminese">Anaminese</label>
        <textarea
          id="anaminese"
          maxLength={500}
          minLength={20}
          value={anaminese}
          placeholder="Anaminese"
          onChange={(e) => handleInputChange('anaminese', e.target.value)} />
      </span>

      {erroMsg && <p className='form-error-text'>{erroMsg}</p>}
    </div>
  )
}

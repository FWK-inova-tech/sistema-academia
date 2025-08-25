import { useState } from "react";
import type { AlunoType } from "../../../types/AlunoType"
import { getLocalDate } from "../../../utils/getLocalDate";

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
    <div className="info-treino bg-white p-6 rounded-lg border border-gray-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">💪</span>
          Informações para Treino
        </h3>
        <p className="text-sm text-gray-600 mt-1">Dados técnicos e objetivos do aluno</p>
      </div>

      {/* Nível Selection */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <label htmlFor='level' className='block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2'>
          <span className="text-green-600">⭐</span>
          Nível de Treinamento
        </label>
        <select 
          id='level'
          required
          value={editingInfoTreino.nivel}
          onChange={handleLevelChange}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-800 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 font-medium"
        >
          <option value='Iniciante'>🌱 Iniciante</option>
          <option value='Intermediário'>💪 Intermediário</option>
          <option value='Avançado'>🔥 Avançado</option>
        </select>
      </div>

      {/* Datas e Professor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label htmlFor="teacher" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-green-600">👨‍🏫</span>
            Professor(a)
          </label>
          <input
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-800 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
            id="teacher"
            type="text"
            maxLength={150}
            minLength={10}
            value={teacher}
            placeholder="Nome do professor(a)"
            onChange={(e) => handleInputChange('professor', e.target.value)} 
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label htmlFor="start-date" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-green-600">📅</span>
            Data de Início
          </label>
          <input
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-800 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
            id="start-date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange} 
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label htmlFor="review-date" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-green-600">🔄</span>
            Data de Revisão
          </label>
          <input
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-800 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
            id="review-date"
            type="date"
            value={reviewDate}
            onChange={handleReviewDateChange} 
          />
        </div>
      </div>

      {/* Objetivo */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <label htmlFor="goal" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span className="text-green-600">🎯</span>
          Objetivo do Treino
        </label>
        <input
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-800 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
          id="goal"
          type="text"
          maxLength={500}
          minLength={20}
          value={goal}
          placeholder="Ex: Perda de peso, ganho de massa muscular, condicionamento físico..."
          onChange={(e) => handleInputChange('objetivo', e.target.value)} 
        />
      </div>

      {/* Anamnese */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <label htmlFor="anaminese" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span className="text-green-600">📋</span>
          Anamnese
        </label>
        <textarea
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-800 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 resize-none"
          id="anaminese"
          rows={4}
          maxLength={500}
          minLength={20}
          value={anaminese}
          placeholder="Informações médicas relevantes, lesões, limitações, medicamentos..."
          onChange={(e) => handleInputChange('anaminese', e.target.value)} 
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {anaminese.length}/500 caracteres
        </div>
      </div>

      {erroMsg && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-400 mr-2">⚠️</span>
            <p className="text-red-700 font-medium">{erroMsg}</p>
          </div>
        </div>
      )}
    </div>
  )
}

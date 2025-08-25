import { useState } from "react";
import type { AlunoType } from "../../../types/AlunoType"
import { ModalDeleteStudent } from "./ModalDeleteStudent";
import { formatDateToString, formatPhoneNumber, getDaysChecklist } from "../hooks/useStudentSheet";

interface studentSheetProps {
  currentStudentSheet: AlunoType;
  openEdit: () => void;
  closeStudentSheet: () => void;
}

export const StudentSheet = ({ closeStudentSheet, openEdit, currentStudentSheet }: studentSheetProps) => {
  const [modalDelete, setModalDelete] = useState(false)

  function getLevels() {
    const getStudentInfoValue = (toCheck: string) => {
      return currentStudentSheet.nivel === toCheck
    }

    const levels = [
      { level: 'Iniciante', checked: getStudentInfoValue('Iniciante') },
      { level: 'Intermediário', checked: getStudentInfoValue('Intermediário') },
      { level: 'Avançado', checked: getStudentInfoValue('Avançado') },
    ]

    return levels
  }

  function handleSuccessDelete() {
    setModalDelete(false)
    closeStudentSheet()
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {modalDelete ? (
          <ModalDeleteStudent
            actions={{
              cancel: () => setModalDelete(false),
              success: handleSuccessDelete
            }}
            student={{ _id: currentStudentSheet._id, name: currentStudentSheet.nome }} 
          />
        ) : (
          <div className='max-w-6xl mx-auto space-y-6'>
            
            {/* Header da Ficha */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">FICHA DO ALUNO</h1>
                    <h2 className="text-xl lg:text-2xl font-semibold text-green-100">{currentStudentSheet.nome}</h2>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className='bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2'
                      type="button"
                      onClick={openEdit}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Editar
                    </button>
                    <button
                      type="button"
                      className='bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2'
                      onClick={() => setModalDelete(true)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Pessoais */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="bg-green-500 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  DADOS PESSOAIS
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <span className="font-semibold text-gray-700">Contato:</span>
                    <p className="text-gray-900 text-lg">{formatPhoneNumber(currentStudentSheet.contato)}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Nascimento:</span>
                    <p className="text-gray-900 text-lg">{formatDateToString(currentStudentSheet.dataNascimento)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agenda Semanal */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="bg-green-500 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  AGENDA SEMANAL
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {getDaysChecklist(currentStudentSheet.agenda).map(day => (
                    <div key={day.day} className="text-center p-4 bg-gray-50 rounded-lg border">
                      <div className="font-semibold text-gray-800 mb-3">{day.day}</div>
                      <div className={`w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center transition-colors ${
                        day.checked 
                          ? 'bg-green-500 border-green-500 text-white shadow-md' 
                          : 'border-gray-400 bg-white hover:border-gray-500'
                      }`}>
                        {day.checked && <span className="font-bold">✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Informações de Treino */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="bg-green-500 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  INFORMAÇÕES DE TREINO
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div>
                    <span className="font-semibold text-gray-700">Data de Início:</span>
                    <p className="text-gray-900 text-lg">{formatDateToString(currentStudentSheet.dataInicio)}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Data de Revisão:</span>
                    <p className="text-gray-900 text-lg">{formatDateToString(currentStudentSheet.dataRevisao)}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Professor:</span>
                    <p className="text-gray-900 text-lg">{currentStudentSheet.professor}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className="font-semibold text-gray-700 block mb-3">Nível:</span>
                  <div className="flex gap-3">
                    {getLevels().map(level => (
                      <div key={level.level} className={`px-4 py-2 rounded-lg border-2 ${
                        level.checked 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'bg-gray-100 border-gray-300 text-gray-600'
                      }`}>
                        {level.level}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="font-semibold text-gray-700 block mb-3">Anamnese:</span>
                  <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg">
                    {currentStudentSheet.anaminese}
                  </div>
                </div>
              </div>
            </div>

            {/* Perimetria */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="bg-green-500 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a2 2 0 0 0 0-2.828l-8.828-8.828a2 2 0 0 0-2.828 0L2.586 14.586a2 2 0 0 0 0 2.828z"></path>
                    <path d="M7 11h.01"></path>
                  </svg>
                  PERIMETRIA - {formatDateToString(currentStudentSheet.perimetria.data)}
                </h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left font-semibold text-gray-800 p-4 border-b">Região Corporal</th>
                        <th className="text-center font-semibold text-gray-800 p-4 border-b">Medida (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStudentSheet.perimetria.medidas.map((item, index) => (
                        <tr key={item.nome} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-4 text-gray-900 border-b">{item.nome}</td>
                          <td className="p-4 text-center font-semibold text-gray-900 border-b">
                            {item.valor} cm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Programa de Treino */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="bg-green-500 text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 7.5C21 6.12 19.88 5 18.5 5S16 6.12 16 7.5 17.12 10 18.5 10 21 8.88 21 7.5zM16 21v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                  PROGRAMA DE TREINO
                </h3>
              </div>
              <div className="p-6">
                {currentStudentSheet.treino.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-lg">Nenhum treino cadastrado</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentStudentSheet.treino.map(categoria => 
                      <div key={categoria.categoria} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 p-4 border-b">
                          <h4 className="font-semibold text-gray-800 text-lg">{categoria.categoria}</h4>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoria.exercicios.map((exercicio, index) => (
                              <div key={exercicio} className="flex items-center gap-4 p-3 border-b border-gray-200 hover:bg-gray-50">
                                <span className="w-8 h-8 bg-green-500 text-white text-sm rounded-full flex items-center justify-center font-bold">
                                  {index + 1}
                                </span>
                                <span className="text-gray-900">{exercicio}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

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

  return (<>
    <div className="student-sheet bg-gray-100 min-h-screen py-8">
      {modalDelete ? <ModalDeleteStudent
        actions={{
          cancel: () => setModalDelete(false),
          success: handleSuccessDelete
        }}
        student={{ _id: currentStudentSheet._id, name: currentStudentSheet.nome }} />
        : <div className='max-w-5xl mx-auto px-8'>
          
          {/* Cabeçalho da Ficha */}
          <div className="bg-white border-2 border-gray-300 mb-8 shadow-lg">
            {/* Header Superior */}
            <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-5">
                <button
                  onClick={closeStudentSheet}
                  className="text-white hover:bg-[#3d8b40] px-5 py-3 rounded-md transition-colors font-medium"
                >
                  ← Voltar
                </button>
                <h1 className="text-2xl font-bold tracking-wide">FICHA DO ALUNO</h1>
              </div>
              <div className="flex gap-4">
                <button
                  className='bg-white text-[#4CAF50] px-6 py-3 rounded-md font-semibold hover:bg-gray-50 transition-colors shadow-sm'
                  type="button"
                  onClick={openEdit}>
                  ✏️ Editar
                </button>
                <button
                  type="button"
                  className='bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition-colors shadow-sm'
                  onClick={() => setModalDelete(true)}>
                  🗑️ Deletar
                </button>
              </div>
            </div>

            {/* Nome do Aluno */}
            <div className="bg-gray-50 border-b-2 border-gray-300 p-6">
              <h2 className="text-3xl font-bold text-gray-900 text-center tracking-wide">{currentStudentSheet.nome}</h2>
            </div>

            {/* Corpo da Ficha */}
            <div className="p-8">
              
              {/* SEÇÃO 1: DADOS PESSOAIS */}
              <div className="mb-16">
                <div className="bg-white border-2 border-[#4CAF50] rounded-lg shadow-lg mb-8 overflow-hidden">
                  <h3 className="text-xl font-bold text-white bg-gradient-to-r from-[#4CAF50] to-[#45a049] px-8 py-6 border-b-2 border-[#4CAF50]">
                    📋 DADOS PESSOAIS
                  </h3>
                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="flex">
                          <span className="font-bold text-gray-800 w-40 flex-shrink-0">Contato:</span>
                          <span className="text-gray-900 font-medium">{formatPhoneNumber(currentStudentSheet.contato)}</span>
                        </div>
                        <div className="flex">
                          <span className="font-bold text-gray-800 w-40 flex-shrink-0">Nascimento:</span>
                          <span className="text-gray-900 font-medium">{formatDateToString(currentStudentSheet.dataNascimento)}</span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex">
                          <span className="font-bold text-gray-800 w-40 flex-shrink-0">Professor:</span>
                          <span className="text-gray-900 font-medium">{currentStudentSheet.professor}</span>
                        </div>
                        <div className="flex">
                          <span className="font-bold text-gray-800 w-40 flex-shrink-0">Nível:</span>
                          <span className="text-gray-900 font-bold">{currentStudentSheet.nivel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: AGENDA SEMANAL */}
              <div className="mb-16">
                <div className="bg-white border-2 border-[#4CAF50] rounded-lg shadow-lg mb-8 overflow-hidden">
                  <h3 className="text-xl font-bold text-white bg-gradient-to-r from-[#4CAF50] to-[#45a049] px-8 py-6 border-b-2 border-[#4CAF50]">
                    📅 AGENDA SEMANAL
                  </h3>
                  <div className="p-8">
                    <div className="grid grid-cols-7 gap-4">
                      {getDaysChecklist(currentStudentSheet.agenda).map(day => (
                        <div key={day.day} className="text-center border-2 border-gray-300 p-5 bg-white shadow-sm rounded-md">
                          <div className="font-bold text-gray-800 text-sm mb-4">{day.day}</div>
                          <div className={`w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center transition-colors ${
                            day.checked 
                              ? 'bg-[#4CAF50] border-[#4CAF50] text-white shadow-md' 
                              : 'border-gray-400 bg-white hover:border-gray-500'
                          }`}>
                            {day.checked && <span className="text-sm font-bold">✓</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 3: INFORMAÇÕES DE TREINO */}
              <div className="mb-16">
                <div className="bg-white border-2 border-[#4CAF50] rounded-lg shadow-lg mb-8 overflow-hidden">
                  <h3 className="text-xl font-bold text-white bg-gradient-to-r from-[#4CAF50] to-[#45a049] px-8 py-6 border-b-2 border-[#4CAF50]">
                    🏋️ INFORMAÇÕES DE TREINO
                  </h3>
                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-12 mb-8">
                      <div className="space-y-6">
                        <div className="flex">
                          <span className="font-bold text-gray-800 w-40 flex-shrink-0">Data de Início:</span>
                          <span className="text-gray-900 font-medium">{formatDateToString(currentStudentSheet.dataInicio)}</span>
                        </div>
                        <div className="flex">
                          <span className="font-bold text-gray-800 w-40 flex-shrink-0">Data de Revisão:</span>
                          <span className="text-gray-900 font-medium">{formatDateToString(currentStudentSheet.dataRevisao)}</span>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex">
                          <span className="font-bold text-gray-800 w-40 flex-shrink-0">Professor:</span>
                          <span className="text-gray-900 font-medium">{currentStudentSheet.professor}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Nível em linha separada */}
                    <div className="mb-8">
                      <div className="flex items-center gap-6">
                        <span className="font-bold text-gray-800 w-40 flex-shrink-0">Nível:</span>
                        <div className="flex gap-4 flex-wrap">
                          {getLevels().map(level => (
                            <span
                              key={level.level}
                              className={`px-5 py-3 text-sm font-semibold border-2 rounded-md transition-colors ${
                                level.checked 
                                  ? 'bg-[#4CAF50] text-white border-[#4CAF50] shadow-md' 
                                  : 'bg-gray-50 text-gray-600 border-gray-300 hover:border-gray-400'
                              }`}>
                              {level.level}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <div>
                        <span className="font-bold text-gray-800 block mb-4 text-lg">Objetivo:</span>
                        <div className="bg-gray-50 border-2 border-gray-300 p-5 text-gray-900 font-medium rounded-md shadow-sm">
                          {currentStudentSheet.objetivo}
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block mb-4 text-lg">Anamnese:</span>
                        <div className="bg-gray-50 border-2 border-gray-300 p-5 text-gray-900 font-medium rounded-md shadow-sm">
                          {currentStudentSheet.anaminese}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 4: PERIMETRIA */}
              <div className="mb-16">
                <div className="bg-white border-2 border-[#4CAF50] rounded-lg shadow-lg mb-8 overflow-hidden">
                  <h3 className="text-xl font-bold text-white bg-gradient-to-r from-[#4CAF50] to-[#45a049] px-8 py-6 border-b-2 border-[#4CAF50]">
                    📐 PERIMETRIA - {formatDateToString(currentStudentSheet.perimetria.data)}
                  </h3>
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-200 to-slate-300">
                          <th className="text-left font-bold text-gray-900 p-5 border-b-2 border-slate-400">Região Corporal</th>
                          <th className="text-center font-bold text-gray-900 p-5 border-b-2 border-slate-400">Medida (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentStudentSheet.perimetria.medidas.map((item, index) => (
                          <tr key={item.nome} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                            <td className="p-5 text-gray-900 font-medium border-b border-gray-200">{item.nome}</td>
                            <td className="p-5 text-center font-bold text-gray-900 border-b border-gray-200">
                              {item.valor}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 5: PROGRAMA DE TREINO */}
              <div className="mb-16">
                <div className="bg-white border-2 border-[#4CAF50] rounded-lg shadow-lg mb-8 overflow-hidden">
                  <h3 className="text-xl font-bold text-white bg-gradient-to-r from-[#4CAF50] to-[#45a049] px-8 py-6 border-b-2 border-[#4CAF50]">
                    💪 PROGRAMA DE TREINO
                  </h3>
                  <div className="p-8">
                    {currentStudentSheet.treino.length === 0 ? (
                      <div className="text-center py-16 border-2 border-dashed border-gray-400 bg-gray-50 rounded-md">
                        <span className="text-gray-600 font-medium text-lg">Nenhum treino cadastrado</span>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {currentStudentSheet.treino.map(categoria => 
                          <div key={categoria.categoria} className="border-2 border-gray-300 rounded-md shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-200 to-gray-300 p-5 border-b-2 border-gray-400">
                              <h4 className="font-bold text-gray-900 text-lg">{categoria.categoria}</h4>
                            </div>
                            <div className="p-6 bg-white">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categoria.exercicios.map((exercicio, index) => (
                                  <div key={exercicio} className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
                                    <span className="w-8 h-8 bg-[#4CAF50] text-white text-sm rounded-full flex items-center justify-center font-bold shadow-sm">
                                      {index + 1}
                                    </span>
                                    <span className="text-gray-900 font-medium">{exercicio}</span>
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

            </div>
          </div>
        </div>}
    </div>
  </>
  )
}

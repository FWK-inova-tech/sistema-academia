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

  function handleSuccessDelete() {
    setModalDelete(false)
    closeStudentSheet()
  }

  // Render do modal delete
  if (modalDelete) {
    return (
      <ModalDeleteStudent
        actions={{
          cancel: () => setModalDelete(false),
          success: handleSuccessDelete
        }}
        student={{ _id: currentStudentSheet._id, name: currentStudentSheet.nome }}
      />
    );
  }

  // Render principal
  return (
    <div className="space-y-6">
      {/* Dados Pessoais */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
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
            <div className="space-y-2">
              <span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Contato:</span>
              <p className="text-gray-900 text-lg font-medium">{formatPhoneNumber(currentStudentSheet.contato)}</p>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Nascimento:</span>
              <p className="text-gray-900 text-lg font-medium">{formatDateToString(currentStudentSheet.dataNascimento)}</p>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Professor:</span>
              <p className="text-gray-900 text-lg font-medium">{currentStudentSheet.professor || 'Não atribuído'}</p>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Data de Início:</span>
              <p className="text-gray-900 text-lg font-medium">{formatDateToString(currentStudentSheet.dataInicio)}</p>
            </div>
          </div>

          {/* Ações da Ficha */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2'
              type="button"
              onClick={openEdit}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Editar Aluno
            </button>
            <button
              type="button"
              className='bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2'
              onClick={() => setModalDelete(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2 2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              Deletar Aluno
            </button>
          </div>
        </div>
      </div>

      {/* Agenda Semanal */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
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
              <div key={day.day} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="font-semibold text-gray-800 mb-3 text-sm">{day.day}</div>
                <div className={`w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center transition-all duration-200 ${day.checked
                  ? 'bg-green-500 border-green-500 text-white shadow-lg scale-110'
                  : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}>
                  {day.checked && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Anamnese */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            ANAMNESE
          </h3>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-800 leading-relaxed text-lg">
              {currentStudentSheet.anaminese || 'Nenhuma anamnese registrada.'}
            </p>
          </div>
        </div>
      </div>

      {/* Perimetria */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            MEDIDAS CORPORAIS
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                  <th className="text-left font-semibold text-gray-800 p-4 border-b border-gray-300">Região Corporal</th>
                  <th className="text-center font-semibold text-gray-800 p-4 border-b border-gray-300">Medida (cm)</th>
                </tr>
              </thead>
              <tbody>
                {currentStudentSheet.perimetria.medidas.map((item, index) => (
                  <tr key={item.nome} className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="p-4 text-gray-900 border-b border-gray-200 font-medium">{item.nome}</td>
                    <td className="p-4 text-center font-bold text-gray-900 border-b border-gray-200 text-lg">
                      {item.valor} <span className="text-sm text-gray-500 font-normal">cm</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Programa de Treino */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2v20l4-4h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6z"></path>
              <path d="M10 8h4"></path>
              <path d="M10 12h4"></path>
              <path d="M10 16h2"></path>
            </svg>
            PROGRAMA DE TREINO
          </h3>
        </div>
        <div className="p-6">
          {currentStudentSheet.treino.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                  <path d="M6 2v20l4-4h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6z"></path>
                </svg>
              </div>
              <span className="text-gray-600 text-lg font-medium">Nenhum treino cadastrado</span>
              <p className="text-gray-500 text-sm mt-2">Clique em "Editar Aluno" para adicionar exercícios</p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentStudentSheet.treino.map(categoria =>
                <div key={categoria.categoria} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 border-b border-gray-300">
                    <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <span className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {categoria.categoria.charAt(0)}
                      </span>
                      {categoria.categoria}
                    </h4>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoria.exercicios.map((exercicio, index) => (
                        <div key={exercicio} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <span className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-sm rounded-full flex items-center justify-center font-bold shadow-sm">
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
  );
};

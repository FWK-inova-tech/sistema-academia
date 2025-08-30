import { useState } from "react";
import type { AlunoType } from "../../../types/AlunoType"
import { ModalDeleteStudent } from "./ModalDeleteStudent";
import { formatDateToString, getDaysChecklist } from "../hooks/useStudentSheet";

interface studentSheetProps {
  currentStudentSheet: AlunoType;
  closeStudentSheet: () => void;
}

export const StudentSheet = ({ closeStudentSheet, currentStudentSheet }: studentSheetProps) => {
  const [modalDelete, setModalDelete] = useState(false)

  function handleSuccessDelete() {
    setModalDelete(false)
    closeStudentSheet()
  }

  useState(() => {
    const handleOpenDeleteModal = () => setModalDelete(true);
    window.addEventListener('openDeleteModal', handleOpenDeleteModal);
    return () => window.removeEventListener('openDeleteModal', handleOpenDeleteModal);
  });

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Dados Pessoais
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="font-semibold text-gray-600 text-sm">Contato:</span>
              <p className="text-gray-900 text-lg">{currentStudentSheet.contato || 'Não informado'}</p>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-gray-600 text-sm">Data de Nascimento:</span>
              <p className="text-gray-900 text-lg">{formatDateToString(currentStudentSheet.dataNascimento)}</p>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-gray-600 text-sm">Professor Responsável:</span>
              <p className="text-gray-900 text-lg">{currentStudentSheet.professor || 'Não atribuído'}</p>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-gray-600 text-sm">Data de Início:</span>
              <p className="text-gray-900 text-lg">{formatDateToString(currentStudentSheet.dataInicio)}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <span className="font-semibold text-gray-600 text-sm">Data de Revisão:</span>
              <p className="text-gray-900 text-lg">{formatDateToString(currentStudentSheet.dataRevisao)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agenda Semanal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Agenda Semanal
          </h3>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap justify-center gap-4">
            {getDaysChecklist(currentStudentSheet.agenda).map(day => (
              <div key={day.day} className="w-25 text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-semibold text-gray-800 mb-3 text-sm">{day.day}</div>
                <div className={`w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center transition-all duration-200 ${day.checked
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-300 bg-white'
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            Anamnese
          </h3>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <p className="text-gray-800 leading-relaxed">
              {currentStudentSheet.anaminese || 'Nenhuma anamnese registrada.'}
            </p>
          </div>
        </div>
      </div>

      {/* Perimetria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Medidas Corporais
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left font-semibold text-gray-700 p-3">Região Corporal</th>
                  <th className="text-center font-semibold text-gray-700 p-3">Medida (cm)</th>
                </tr>
              </thead>
              <tbody>
                {currentStudentSheet.perimetria.medidas.map((item, index) => (
                  <tr key={item.nome} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-3 text-gray-800">{item.nome}</td>
                    <td className="p-3 text-center font-semibold text-gray-900">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <path d="M6 2v20l4-4h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6z"></path>
              <path d="M10 8h4"></path>
              <path d="M10 12h4"></path>
              <path d="M10 16h2"></path>
            </svg>
            Programa de Treino
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
              <p className="text-gray-500 text-sm mt-2">Edite este aluno para adicionar exercícios</p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentStudentSheet.treino.map(categoria =>
                <div key={categoria.categoria} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-100 p-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                      <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {categoria.categoria.charAt(0)}
                      </span>
                      {categoria.categoria}
                    </h4>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categoria.exercicios.map((exercicio, index) => (
                        <div key={exercicio} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <span className="text-gray-800">{exercicio}</span>
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

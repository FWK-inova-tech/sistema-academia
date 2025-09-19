import React from 'react';
import { Button } from '../../../components/ui';

interface ImportResult {
  message: string;
  resumo: {
    totalLinhas: number;
    linhasProcessadas: number;
    alunosImportados: number;
    erros: number;
    errosValidacao: ValidationError[];
    errosImportacao: any[];
  };
}

interface ValidationError {
  linha: number;
  campo: string;
  erro: string;
  valor: any;
}

interface ImportResultModalProps {
  result: ImportResult;
  onClose: () => void;
}

export const ImportResultModal: React.FC<ImportResultModalProps> = ({ result, onClose }) => {
  const { resumo } = result;

  return (
    <div className="w-full bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {resumo.alunosImportados > 0 ? (
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              ) : (
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                Resultado da Importação
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{resumo.linhasProcessadas}</div>
              <div className="text-sm text-blue-700">Linhas Processadas</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{resumo.alunosImportados}</div>
              <div className="text-sm text-green-700">Alunos Importados</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{resumo.erros}</div>
              <div className="text-sm text-red-700">Erros de Validação</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{resumo.errosImportacao.length}</div>
              <div className="text-sm text-orange-700">Erros de Importação</div>
            </div>
          </div>

          {/* Mensagem de sucesso/erro */}
          {resumo.alunosImportados > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-green-800 font-medium">
                  {resumo.alunosImportados} aluno(s) importado(s) com sucesso!
                </span>
              </div>
            </div>
          )}

          {/* Erros de Validação */}
          {resumo.errosValidacao.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                Erros de Validação
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg max-h-60 overflow-y-auto">
                <div className="p-4">
                  <div className="space-y-2">
                    {resumo.errosValidacao.map((erro, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-red-800">Linha {erro.linha}</span>
                        <span className="text-red-700"> - Campo "{erro.campo}": {erro.erro}</span>
                        {erro.valor && (
                          <span className="text-red-600 block ml-4 italic">Valor: "{erro.valor}"</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Erros de Importação */}
          {resumo.errosImportacao.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-orange-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                Erros de Importação
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg max-h-60 overflow-y-auto">
                <div className="p-4">
                  <div className="space-y-2">
                    {resumo.errosImportacao.map((erro, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium text-orange-800">Aluno: {erro.aluno}</span>
                        <span className="text-orange-700 block ml-4">Erro: {erro.erro}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              className="flex-1"
            >
              {resumo.alunosImportados > 0 ? 'Concluir' : 'Fechar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

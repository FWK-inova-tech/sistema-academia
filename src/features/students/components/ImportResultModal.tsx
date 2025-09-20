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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Importação Concluída</h2>
                <p className="text-gray-600 text-sm">Resumo do processamento</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Estatísticas principais */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{resumo.alunosImportados}</div>
              <div className="text-sm text-green-700 font-medium">Alunos Importados</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{resumo.linhasProcessadas}</div>
              <div className="text-sm text-blue-700 font-medium">Linhas Processadas</div>
            </div>
          </div>

          {/* Mensagem de sucesso */}
          {resumo.alunosImportados > 0 && (
            <div className="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-green-800 font-medium">
                  {resumo.alunosImportados} aluno(s) importado(s) com sucesso!
                </span>
              </div>
            </div>
          )}

          {/* Erros (apenas se houver) */}
          {(resumo.erros > 0 || resumo.errosImportacao.length > 0) && (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm text-red-700 mb-2">
                  <span>Erros encontrados:</span>
                  <span>{resumo.erros + resumo.errosImportacao.length} total</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-red-600">Validação: {resumo.erros}</div>
                  <div className="text-red-600">Importação: {resumo.errosImportacao.length}</div>
                </div>
              </div>

              {/* Detalhes dos erros de validação */}
              {resumo.errosValidacao.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-red-700 mb-2">Erros de Validação:</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <div className="space-y-1 text-xs">
                      {resumo.errosValidacao.slice(0, 5).map((erro, index) => (
                        <div key={index} className="text-red-700">
                          <span className="font-medium">Linha {erro.linha}</span> - {erro.campo}: {erro.erro}
                        </div>
                      ))}
                      {resumo.errosValidacao.length > 5 && (
                        <div className="text-red-600 italic">
                          ... e mais {resumo.errosValidacao.length - 5} erro(s)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Detalhes dos erros de importação */}
              {resumo.errosImportacao.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-orange-700 mb-2">Erros de Importação:</h4>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <div className="space-y-1 text-xs">
                      {resumo.errosImportacao.slice(0, 3).map((erro, index) => (
                        <div key={index} className="text-orange-700">
                          <span className="font-medium">{erro.aluno}</span>: {erro.erro}
                        </div>
                      ))}
                      {resumo.errosImportacao.length > 3 && (
                        <div className="text-orange-600 italic">
                          ... e mais {resumo.errosImportacao.length - 3} erro(s)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botão */}
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Concluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

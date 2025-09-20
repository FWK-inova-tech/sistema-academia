import React, { useState, useRef } from 'react';
import { Button } from '../../../components/ui';
import { Loading } from '../../../components/Loading';

interface ImportAlunosProps {
  onImportComplete: (result: {
    message: string;
    resumo: {
      totalLinhas: number;
      linhasProcessadas: number;
      alunosImportados: number;
      erros: number;
      errosValidacao: any[];
      errosImportacao: any[];
    };
  }) => void;
  onClose: () => void;
}

const getToken = () => {
  return localStorage.getItem('userToken');
};

export const ImportAlunos: React.FC<ImportAlunosProps> = ({ onImportComplete, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Por favor, selecione apenas arquivos Excel (.xlsx, .xls) ou CSV (.csv)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Tamanho máximo: 10MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = getToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch('http://localhost:5000/api/alunos/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao importar alunos');
      }

      const result = await response.json();
      console.log('Resultado da importação:', result);
      
      // Formatar resultado para o modal
      const formattedResult = {
        message: result.message || 'Importação concluída',
        resumo: {
          totalLinhas: result.totalLinhas || 0,
          linhasProcessadas: result.linhasProcessadas || 0,
          alunosImportados: result.success || result.alunosImportados || 0,
          erros: result.errors ? result.errors.length : 0,
          errosValidacao: result.errosValidacao || [],
          errosImportacao: result.errors || []
        }
      };
      
      onImportComplete(formattedResult);
      
    } catch (error) {
      console.error('Erro na importação:', error);
      onImportComplete({
        message: 'Erro na importação',
        resumo: {
          totalLinhas: 0,
          linhasProcessadas: 0,
          alunosImportados: 0,
          erros: 1,
          errosValidacao: [],
          errosImportacao: [error instanceof Error ? error.message : 'Erro desconhecido na importação']
        }
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const token = getToken();
      console.log('Token encontrado:', token ? 'Sim' : 'Não');
      
      if (!token) {
        alert('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }

      console.log('Fazendo requisição para template...');
      const response = await fetch('http://localhost:5000/api/alunos/template', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        
        if (response.status === 401) {
          alert('Token expirado. Faça login novamente.');
          return;
        }
        
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      console.log('Processando blob...');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template-alunos.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Template baixado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao baixar template:', error);
      alert(`Erro ao baixar template: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Importar Alunos</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {isUploading ? (
          <div className="text-center py-8">
            <Loading loadingMessage="Processando planilha..." />
          </div>
        ) : (
          <>
            {/* Área de upload */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                dragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : selectedFile 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleFileSelect(files[0]);
                  }
                }}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="text-green-600">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remover arquivo
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-1">
                      Clique para selecionar ou arraste arquivo aqui
                    </p>
                    <p className="text-sm text-gray-500">
                      Formatos: .xlsx, .xls, .csv (máx. 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botão de template */}
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Precisa de um template?</h3>
                  <p className="text-sm text-gray-600">
                    Baixe nosso modelo com as colunas corretas
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={downloadTemplate}
                  className="ml-4 whitespace-nowrap"
                >
                  Baixar Template
                </Button>
              </div>
            </div>

            {/* Instruções */}
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h3 className="font-medium text-amber-800 mb-2">⚠️ Instruções importantes:</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Colunas obrigatórias: nome, objetivo, dataNascimento, professor, nivel, contato, dataInicio, dataRevisao, anaminese, agenda</li>
                <li>• Formato de data: DD/MM/AAAA (ex: 15/03/1990)</li>
                <li>• Nível deve ser: Iniciante, Intermediário ou Avançado</li>
                <li>• Agenda: dias da semana separados por vírgula (ex: "Segunda, Terça")</li>
              </ul>
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={!selectedFile}
                className="flex-1"
              >
                Importar Alunos
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

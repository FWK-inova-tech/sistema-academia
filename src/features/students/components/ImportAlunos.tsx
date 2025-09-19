import React, { useState, useRef } from 'react';
import { Button } from '../../../components/ui';
import { Loading } from '../../../components/Loading';

interface ImportAlunosProps {
  onImportComplete: (result: ImportResult) => void;
  onClose: () => void;
}

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

export const ImportAlunos: React.FC<ImportAlunosProps> = ({ onImportComplete, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validar tipo de arquivo
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não suportado. Use apenas .xlsx, .xls ou .csv');
      return;
    }

    // Validar tamanho (10MB máximo)
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      alert('Selecione um arquivo primeiro');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/alunos/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro na importação');
      }

      const result: ImportResult = await response.json();
      onImportComplete(result);
    } catch (error: any) {
      alert(`Erro na importação: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/alunos/template/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao baixar template');
      }

      // Criar blob do arquivo
      const blob = await response.blob();

      // Criar link de download
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'template_importacao_alunos.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error: any) {
      alert(`Erro ao baixar template: ${error.message}`);
    }
  };

  return (
    <div className="w-full bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragOver
                ? 'border-blue-400 bg-blue-50'
                : selectedFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileInputChange}
              />

              {selectedFile ? (
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-lg font-medium text-green-700">Arquivo selecionado:</p>
                  <p className="text-sm text-green-600 mt-1">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remover arquivo
                  </button>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="text-lg font-medium text-gray-700">
                    Arraste e solte sua planilha aqui
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    ou clique para selecionar
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Selecionar Arquivo
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Formatos aceitos: .xlsx, .xls, .csv (máx. 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Template */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                📋 Precisa de um modelo?
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Baixe nossa planilha modelo Excel com exemplos de dados e a estrutura correta:
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
              >
                📥 Baixar Template (.xlsx)
              </Button>
            </div>

            {/* Instruções */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                ℹ️ Instruções importantes:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
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

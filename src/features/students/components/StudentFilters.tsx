import React, { useState } from 'react';

interface FiltersProps {
  onFilter: (filters: FilterState) => void;
  totalStudents: number;
}

interface FilterState {
  search: string;
  level: string;
  dateRange: string;
}

export const StudentFilters: React.FC<FiltersProps> = ({ onFilter, totalStudents }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    level: '',
    dateRange: ''
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { search: '', level: '', dateRange: '' };
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-800">Filtros</h3>
            {hasActiveFilters && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                Ativo
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Limpar
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível
              </label>
              <select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
              >
                <option value="">Todos os níveis</option>
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período de cadastro
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200"
              >
                <option value="">Qualquer período</option>
                <option value="week">Última semana</option>
                <option value="month">Último mês</option>
                <option value="quarter">Últimos 3 meses</option>
                <option value="year">Último ano</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <div className="bg-white rounded-lg p-3 border border-gray-200 w-full">
                <div className="text-sm text-gray-600">Total de alunos</div>
                <div className="text-xl font-bold text-green-600">{totalStudents}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

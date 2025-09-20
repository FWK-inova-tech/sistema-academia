import { useState } from "react";
import type { PerimetriaType } from "../../../types/PerimetriaType"
import { PerimetriaItem } from "./PerimetriaItem";
import { getLocalDate } from "../../../utils/getLocalDate";

interface perimetriaProps {
  editingPerimetria: PerimetriaType;
  erroMsg?: string;
  resetError: () => void;
  setPerimetria: (value: React.SetStateAction<PerimetriaType>) => void;
}
export const Perimetria = ({ editingPerimetria, erroMsg, setPerimetria, resetError }: perimetriaProps) => {
  const [date, setDate] = useState(editingPerimetria.data.toISOString().split('T')[0])

  function handleUpdatePerimetriaMedidas(name: string, value: number) {
    resetError()
    setPerimetria(prev => ({
      ...prev,
      medidas: prev.medidas.map(medida =>
        medida.nome === name
          ? (medida.valor !== value ? { ...medida, valor: value } : medida)
          : medida
      )
    }))
  }
  function handleUpdatePerimetriaDate(newDate: Date) {
    setPerimetria(prev => ({
      ...prev,
      data: newDate
    }))
  }

  function handleDateInputChange(dateString: string) {
    resetError()
    setDate(dateString)
    if (dateString.length === 10) {
      handleUpdatePerimetriaDate(getLocalDate(dateString));
    }
  }


  return (
    <div className='space-y-6'>
      <div className='perimetria-date'>
        <label htmlFor="perimetria-date" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <span className="text-[var(--color-primary-600)]">📅</span>
          Data da Avaliação
        </label>
        <input
          className='w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] transition-all duration-200 bg-white outline-none'
          type='date'
          id="perimetria-date"
          value={date}
          onChange={(e) => handleDateInputChange(e.target.value)} />
      </div>

      <div className='perimetria-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {editingPerimetria.medidas.map(item =>
          <div key={item.nome} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-[var(--color-primary-300)] hover:shadow-sm transition-all duration-200">
            <PerimetriaItem
              item={item}
              handleUpdateMedida={handleUpdatePerimetriaMedidas} />
          </div>
        )}
      </div>
      
      {erroMsg && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className='text-red-700 text-sm font-medium'>{erroMsg}</p>
        </div>
      )}
    </div>
  )
}

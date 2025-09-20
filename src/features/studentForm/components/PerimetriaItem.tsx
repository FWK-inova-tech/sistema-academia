import { useState } from "react"
import type { PerimetriaMedidaType } from "../../../types/PerimetriaType"

interface perimetriaItemProps {
  item: PerimetriaMedidaType;
  handleUpdateMedida: (name: string, value: number) => void;
}
export const PerimetriaItem = ({ item, handleUpdateMedida }: perimetriaItemProps) => {
  const [value, setValue] = useState(item.valor.toString())

  function formatNameForId(name: string) {
    return name.replace(/\s+/g, '')
  }

  function handleInputChange(newValue: string) {
    setValue(newValue)
    if (!isNaN(parseFloat(newValue))) {
      handleUpdateMedida(item.nome, parseFloat(newValue))
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label
        htmlFor={formatNameForId(item.nome)}
        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
      >
        <span className="text-[var(--color-primary-600)]">📐</span>
        {item.nome}
      </label>
      <div className="relative">
        <input
          className='w-full px-3 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] transition-all duration-200 text-center font-medium'
          type="number"
          step="0.1"
          min="0"
          id={formatNameForId(item.nome)}
          placeholder='0.0'
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <span className="absolute right-10 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 font-medium">
          {item.nome === 'peso' || item.nome === 'Peso' ? 'kg' : 'cm'}
        </span>
      </div>
    </div>
  )
}

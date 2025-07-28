import { useState } from "react";
import type { PerimetriaType } from "../../types/PerimetriaType"
import { PerimetriaItem } from "./PerimetriaItem";
import { getLocalDate } from "../../utils/getLocalDate";

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
    <div className='perimetria flex flex-col'>
      <span className='perimetria-date flex flex-col items-start'>
        <label htmlFor="perimetria-date">
          Data:
        </label>
        <input
          className='bg-[var(--secondaryColor)] border border-[var(--primaryColor)] px-3 rounded-3xl w-[12em] mb-2'
          type='date'
          id="perimetria-date"
          value={date}
          onChange={(e) => handleDateInputChange(e.target.value)} />
      </span>
      <span className='perimetria-list grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2'>
        {editingPerimetria.medidas.map(item =>
          <span key={item.nome} className="bg-[var(--primaryColor)] text-white py-2 px-3 flex flex-row justify-between rounded-[10px]">
            <PerimetriaItem
              item={item}
              handleUpdateMedida={handleUpdatePerimetriaMedidas} />
          </span>
        )}
      </span>
      {erroMsg && <p className='form-error-text'>{erroMsg}</p>}
    </div>
  )
}

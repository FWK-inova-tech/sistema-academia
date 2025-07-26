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
    <div className='perimetria'>
      <span className='perimetria-date'>
        <label htmlFor="perimetria-date">Data</label>
        <input
          type='date'
          id="perimetria-date"
          value={date}
          onChange={(e) => handleDateInputChange(e.target.value)} />
      </span>
      <span className='perimetria-list'>
        {editingPerimetria.medidas.map(item =>
          <span key={item.nome}>
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

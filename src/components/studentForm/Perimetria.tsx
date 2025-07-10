import { useState } from "react";
import type { PerimetriaType } from "../../types/PerimetriaType"
import { PerimetriaItem } from "./PerimetriaItem";
import { getLocalDate } from "../../utils/getLocalDate";

interface perimetriaProps {
  editingPerimetria: PerimetriaType;
  handleUpdatePerimetriaMedidas: (name: string, value: number) => void;
  handleUpdatePerimetriaDate: (newDate: Date) => void;
  erroMsg?: string;
}
export const Perimetria = ({ editingPerimetria, handleUpdatePerimetriaMedidas, handleUpdatePerimetriaDate, erroMsg } : perimetriaProps) => {
  const [date, setDate] = useState(editingPerimetria.data.toISOString().split('T')[0])

  function handleDateChange(dateString: string){
    setDate(dateString)
    if(dateString.length === 10){
      handleUpdatePerimetriaDate(getLocalDate(dateString));
    }
  }

  return (
  <div>
    <span>
      <label htmlFor="perimetria-date">Data da Perimetria</label>
      <input 
      type='date'
      id="perimetria-date" 
      value={date}
      onChange={(e)=> handleDateChange(e.target.value)}/>
    </span>
    <span>
      {editingPerimetria.medidas.map(item =>
        <span key={item.nome}>
          <PerimetriaItem
          item={item}
          handleUpdateMedida={handleUpdatePerimetriaMedidas}/>
        </span>
      )}
    </span>
    {erroMsg && <p className='form-error-text'>{erroMsg}</p>}
  </div>
)
}
import { useState } from "react";
import type { PerimetriaType } from "../../types/PerimetriaType"
import { PerimetriaItem } from "./PerimetriaItem";
import { v4 as uuidv4 } from 'uuid';
import { getLocalDate } from "../../utils/getLocalDate";

interface perimetriaProps {
  editingPerimetria: PerimetriaType;
  handleUpdatePerimetriaMedidas: (name: string, value: number) => void;
  handleUpdatePerimetriaDate: (newDate: Date) => void;
}
export const Perimetria = ({ editingPerimetria, handleUpdatePerimetriaMedidas, handleUpdatePerimetriaDate } : perimetriaProps) => {
  const [date, setDate] = useState(editingPerimetria.data.toISOString().split('T')[0])

  function handleDateChange(dateString: string){
    setDate(dateString)
    handleUpdatePerimetriaDate(getLocalDate(dateString));
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
        <span key={uuidv4()}>
          <PerimetriaItem
          item={item}
          handleUpdateMedida={handleUpdatePerimetriaMedidas}/>
        </span>
      )}
    </span>
  </div>
)
}
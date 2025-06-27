import { useState } from "react";
import type { PerimetriaType } from "../../types/PerimetriaType"
import { PerimetriaItem } from "./PerimetriaItem";

interface perimetriaProps {
  editingPerimetria: PerimetriaType;
  handleUpdatePerimetriaMedidas: (name: string, value: number) => void;
  handleUpdatePerimetriaDate: (newDate: string) => void;
}
export const Perimetria = ({ editingPerimetria, handleUpdatePerimetriaMedidas, handleUpdatePerimetriaDate } : perimetriaProps) => {
  const [date, setDate] = useState(editingPerimetria.data)

  return (
  <div>
    <input 
    type='date' 
    value={date}
    onChange={(e)=> {handleUpdatePerimetriaDate(e.target.value);setDate(e.target.value)}}/>
    <span>
      {editingPerimetria.medidas.map(item =>
        <span>
          <PerimetriaItem
          item={item}
          handleUpdateMedida={handleUpdatePerimetriaMedidas}/>
        </span>
      )}
    </span>
  </div>
)
}
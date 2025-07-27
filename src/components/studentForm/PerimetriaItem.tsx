import { useState } from "react"
import type { PerimetriaMedidaType } from "../../types/PerimetriaType"

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

  return (<>
    <label htmlFor={formatNameForId(item.nome)}>{item.nome}</label>
    <input
      className='w-[5em] bg-white text-black px-2 rounded-[4px]'
      type="number"
      step="any"
      id={formatNameForId(item.nome)}
      placeholder={'0.00'}
      value={value}
      onChange={(e) => handleInputChange(e.target.value)} />
  </>)
}

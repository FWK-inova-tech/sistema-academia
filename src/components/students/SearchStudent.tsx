import { useState } from "react";

interface searchStudentProps {
  handleSearch: (name: string) => void;
}
export const SearchStudent = ({ handleSearch }: searchStudentProps) => {
  const [searchTerm, setSearchTerm] = useState("")

  function handleInputChange(name: string) {
    setSearchTerm(name)
    handleSearch(name)
  }

  return (
    <div className="search-student">
      <input
        className='bg-[var(--secondaryColor)] px-3 py-1 rounded-3xl'
        type="text"
        placeholder="Buscar aluno pelo nome..."
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)} />
    </div>
  )
}

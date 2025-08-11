import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../stores/appStore";
import { setIsOnSearching } from "../../../stores/studentsStore";

interface searchStudentProps {
  handleSearch: (name: string) => void;
}

export const SearchStudent = ({ handleSearch }: searchStudentProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const dispatch = useAppDispatch()
  const isOnSearching = useAppSelector((state) => state.students.isOnSearching)
  

  function handleInputChange(name: string) {
    setSearchTerm(name)
    handleSearch(name)
    if(searchTerm.trim() === "" && isOnSearching) {
      dispatch(setIsOnSearching(false))
      return
    }

    if(searchTerm.trim() !== "" && !isOnSearching){
      dispatch(setIsOnSearching(true))
    }

  }

  function cleanSearch() {
    setSearchTerm("")
    handleSearch("")
    dispatch(setIsOnSearching(false))
  }

  const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  )

  return (
    <div className="search-student w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="🔍 Buscar aluno pelo nome..."
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md bg-white"
        />
        {searchTerm && (
          <button
            onClick={cleanSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

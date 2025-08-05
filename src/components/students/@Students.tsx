import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../stores/appStore"
import { setLoading } from "../../stores/studentsStore"
import { getAluno } from "../../service/fetchAPI"
import type { AlunoType } from "../../types/AlunoType";
import { StudentSheet } from "./StudentSheet";
import { StudentForm } from "../studentForm/@StudentForm";
import { Loading } from "../../components/Loading";
import { Table, Button } from "../ui";
import type { TableColumn, TableAction } from "../ui/Table/Table";
import './Students.css';

interface studentsProps {
  currentStudentsList: Pick<AlunoType, '_id' | 'nome'>[];
  setError: (error: {
    message: string;
    callback: () => Promise<void> | void;
  }) => void;
  handleOpensheet: () => void;
  controlOpenSheet: (action: 'close' | 'open') => void;
}

export const Students = ({ currentStudentsList, setError, handleOpensheet, controlOpenSheet }: studentsProps) => {
  const [openEdit, setOpenEdit] = useState(false)
  const [currentStudentSheet, setCurrentStudentSheet] = useState<false | AlunoType | null>(false)
  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.students.loading)

  async function handleOpenStudentSheet(id: string) {
    dispatch(setLoading("Buscando dados do aluno"))
    try {
      const req = await getAluno(id)
      if (req) {
        setCurrentStudentSheet(req)
        handleOpensheet()
      } else {
        setCurrentStudentSheet(null)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro na requisição para buscar os dados do aluno"
      setError({
        message: errorMessage,
        callback: () => { handleOpenStudentSheet(id) }
      })
    } finally {
      dispatch(setLoading(false))
    }
  }

  function handleCloseStudentSheet() {
    setCurrentStudentSheet(false)
    controlOpenSheet('close')
  }

  function handleOpenEdit() {
    controlOpenSheet('open')
    setOpenEdit(true)
  }

  function handleCloseEdit() {
    setOpenEdit(false)
  }

  // Configuração das colunas da tabela
  const columns: TableColumn[] = [
    {
      key: '_id',
      header: 'ID',
      width: '140px',
      align: 'center',
      render: (value: string) => (
        <span className="student-id" title={value}>
          #{value.slice(0, 7)}...
        </span>
      )
    },
    {
      key: 'nome',
      header: 'Nome do Aluno',
      align: 'left'
    }
  ];

  // Configuração das ações da tabela
  const actions: TableAction[] = [
    {
      label: 'Abrir ficha',
      variant: 'primary',
      onClick: (row) => handleOpenStudentSheet(row._id),
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      )
    }
  ];

  return (
    <>
      {loading ? (
        <Loading loadingMessage={loading} />
      ) : (
        <>
          {currentStudentSheet ? (
            <>
              {openEdit ? (
                <StudentForm
                  currentStudentSheet={{ student: currentStudentSheet, updateCurrentStudentSheet: setCurrentStudentSheet }}
                  closeForm={handleCloseEdit} 
                />
              ) : (
                <div className="student-sheet-container">
                  <div className="student-sheet-header">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleCloseStudentSheet}
                      leftIcon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                      }
                    >
                      Voltar para a lista
                    </Button>
                  </div>
                  <StudentSheet
                    closeStudentSheet={handleCloseStudentSheet}
                    currentStudentSheet={currentStudentSheet}
                    openEdit={handleOpenEdit} 
                  />
                </div>
              )}
            </>
          ) : currentStudentSheet !== false ? (
            <div className="error-message">
              <p>Não foi encontrado nenhum aluno com o id informado</p>
            </div>
          ) : (
            <div className="students-content">
              <div className="students-header">
                <h1 className="students-title">Lista de Alunos</h1>
                <p className="students-subtitle">
                  {currentStudentsList.length === 0 
                    ? "Nenhum aluno cadastrado" 
                    : `${currentStudentsList.length} aluno${currentStudentsList.length !== 1 ? 's' : ''} encontrado${currentStudentsList.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
              
              <Table
                columns={columns}
                data={currentStudentsList}
                actions={actions}
                emptyMessage="Nenhum aluno cadastrado ainda. Comece criando o primeiro cadastro!"
                className="students-table"
              />
            </div>
          )}
        </>
      )}
    </>
  )
}

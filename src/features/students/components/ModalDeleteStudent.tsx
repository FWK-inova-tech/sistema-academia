import { toast } from "react-toastify";
import { useAppDispatch } from "../../../stores/appStore";
import { removeAluno, setLoading } from "../../../stores/studentsStore";
import { deleteAluno } from "../../../service/fetchAPI";

interface modalDeleteStudentProps {
  student: { name: string, _id: string };
  actions: {
    cancel: () => void;
    success: () => void;
  }
}
export const ModalDeleteStudent = ({ student, actions }: modalDeleteStudentProps) => {
  const dispatch = useAppDispatch()

  async function deleteStudent() {
    dispatch(setLoading(`Deletando ficha do aluno(a) ${student.name}`))
    await deleteAluno(student._id)
      .then(() => {
        dispatch(removeAluno(student._id))
        toast.success('Ficha deletada')
        actions.success()
      })
      .catch(error => {
        const errorMessage = error instanceof Error ? `Erro ao tentar registrar ficha: ${error.message}` : 'Erro ao tentar registrar ficha'
        toast.error(errorMessage)
        actions.cancel()
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>Deletar Aluno</h1>
          <p className="text-gray-600">
            Você tem certeza que deseja deletar a ficha do aluno(a){' '}
            <span className="font-semibold text-gray-800">{student.name}</span>?
          </p>
          <p className="text-sm text-red-600 mt-2">Esta ação não pode ser desfeita.</p>
        </div>
        
        <div className='flex flex-col gap-3'>
          <button
            className='bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1'
            type="button"
            onClick={deleteStudent}>
            Confirmar Exclusão
          </button>
          <button
            className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200'
            type="button"
            onClick={actions.cancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

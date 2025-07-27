import { toast } from "react-toastify";
import { useAppDispatch } from "../../stores/appStore";
import { removeAluno, setLoading } from "../../stores/studentsStore";
import { deleteAluno } from "../../utils/fetchAPI";

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
    <div>
      <h1 className='text-[var(--primaryColor)] text-3xl font-medium mb-2'>Deletando aluno</h1>
      <p>Você tem certeza que deseja deletar a ficha do aluno(a) {student.name}?</p>
      <span className='flex flex-col gap-2 w-full items-center'>
        <button
          className='btn btn-red px-3 w-[7em]'
          type="button"
          onClick={deleteStudent}>
          Deletar
        </button>
        <button
          className='btn btn-blue px-3 w-[7em]'
          type="button"
          onClick={actions.cancel}>
          Cancelar
        </button>
      </span>
    </div>
  )
}

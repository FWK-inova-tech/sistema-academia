import { toast } from "react-toastify";
import { useAppDispatch } from "../../stores/appStore";
import { removeAluno, setLoading } from "../../stores/studentsStore";
import { deleteAluno } from "../../utils/fetchAPI";

interface modalDeleteStudentProps{
  student: {name: string, _id: string};
  actions: {
    cancel: () => void;
    success: () => void;
  }
}
export const ModalDeleteStudent = ({student, actions} : modalDeleteStudentProps) => {
  const dispatch = useAppDispatch()

  async function deleteStudent(){
    dispatch(setLoading(`Deletando ficha do aluno(a) ${student.name}`))
    await deleteAluno(student._id)
    .then(()=>{
      dispatch(removeAluno(student._id))
      toast.success('Ficha deletada')
      actions.success()
    })
    .catch(error => {
      const errorMessage = error instanceof Error ? `Erro ao tentar registrar ficha: ${error.message}` : 'Erro ao tentar registrar ficha'
      toast.error(errorMessage)
      actions.cancel()
    })
    .finally(()=>{
      dispatch(setLoading(false))
    })
  }

  return (
    <div>
      <p>Você tem certeza que deseja deletar a ficha do aluno(a) {student.name}?</p>
      <span>
        <button
        type="button"
        onClick={actions.cancel}>
          Cancelar
        </button>
        <button
        type="button"
        onClick={deleteStudent}>
          Deletar
        </button>
      </span>
    </div>
  )
}
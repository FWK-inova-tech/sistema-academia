import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../stores/appStore"
import { setLoading } from "../stores/studentsStore"
import { toast } from "react-toastify"
import { logout } from "../stores/authStore"
import { changePassword } from "../service/fetchAPI"
import { useState } from "react"

export const useSettings = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [onChangePassword, setOnChangePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | false>(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setErrorMessage('Você digitou duas senhas diferentes. Tente novamente.')
      return
    }
    dispatch(setLoading('Salvando nova senha, por favor aguarde'))

    await changePassword(password, currentPassword)
      .then(() => {
        toast.success('Senha alterada com sucesso')
      })
      .catch((error: any) => {
        const errorMessage = error.response.data.message ? `Erro ao tentar registrar ficha: ${error.response.data.message}` : 'Erro ao tentar registrar ficha'
        toast.error(errorMessage)
        setOnChangePassword(false)
      })
      .finally(() => {
        dispatch(setLoading(false))
      })

  }

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }
  return {
    onChangePassword, password, errorMessage, confirmPassword, currentPassword,
    setOnChangePassword, setPassword, setErrorMessage, setConfirmPassword, setCurrentPassword, handleSubmit, handleLogout
  }
}

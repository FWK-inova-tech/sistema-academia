import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useState } from "react"
import { logout, setLoading } from "../../../stores/authStore"
import { changePassword } from "../../../service/fetchAPI"
import { useAppDispatch } from "../../../stores/appStore"

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

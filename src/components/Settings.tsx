import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../stores/appStore"
import { Loading } from "./Loading"
import { setLoading } from "../stores/studentsStore"
import { changePassword } from "../utils/fetchAPI"
import { toast } from "react-toastify"
import { logout } from "../stores/authStore"
import { useNavigate } from "react-router-dom"

export const Settings = () => {
  const isAuthLoading = useAppSelector((state) => state.auth.loading)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [onChangePassword, setOnChangePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | false>(false)
  const [confirmPassword, setConfirmPassowrd] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setErrorMessage('Você digitou duas senhas diferentes. Tente novamente.')
      return
    }
    dispatch(setLoading('Salvando nova senha, por favor aguarde'))

    await changePassword(password)
      .then(() => {
        setLoading(false)
        toast.success('Senha alterada com sucesso')
      })
      .catch(error => {
        const errorMessage = error instanceof Error ? `Erro ao tentar registrar ficha: ${error.message}` : 'Erro ao tentar registrar ficha'
        toast.error(errorMessage)
        setOnChangePassword(false)
      })
      .finally(() => {
        setLoading(false)
      })

  }

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  const inputClassname = 'flex pl-1 w-6 min-w-fit border border-[var(--primaryColor)] rounded-3xl bg-none'
  const spanInputHolder = 'flex flex-col items-start'

  return <div className="flex flex-col items-center gap-3 mt-15">
    {isAuthLoading ? <Loading loadingMessage={isAuthLoading} />
      :
      <>
        <h1 className='text-[var(--primaryColor)] text-4xl font-medium mb-2'>
          {onChangePassword ? 'Alterar senha' : 'Configurações'}
        </h1>
        {onChangePassword ? <>
          <form
            className="change-password flex flex-col justify-center items-center"
            onSubmit={handleSubmit}>
            <span className={spanInputHolder}>
              <label htmlFor="newPassword">Nova senha:</label>
              <input
                className={inputClassname}
                id="newPassword"
                type="password"
                minLength={10}
                maxLength={30}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(false) }} />
            </span>
            <span className={spanInputHolder}>
              <label htmlFor="confirmPassword">Confirmar senha:</label>
              <input
                className={inputClassname}
                id="confirmPassword"
                type="password"
                minLength={10}
                maxLength={30}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassowrd(e.target.value); setErrorMessage(false) }} />
            </span>
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
            <span className='actions flex flex-col items-center gap-2 mt-2'>
              <button className='btn btn-blue px-3' type="submit">Salvar</button>
              <button
                className='btn btn-red px-3'
                type="button"
                onClick={() => setOnChangePassword(false)}>
                Cancelar
              </button>
            </span>
          </form>
        </> : <>
          <span className="email flex flex-col items-start w-">
            <p className='font-medium'>Email:</p>
            <p className='w-[10em] flex justify-start pl-1 border border-[var(--primaryColor)] rounded-3xl'>adm@mail.com</p>
          </span>
          <span className='actions flex flex-col items-center gap-2'>
            <button
              type="button"
              className='btn btn-blue px-3'
              onClick={() => setOnChangePassword(true)}>
              Alterar senha
            </button>
            <button
              type="button"
              className='btn btn-red px-3'
              onClick={handleLogout}>
              Desconectar
            </button>
          </span>
        </>}
      </>}
  </div>
}

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../stores/appStore"
import { Loading } from "./Loading"
import { setLoading } from "../stores/studentsStore"
import { changePassword } from "../utils/fetchAPI"
import { toast } from "react-toastify"
import { logout } from "../stores/authStore"
import { useNavigate } from "react-router-dom"

export const Settings = () => {
  const isAuthLoading = useAppSelector((state)=> state.auth.loading)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [onChangePassword, setOnChangePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | false>(false)
  const [confirmPassword, setConfirmPassowrd] = useState('')

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    if(password !== confirmPassword){
      setErrorMessage('Você digitou duas senhas diferentes. Tente novamente.')
      return
    }
    dispatch(setLoading('Salvando nova senha, por favor aguarde'))

    await changePassword(password)
    .then(()=>{
      setLoading(false)
      toast.success('Senha alterada com sucesso')
    })
    .catch(error=>{
      const errorMessage = error instanceof Error ? `Erro ao tentar registrar ficha: ${error.message}` : 'Erro ao tentar registrar ficha'
      toast.error(errorMessage)
      setOnChangePassword(false)
    })
    .finally(()=>{
      setLoading(false)
    })

  }

  function handleLogout(){
    dispatch(logout())
    navigate('/login')
  }

  return <div>
    {isAuthLoading ? <Loading loadingMessage={isAuthLoading}/>
    : 
    <>
      <h2>Configurações</h2>
      {onChangePassword ? <>
        <form 
        className="change-password"
        onSubmit={handleSubmit}>
          <p>Alterar senha</p>
          <span>
            <label htmlFor="newPassword">Nova senha:</label>
            <input 
            id="newPassword"
            type="password"
            minLength={10}
            maxLength={30}
            value={password}
            onChange={(e)=> {setPassword(e.target.value); setErrorMessage(false)}}/>
          </span>
          <span>
            <label htmlFor="confirmPassword">Confirmar senha:</label>
            <input 
            id="confirmPassword"
            type="password"
            minLength={10}
            maxLength={30}
            value={confirmPassword}
            onChange={(e)=> {setConfirmPassowrd(e.target.value); setErrorMessage(false)}}/>
          </span>
          {errorMessage && <p className='error-message'>{errorMessage}</p>}
          <button type="submit">Salvar</button>
          <button
          type="button"
          onClick={()=> setOnChangePassword(false)}>
            Cancelar
          </button>
        </form>
      </> : <>
        <span className="email">
          <p>Email:</p>
          <p>adm@mail.com</p>
        </span>
        <button
        type="button"
        onClick={()=>setOnChangePassword(true)}>
          Alterar senha
        </button>
        <button
        type="button"
        onClick={handleLogout}>
          Desconectar
        </button>
      </>}
    </>}
  </div>
}
import { useAppSelector } from "../stores/appStore"
import { Loading } from "./Loading"
import { useSettings } from "../hooks/useSettings"

export const Settings = () => {
  const isAuthLoading = useAppSelector((state) => state.auth.loading)
  const { confirmPassword, currentPassword, errorMessage, handleLogout, handleSubmit, onChangePassword, password, setConfirmPassword, setCurrentPassword, setErrorMessage, setOnChangePassword, setPassword } = useSettings()

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
              <label htmlFor="currentPassword">Senha atual:</label>
              <input
                className={inputClassname}
                id="currentPassword"
                type="password"
                minLength={10}
                maxLength={30}
                value={currentPassword}
                onChange={(e) => { setCurrentPassword(e.target.value); setErrorMessage(false) }} />
            </span>

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
                onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(false) }} />
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

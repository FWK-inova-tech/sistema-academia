import { useAppSelector } from "../../../stores/appStore"
import { Loading } from "../../../components/Loading"
import { Button } from "../../../components/ui/Button/Button"
import { Input } from "../../../components/ui/Input/Input"
import { Card } from "../../../components/ui/Card/Card"
import { useSettings } from "../hooks/useSettings"

export const Settings = () => {
  const isAuthLoading = useAppSelector((state) => state.auth.loading)
  const { confirmPassword, currentPassword, errorMessage, handleLogout, handleSubmit, onChangePassword, password, setConfirmPassword, setCurrentPassword, setErrorMessage, setOnChangePassword, setPassword } = useSettings()

  return (
    <div className="settings-container min-h-screen p-6" style={{ background: '#008058' }}>
      <div className="max-w-md mx-auto">
        {isAuthLoading ? (
          <Loading loadingMessage={isAuthLoading} />
        ) : (
          <Card>
            <div className="text-center mb-6">
              <h1 className='text-3xl font-semibold text-gray-900'>
                {onChangePassword ? 'Alterar senha' : 'Configurações'}
              </h1>
            </div>
            
            {onChangePassword ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  label="Senha atual"
                  id="currentPassword"
                  type="password"
                  minLength={10}
                  maxLength={30}
                  value={currentPassword}
                  onChange={(e) => { 
                    setCurrentPassword(e.target.value); 
                    setErrorMessage(false) 
                  }}
                  required
                />

                <Input
                  label="Nova senha"
                  id="newPassword"
                  type="password"
                  minLength={10}
                  maxLength={30}
                  value={password}
                  onChange={(e) => { 
                    setPassword(e.target.value); 
                    setErrorMessage(false) 
                  }}
                  required
                />

                <Input
                  label="Confirmar senha"
                  id="confirmPassword"
                  type="password"
                  minLength={10}
                  maxLength={30}
                  value={confirmPassword}
                  onChange={(e) => { 
                    setConfirmPassword(e.target.value); 
                    setErrorMessage(false) 
                  }}
                  required
                />

                {errorMessage && (
                  <div className="text-red-600 text-sm text-center">{errorMessage}</div>
                )}
                
                <div className='flex flex-col gap-3 pt-4'>
                  <Button type="submit" variant="primary" className="w-full">
                    Salvar
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => setOnChangePassword(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className='text-sm font-medium text-gray-700'>Email:</label>
                  <div className='p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900'>
                    adm@mail.com
                  </div>
                </div>
                
                <div className='flex flex-col gap-3'>
                  <Button
                    type="button"
                    variant="primary"
                    className="w-full"
                    onClick={() => setOnChangePassword(true)}
                  >
                    Alterar senha
                  </Button>
                  <Button
                    type="button"
                    variant="error"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Desconectar
                  </Button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

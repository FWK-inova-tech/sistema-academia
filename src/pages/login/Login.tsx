import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/appStore";
import { loginUser } from "../../stores/authStore";
import { Button, Input, Card } from "../../components/ui";
import './../../style/login.css'
import { ToastContainer } from "react-toastify";
import Logo from './../../assets/logo.png'

export const Login = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const status = useAppSelector((state) => state.auth.status)
  const error = useAppSelector((state) => state.auth.error)
  const authenticated = useAppSelector((state) => state.auth.authenticated)


  if (authenticated) return <Navigate to={'/'} />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await dispatch(loginUser({ email, password }))

    if (loginUser.fulfilled.match(result)) {
      navigate("/")
    }
  }

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  )

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  )

  return (
    <main className='login-page'>
      <ToastContainer />

      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <img src={Logo} alt="Logo da academia ProFitness" className="login-logo-img" />
          </div>
        </div>

        <Card variant="elevated" padding="xl" className="login-card">
          <div className="login-card-header">
            <h1 className="login-title">Bem-vindo de volta!</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              type="email"
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="filled"
              size="lg"
              fullWidth
              required
            />

            <div className="password-field-wrapper">
              <Input
                type={showPassword ? "text" : "password"}
                label="Senha"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="filled"
                size="lg"
                fullWidth
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={status === "loading"}
              fullWidth
            >
              {status === "loading" ? "Entrando..." : "Entrar"}
            </Button>

            {status === "failed" && error !== "Seção inválida" && (
              <div className="login-error">
                <p>{error}</p>
              </div>
            )}
          </form>
        </Card>
      </div>
    </main>
  );
}

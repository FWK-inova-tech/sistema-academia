import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/appStore";
import { loginUser } from "../../stores/authStore";
import './../../style/login.css'
export const Login = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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

  return (
    <main id='login'>
      <h1 className='text-4xl bg-[var(--secondaryColor)] text-[var(--primaryColor)] text-center px-20 py-2 rounded-4xl mt-2'>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='btn btn-green px-3'
          type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Entrando..." : "Entrar"}
        </button>
      </form>
      {status === "failed" && <p>{error}</p>}
    </main>
  );
}

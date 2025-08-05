import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import './style/App.css'
import './style/styledCheckbox.css'
import { PrivateRoute } from "./pages/homepage/PrivateRoute";
import { Dashboard } from "./pages/homepage/Dashboard";
import { Login } from "./pages/login/Login";
import { useAppDispatch } from "./stores/appStore";
import { checkExistingToken } from "./stores/authStore";

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Verificar se há token existente na inicialização
    dispatch(checkExistingToken())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App

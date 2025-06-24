import { Routes, Route } from "react-router-dom";
import './style/App.css'
import { PrivateRoute } from "./pages/homepage/PrivateRoute";
import { Dashboard } from "./pages/homepage/Dashboard";
import { Login } from "./pages/login/Login";

function App() {

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

import { useSelector } from "react-redux";
import type { RootState } from "../../stores/appStore";
import { Navigate, Outlet } from "react-router-dom";


export const PrivateRoute = () =>{
  const authenticated = useSelector((state: RootState) => state.auth.authenticated)
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
}
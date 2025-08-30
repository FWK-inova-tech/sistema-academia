import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "../../stores/appStore";
import { Navigate, Outlet } from "react-router-dom";
import { checkToken } from "../../stores/authStore";
import { useEffect } from "react";


export const PrivateRoute = () => {
  const { authenticated, status } = useSelector((state: RootState) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === "none") {
      dispatch(checkToken())
    }
  }, [status, dispatch])

  if (status === "loading" || status === 'none') {
    return <p>Carregando...</p>
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
}

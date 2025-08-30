import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "../../stores/appStore";
import { Navigate, Outlet } from "react-router-dom";
import { checkToken } from "../../stores/authStore";
import { useEffect } from "react";
import { Loading } from "../../components/Loading";


export const PrivateRoute = () => {
  const { authenticated, status } = useSelector((state: RootState) => state.auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (status === "none") {
      dispatch(checkToken())
    }
  }, [status, dispatch])

  if (status === "loading" || status === 'none') {
    return <div className="w-full h-screen flex items-center justify-center">
      <Loading loadingMessage="Carregando" />
    </div>
  }


  return authenticated ? <Outlet /> : <Navigate to="/login" />;
}

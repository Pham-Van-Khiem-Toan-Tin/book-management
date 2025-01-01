import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxhooks"
import { loginSuccess } from "../../apis/actions/auth.action";
import Loading from "../../common/loading/Loading";
import { Navigate } from "react-router";
import { toast } from "react-toastify";
import { resetError } from "../../apis/slices/token.slice";

const LoginSuccess = () => {
  const { loading, message } = useAppSelector((state) => state.token);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loginSuccess());
  }, [dispatch]);
  useEffect(() => {
    if (message) {
      toast.error(message)
      dispatch(resetError());
    }
  }, [dispatch, message])
  if (localStorage.getItem("act")) {
    return <Navigate to="/" replace />
  } else {
    if (loading) {
      return <Loading />
    }
    return (
      <Navigate to="/" replace />
    )
  }
}

export default LoginSuccess;
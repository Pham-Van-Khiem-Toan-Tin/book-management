import { Navigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

const LoginFail = () => {
    const { message } = useParams();
    toast.error(message);
    return (
        <Navigate to="/login" replace={true} />
    )
}

export default LoginFail
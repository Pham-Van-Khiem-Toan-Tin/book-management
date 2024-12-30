import { ReactElement } from 'react'
import { Navigate } from 'react-router';

interface ProtectRouterProps {
    children: ReactElement
}
const ProtectRouter = ({ children }: ProtectRouterProps) => {
    const isAuthenticated = localStorage.getItem("act");
    if (isAuthenticated) {
        return children
    }
    return (
        <Navigate to="/login" replace={true} />
    )
}

export default ProtectRouter
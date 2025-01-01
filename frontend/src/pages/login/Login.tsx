import { Link, Navigate } from "react-router";

import GoogleLogo from "../../assets/images/login/google-button-logo.png";
import FacebookLogo from "../../assets/images/login/facebook-button-logo.png";
import Logo from "../../assets/images/login/Logo.png";
import "./login.css";
import { Bounce, ToastContainer } from "react-toastify";



const Login = () => {
    if (localStorage.getItem("act")) {
        return <Navigate to="/" replace />
    } else {
        const loginWithGoogle = () => {
            window.open(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/google`, "_self");
        }
        const loginWithFacebook = () => {
            window.open(`${import.meta.env.VITE_REACT_APP_API_URL}/auth/facebook`, "_self");
        }
        return (
            <div className="login">
                <div className="form-login p-4 rounded shadow d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-center mb-5">
                        <img src={Logo} alt="logo" className="logo" />
                    </div>
                    <h5 className="text-center mb-2">Welcome Back !</h5>
                    <p className="mb-4 text-center">Sign in to continue to your digital library</p>
                    <button className="rounded-pill btn-icon p-2 gap-2" onClick={loginWithGoogle}>
                        <div className="icon">
                            <img src={GoogleLogo} alt="google-button" />
                        </div>
                        <span>Sign in with google</span>
                    </button>
                    <p className="text-center my-2">Or</p>
                    <button className="rounded-pill btn-icon p-2 gap-2" onClick={loginWithFacebook}>
                        <div className="icon">
                            <img src={FacebookLogo} alt="google-button" />
                        </div>
                        <span>Sign in with Facebook</span>
                    </button>
                    <div className="mb-3 d-flex align-items-center justify-content-end mt-2">
                        <Link to="/forgot-password" className="text-gray">Forgot Password</Link>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <span className="text-gray">Don't have an account?</span>
                        <Link to="/register" className="ms-1 text-gray fw-semibold">Register</Link>
                    </div>
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={500}
                    hideProgressBar
                    newestOnTop
                    rtl={false}
                    draggable
                    transition={Bounce}
                />
            </div>
        )
    }
}

export default Login
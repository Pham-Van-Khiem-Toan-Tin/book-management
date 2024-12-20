
import { Outlet, useLocation } from 'react-router'
import './App.css'
import Sidebar from './layout/sidebar/Sidebar'
import Header from './layout/header/Header'
import { Bounce, ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useAppDispatch } from './hooks/reduxhooks';
import { baseProfile } from './apis/actions/auth.action';

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("act");
    if(accessToken) {
      dispatch(baseProfile());
    }
  }, [location.pathname, dispatch])
  

  return (
    <>
      <div className='app d-flex w-100 g-0'>
        <div className='left'>
          <Sidebar />
        </div>
        <div className='right'>
          <Header />
          <div className='outlet-container mt-0 p-4'>
            <Outlet />
          </div>
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
    </>
  )
}

export default App

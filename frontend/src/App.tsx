
import { Outlet } from 'react-router'
import './App.css'
import Sidebar from './layout/sidebar/Sidebar'
import Header from './layout/header/Header'
import { useEffect } from 'react'
import axios from 'axios'

function App() {
  useEffect( () => {
    axios.get("http://localhost:8000/auth/login/success", {withCredentials: true}).then((response) => {
      console.log(response.data);
    });
    
  
    
  }, [])
  

  return (
    <>
      <Sidebar />
      <Header />
      <div className='outlet-container'>
        <Outlet />
      </div>
    </>
  )
}

export default App

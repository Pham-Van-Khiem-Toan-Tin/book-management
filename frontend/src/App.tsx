
import { Outlet } from 'react-router'
import './App.css'
import Sidebar from './layout/sidebar/Sidebar'
import Header from './layout/header/Header'

function App() {


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

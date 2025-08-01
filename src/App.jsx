import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layout/MainLayout'
import Overview from './pages/user/Overview'
import Network from './pages/user/Network'
import Transactions from './pages/user/Transactions'
import Digital from './pages/user/Digital'
import Register from './pages/user/Register'
import RechargeHistory from './pages/user/RechargeHistory'
import Profile from './pages/user/Profile'

function App() {
  
  return (
    <>
      <Routes>
        <Route path='/user/overview' element={<MainLayout pageName={"Good Morning, DORCAS ODEKUNLE"} subText={"Here’s your dashboard overview"} child={<Overview />} />}/>
        <Route path='/user/network' element={<MainLayout pageName={"Networks"} child={<Network />} />}/>
        <Route path='/user/transactions' element={<MainLayout pageName={"Transactions"} child={<Transactions />} />}/>
        <Route path='/user/digtal' element={<MainLayout pageName={"Digital"} child={<Digital />} />}/>
        <Route path='/user/register' element={<MainLayout pageName={"Register"} child={<Register />} />}/>
        <Route path='/user/rechargehistory' element={<MainLayout pageName={"Recharge History"} child={<RechargeHistory />} />}/>
        <Route path='/user/profile' element={<MainLayout pageName={"Profile"} child={<Profile />} />}/>
      </Routes>
    </>
  )
}

export default App

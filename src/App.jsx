import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Toaster } from "sonner";
import MainLayout from './layout/MainLayout'
import Overview from './pages/user/Overview'
import Network from './pages/user/Network'
import Transactions from './pages/user/Transactions'
import Digital from './pages/user/Digital'
import Register from './pages/user/Register'
import RechargeHistory from './pages/user/RechargeHistory'
import Profile from './pages/user/Profile'
import Products from './pages/user/Products'
import ManageAnnouncement from './pages/admin/ManageAnnouncement'
import Login from './pages/auth/Login';
import Cart from './pages/user/Cart';
import { useUser } from './context/UserContext';
import Withdraw from './pages/user/Withdraw';
import Deposit from './pages/user/Deposit';
import Transfer from './pages/user/Transfer';
import AllUsers from './pages/admin/users/AllUsers';
import ManagePackage from './pages/admin/ManagePackage';
import ManageContactRequests from './pages/admin/ManageContactRequests';
import ProductUpload from './pages/admin/ProductUpload';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageTransactions from './pages/admin/ManageTransactions';
import Stockist from './pages/stockist/Stockist';
import AuthRedirect from './pages/auth/AuthRedirect';
import ManageLoyalties from './pages/admin/ManageLoyalties';
import AdminOverview from './pages/admin/AdminOverview';
import UpgradePackage from './pages/user/UpgradePackage';
import Ranking from './pages/admin/Ranking';

function App() {

  const { user } = useUser()
  
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/auth-redirect' element={<AuthRedirect />} />

        <Route path='/user/overview' element={<MainLayout pageName={`Good Day, ${user?.first_name} ${user?.last_name}`} subText={"Here’s your dashboard overview"} child={<Overview />} />}/>
        <Route path='/user/network' element={<MainLayout pageName={"Networks"} child={<Network />} />}/>
        <Route path='/user/transactions' element={<MainLayout pageName={"Transactions"} child={<Transactions />} />}/>
        <Route path='/user/deposit' element={<MainLayout pageName={"Deposit"} child={<Deposit />} />}/>
        <Route path='/user/withdraw' element={<MainLayout pageName={"Withdraw"} child={<Withdraw />} />}/>
        <Route path='/user/transfer' element={<MainLayout pageName={"Transfer"} child={<Transfer />} />}/>
        <Route path='/user/recharge' element={<MainLayout pageName={"Digital"} child={<Digital />} />}/>
        <Route path='/user/register' element={<MainLayout pageName={"Register"} child={<Register />} />}/>
        <Route path='/user/rechargehistory' element={<MainLayout pageName={"Recharge History"} child={<RechargeHistory />} />}/>
        <Route path='/user/profile' element={<MainLayout pageName={"Profile"} child={<Profile />} />}/>
        <Route path='/user/upgrade' element={<MainLayout pageName={"Upgrade"} child={<UpgradePackage />} />}/>
        <Route path='/user/products' element={<MainLayout pageName={"Products"} child={<Products />} />}/>
        <Route path='/user/products/cart' element={<MainLayout pageName={"Cart"} child={<Cart />} />}/>

        <Route path='/stockist/managestockist' element={<MainLayout pageName={"Stockist"} child={<Stockist />} />}/>

        <Route path='/admin/overview' element={<MainLayout pageName={`Good Day, ${user?.first_name} ${user?.last_name}`} subText={"Here’s your dashboard overview"} child={<AdminOverview />} />}/>
        <Route path='/admin/manageannouncement' element={<MainLayout pageName={"Manage Announcement"} child={<ManageAnnouncement />} />}/>
        <Route path='/admin/managetestimonials' element={<MainLayout pageName={"Create Testimonials"} child={<ManageTestimonials />} />}/>
        <Route path='/admin/managetransactions' element={<MainLayout pageName={"Transactions"} child={<ManageTransactions />} />}/>
        <Route path='/admin/uploadproduct' element={<MainLayout pageName={"Upload Products"} child={<ProductUpload />} />}/>
        <Route path='/admin/managecontacts' element={<MainLayout pageName={"Manage Contacts"} child={<ManageContactRequests />} />}/>
        <Route path='/admin/managepackages' element={<MainLayout pageName={"Create New Package"} child={<ManagePackage />} />}/>
        <Route path='/admin/allusers' element={<MainLayout pageName={"Users"} child={<AllUsers />} />}/>
        <Route path='/admin/loyaltybonus' element={<MainLayout pageName={"Loyalty Bonus"} child={<ManageLoyalties />} />}/>
        <Route path='/admin/ranking' element={<MainLayout pageName={"Ranking"} child={<Ranking />} />}/>
      </Routes>
    </>
  )
}

export default App

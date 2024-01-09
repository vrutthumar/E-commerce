import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Tshirts from './Components/Users/SubUserComp/tshirt';
import { Authorization } from './Components/Main';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Index from './Components/Users/SubUserComp/Index';
import Stickers from './Components/Users/SubUserComp/stickers';
import Hoodies from './Components/Users/SubUserComp/hoodies';
import Mugs from './Components/Users/SubUserComp/mugs';
import { Toaster } from 'react-hot-toast';
import AdminProfile from './Components/Admins/SubAdminComp/AdminProfile';
import UserProfile from './Components/Users/SubUserComp/UserProfile';
import { createContext , useState } from 'react';
import Product from './Components/Admins/SubAdminComp/Product';
import ForgotPassword from './Components/ForgotPassword';
import AllProducts from './Components/Users/SubUserComp/AllProducts';
import User from './Components/Admins/SubAdminComp/User';
import BuyProduct from './Components/Admins/SubAdminComp/BuyProduct';
import Cart from './Components/Users/Cart';


export let Context = createContext()

function App() {
  const [role, setRole] = useState(JSON.parse(localStorage.getItem("role")))
  const [login, setLogin] = useState(JSON.parse(localStorage.getItem("isLogin")))
  
  return (
    <>
      <Toaster />
      <Context.Provider value={{ role, setRole, login, setLogin }}>
          <Routes>
            {
              login == true
                ?
                <>
                  {
                    role == "Admin"
                      ?
                      <>
                        <Route path='/' element={<Navigate to="/adminprofile" />} />
                        <Route path='/adminprofile' element={<AdminProfile />} />
                        <Route path='/product' element={<Product />} />
                        <Route path='/users' element={<User />} />
                        <Route path='/buyproducts' element={<BuyProduct />} />
                      </>
                      :
                      <>
                        <Route path='/' element={<Navigate to="/userPage" />} />

                        <Route path='/userPage' element={<Index />} />
                        <Route path='/userProfile' element={<UserProfile />} />
                        <Route path='/allproducts' element={<AllProducts />} />
                        <Route path='/tshirt' element={<Tshirts />} />
                        <Route path='/hoodies' element={<Hoodies />} />
                        <Route path='/stickers' element={<Stickers />} />
                        <Route path='/mugs' element={<Mugs />} />
                        <Route path='/cart' element={<Cart />} />

                      </>

                  }

                </>
                :
                <>
                  <Route path='/' element={<Navigate to="/auth" />} />
                  <Route path='/auth' element={<Authorization />} />
                  <Route path='/forgotpassword' element={<ForgotPassword />} />
                </>
            }
            <Route path='*' element={<Navigate to="/" />} />

          </Routes>
        

      </Context.Provider>
    </>
  );
}

export default App;

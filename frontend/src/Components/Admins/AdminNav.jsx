import React from 'react'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsPersonCircle } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <div className='flex flex-col md:flex-row  justify-center md:justify-start items-center py-2 shadow-md'>
      <div className="logo mx-5">
        <img src="/logo.png" alt="" width={250} />
      </div>
      <div className="nav">
        <ul className='flex items-center space-x-6 font-bold md:text-md mb-0 '>
          <NavLink to='/product' className="text-decoration-none fs-5 text-black fw-bold"><li>Product</li></NavLink>
          <NavLink to='/users' className="text-decoration-none fs-5 text-black fw-bold"><li>Users</li></NavLink>
          <NavLink to='/buyproducts' className="text-decoration-none fs-5 text-black fw-bold"><li>Buy Product List</li></NavLink>
          <NavLink to='/walletInfo' className="text-decoration-none fs-5 text-black fw-bold"><li>Wallet Info</li></NavLink>
        </ul>
      </div>
      <div className="cart absolute right-0 mx-5 top-4 cursor-pointer d-flex align-items-center space-x-5" >

        <NavLink to='/adminprofile' className="text-decoration-none fs-5 text-black fw-bold d-flex align-items-center space-x-2"><BsPersonCircle size={40} color="#245ced" /><span>Profile</span></NavLink>
      </div>


    </div>
  )
}

export default AdminNavbar
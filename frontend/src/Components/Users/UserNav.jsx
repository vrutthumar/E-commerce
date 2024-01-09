import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Badge } from 'react-bootstrap';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsPersonCircle } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
export let getUserCart;
const UserNavbar = () => {
  const [products, setproducts] = useState(0)
  const token = JSON.parse(localStorage.getItem("token"))
    let auth = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
   getUserCart = () => {
    axios.get(`http://localhost:4000/codeswear/user/getusercart/${JSON.parse(localStorage.getItem("loginId"))}`, auth).then(res => {
      if (res.data.success) {
        setproducts([...res.data.data].length)
      }
    })
  }

  useEffect(() => {
    getUserCart()
  }, [])
  

  
  return (
    <div className='flex flex-col md:flex-row  justify-center md:justify-start items-center py-2 shadow-md'>
      <NavLink to='/'>
        <div className="logo mx-5">
          <img src="/logo.png" alt="" width={250} />
        </div>
      </NavLink>
      <div className="nav">
        <ul className='flex items-center space-x-6 font-bold md:text-md mb-0 '>
          <NavLink to='/allProducts' className="text-decoration-none fs-5 text-black fw-bold"><li>All Products</li></NavLink>
          <NavLink to='/tshirt' className="text-decoration-none fs-5 text-black fw-bold"><li>Tshirts</li></NavLink>
          <NavLink to='/hoodies' className="text-decoration-none fs-5 text-black fw-bold"><li>Hoodies</li></NavLink>
          <NavLink to='/stickers' className="text-decoration-none fs-5 text-black fw-bold"><li>Stickers</li></NavLink>
          <NavLink to='/mugs' className="text-decoration-none fs-5 text-black fw-bold"><li>Mugs</li></NavLink>
        </ul>
      </div>
      <div className="cart absolute right-0 mx-5 top-4 cursor-pointer flex items-center space-x-5">
        <NavLink to='/userprofile' className="text-decoration-none fs-5 text-black fw-bold d-flex align-items-center space-x-2"><BsPersonCircle size={40} color="#245ced" /><span>Profile</span></NavLink>
        <NavLink to='/cart'><button><Badge className='absolute top-0 -translate-y-2 translate-x-2'>{products}</Badge><AiOutlineShoppingCart className='text-4xl ' /></button></NavLink>
      </div>


    </div>
  )
}
export default UserNavbar
import React, { useContext, useEffect, useState } from 'react'
import Signup from './signup'
import { NavLink } from 'react-router-dom';
import Login from './login';
import Swal from 'sweetalert2';
import { Context } from '../App';


export const Authorization = () => {
    let role = useContext(Context)
    // let [role, setrole] = useState('')
    const tabView = (index) => {

        let tab = document.querySelectorAll(".tab")
        let tabBtn = document.querySelectorAll(".tabBtn")
        tab.forEach((x, i) => {
            x.classList.add("d-none");
            tabBtn[i].classList.remove("active-tab");
        })
        tab[index].classList.remove("d-none");
        tabBtn[index].classList.add("active-tab");
    }
    const roleSelect = async () => {
        Swal.fire({
            title: "Tell Us Your Role",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Admin",
            cancelButtonText: "User",
            allowEscapeKey : false,
            allowOutsideClick : false
          }).then((result) => {
            if (result.isConfirmed) {
                role.setRole("Admin")
                localStorage.setItem("role",JSON.stringify("Admin"))
                
            }
            else{
                role.setRole("User")
                localStorage.setItem("role",JSON.stringify("User"))
                
            }
          })
    }
    useEffect(()  => {
        roleSelect()
    }, [])
    
    
     
    return (
        <>
            <div className='d-flex justify-content-center'>
                <img src="/logo.png" alt="" width={500} />
            </div>
            <div className='d-flex  gap-3 align-self-center p-3 justify-content-between'>
                <button className={`cursor-pointer primary-btn tabBtn  px-5 py-2 rounded w-100 ${role.role == "User" ? "" : "active-tab"} `} onClick={(e) => { tabView(0) }} disabled = {role.role == "User"}>Signup</button>
                <button className={`cursor-pointer primary-btn tabBtn  px-5 py-2 rounded w-100 ${role.role == "User" ? "active-tab" : ""} `} onClick={(e) => { tabView(1) }}>Login</button>
            </div>
            <div className={`tab ${role.role == "User" ? "d-none" : "d-block"}`} >
                <Signup role = {role.role}/>
            </div>
            <div className={`tab ${role.role == "User" ? "d-block" : "d-none"}`}>
                <Login  role = {role.role} />
            </div>
        </>
    )
}

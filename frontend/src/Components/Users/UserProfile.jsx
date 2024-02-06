import React, { useContext, useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { BsPersonCircle } from "react-icons/bs"
import Swal from 'sweetalert2'
import { MainUser } from './MainUser'
import { Context } from '../../App'
import toast from 'react-hot-toast'
import Loading from '../Loading'
import { getApiResource, postApiData } from './axiosUserClient'


const UserProfile = () => {
    const [loading, setloading] = useState(true)

    let islogin = useContext(Context)

    let [updateProfileObj, setupdateProfileObj] = useState({ fullName: "", email: "", mobileNumber: "", roleId: "", userRole: [], profileImageBase64: "" })

    let [updatePasswordObj, setupdatePasswordObj] = useState({})
    let [blankobj, setblankobj] = useState({})
    let [profileObj, setprofileObj] = useState({})
    const token = JSON.parse(localStorage.getItem("token"))
    let auth = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }


    let updatePassword = (e) => {

        updatePasswordObj[e.target.name] = e.target.value;
        setupdatePasswordObj({ ...updatePasswordObj })

    }
    const savePassword = async (e) => {
        e.preventDefault();
        updatePasswordObj['email'] = profileObj.email
        setupdatePasswordObj({ ...updatePasswordObj })
        const res = await postApiData(`/updateuserpassword/${JSON.parse(localStorage.getItem("loginId"))}`, updatePasswordObj)
        if (res.success) {
            e.target.reset();
            toast.success(res.message)
        }
        else {
            toast.error(res.message)

        }

    }
    useEffect(() => {
        profile();
    }, [])


    const profile = async () => {
        const res = await getApiResource(`/getuser/${JSON.parse(localStorage.getItem("loginId"))}`, auth)
        console.log(res)
        if (res.success) {

            setprofileObj({ ...res.data })
            setupdateProfileObj({ ...res.data })
            setloading(false)
        }
    }
    let updateProfile = async (e) => {

        updateProfileObj[e.target.name] = e.target.value
        setupdateProfileObj({ ...updateProfileObj })

    }


    const update = async () => {
        const res = await postApiData(`/updateprofile/${JSON.parse(localStorage.getItem("loginId"))}`, updateProfileObj)
        if (res.data.success) {
            toast.success(res.data.message)
            profile();
        }
        else {
            toast.error(res.data.message)

        }

    }

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

    const logoutAccount = () => {

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-outline-success me-2',
                cancelButton: 'btn btn-outline-danger'
            },
            buttonsStyling: false
        })


        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Log Out',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Logged Out Successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
                localStorage.setItem('isLogin', false)
                islogin.setLogin(false)
            }

        })


    }
    return (
        <>
            {
                loading ? (<Loading />) :
                    (
                        <section className='w-100 mx-auto px-5 py-4 gap-5'>
                            <div className='d-flex  gap-3 align-self-center'>
                                <button className=' primary-btn tabBtn px-5 py-2 rounded w-100 active-tab ' onClick={(e) => { tabView(0) }}>My Profile</button>
                                <button className=' primary-btn tabBtn px-5 py-2 rounded w-100 ms-auto' onClick={(e) => { tabView(1) }}>Update Profile</button>
                                <button className=' primary-btn tabBtn px-5 py-2 rounded w-100 ' onClick={(e) => { tabView(2) }}>Change Password</button>
                            </div>
                            <div className='position-relative'>
                                <div className="tab d-flex align-items-center p-5 ">
                                    <div className='w-25 d-flex justify-content-center flex-column align-items-center'>
                                        <BsPersonCircle size={100} color="#245ced" />
                                        <p className='h3 mt-3'>{profileObj.username}</p>
                                        <p className='h6'>{profileObj.role}</p>
                                    </div>
                                    <div className='w-75'>
                                        <div className=' rounded-4 overflow-hidden'>
                                            <table className='table mb-0 profile-table '>
                                                <tr>
                                                    <td className='d-flex justify-content-between'><span className='text-white border-0 bg-transparent'>Full Name</span><span className='text-white border-0 bg-transparent'>:</span></td>
                                                    <td className='text-white border-0'>{profileObj.username}</td>
                                                </tr>
                                                <tr>
                                                    <td className='d-flex justify-content-between'><span className='text-white border-0 bg-transparent'>Email</span><span className='text-white border-0 bg-transparent'>:</span></td>
                                                    <td className='text-white border-0'>{profileObj.email}</td>
                                                </tr>
                                                <tr>
                                                    <td className='d-flex justify-content-between'><span className='text-white border-0 bg-transparent'>Contact</span><span className='text-white border-0 bg-transparent'>:</span></td>
                                                    <td className='text-white border-0'>{profileObj.mobile}</td>
                                                </tr>
                                                <tr>
                                                    <td className='d-flex justify-content-between'><span className='text-white border-0 bg-transparent'>Role</span><span className='text-white border-0 bg-transparent'>:</span></td>
                                                    <td className='text-white border-0'>{profileObj.role}</td>
                                                </tr>
                                                <tr>
                                                    <td className='d-flex justify-content-between'><span className='text-white border-0 bg-transparent'>Refral Code</span><span className='text-white border-0 bg-transparent'>:</span></td>
                                                    <td className='text-white border-0 fw-bold'>{profileObj.refralCode}</td>
                                                </tr>

                                                <tr>
                                                    <td className='d-flex justify-content-between'><span className='text-white border-0 bg-transparent'>Status</span><span className='text-white border-0 bg-transparent'>:</span></td>
                                                    <td className='text-white border-0'>Active</td>
                                                </tr>

                                            </table>
                                            <div className='mt-2 text-end'>
                                                <button className='primary-btn' onClick={logoutAccount}>Log  Out</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab  d-none   ">
                                    <Form className=' py-3 '>
                                        <Form.Label className='fw-bold '>Full Name</Form.Label>
                                        <Form.Control type="text" name='username' className='bg-transparent border ' onChange={updateProfile} value={updateProfileObj.username ?? ""} />

                                        <Form.Label className='fw-bold  mt-3'>Email</Form.Label>
                                        <Form.Control type="email" name='email' className='bg-transparent border ' onChange={updateProfile} value={updateProfileObj.email ?? ""} />



                                        <Form.Label className='d-block fw-bold  mt-3'>Mobile No</Form.Label>
                                        <Form.Control type="tel" name='mobile' className='bg-transparent border ' onChange={updateProfile} value={updateProfileObj.mobile ?? ""} />

                                        <button className='primary-btn  w-100 rounded mt-4' type='button' onClick={update}>Update Profile</button>
                                    </Form>
                                </div>
                                <div className="tab  d-none  ">
                                    <Form className=' px-3 mt-3' onSubmit={savePassword}>
                                        <legend className='h3  text-center'>Update Password</legend>

                                        <Form.Label className='fw-bold  mt-3'>Current Password</Form.Label>
                                        <Form.Control type="text" name='oldpassword' className='bg-transparent border' onChange={updatePassword} />

                                        <Form.Label className='d-block fw-bold  mt-3'>New Password</Form.Label>
                                        <Form.Control type="password" name='password' className='bg-transparent border' onChange={updatePassword} />
                                        <Form.Label className='d-block fw-bold  mt-3'>Confirm Password</Form.Label>
                                        <Form.Control type="password" name='cpassword' className='bg-transparent border' onChange={updatePassword} />



                                        <button className='primary-btn mt-4 w-100 rounded' > Save Password</button>

                                    </Form>
                                </div>

                            </div>
                        </section>
                    )}

        </>
    )
}

export default MainUser(UserProfile)

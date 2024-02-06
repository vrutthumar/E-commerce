import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BsPersonCircle } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { RxCounterClockwiseClock } from "react-icons/rx";
import moment from 'moment';
import { FaWallet } from "react-icons/fa";
import axios from 'axios';

const AdminNavbar = () => {

  const [show, setShow] = useState(false);
  const [walletInfo, setwalletInfo] = useState({});
  const token = JSON.parse(localStorage.getItem("token"))
  let auth = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }


  const getWalletInfo = () => {
    axios.get(`http://localhost:4000/codeswear/admin/userWalletInfo/${JSON.parse(localStorage.getItem("loginId"))}`, auth).then(res => {
      if (res.data.success) {

        setwalletInfo({ ...res.data.data })
      }
    })
  }

  useEffect(() => {
    getWalletInfo()
  }, [])

  const handleClose = () => {
    setShow(false)

  };
  const handleShow = () => {
    setShow(true)
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} scrollable size='lg'>
        <Modal.Header closeButton>
          <h2><RxCounterClockwiseClock className='d-inline-block' /> Transaction</h2>
        </Modal.Header>
        <Modal.Body>
          <div className='mx-auto' style={{ width: "90%" }}>
            {
              walletInfo.transactions == undefined
                ?
                <>
                  <div className='text-center w-100'>
                    <h5 className='flex items-center justify-center text-dark' >No transactions Found<img src="https://cdni.iconscout.com/illustration/premium/thumb/no-transaction-7359562-6024630.png" alt="" style={{ height: "100px", width: "100px" }} /></h5>
                  </div>
                </>
                :
                <>
                  {
                    walletInfo.transactions?.map((x) => {
                      return <div className="py-4 d-flex align-items-center justify-content-between">
                        <div className='d-flex align-items-center'>
                          <div className='me-2'>
                            {
                              x.type == "Credited" ? <FaArrowCircleRight color='green' size={30} /> : <FaArrowCircleLeft color='red' size={30} />
                            }
                          </div>
                          <div>
                            <p className='fw-bold'>{x.type}</p>
                            <p>{x.message}</p>
                          </div>
                        </div>
                        <div className='text-center'>
                          <p className='fw-bold' style={{ color: "#245ced" }}>₹ {x.amount}</p>
                          <p>{moment(x.time).format('MMMM Do YYYY, h:mm:ss a')}</p>
                        </div>
                      </div>
                    })
                  }
                  <div className='d-flex align-items-center justify-content-between'>
                    <h5>Total Amount</h5>
                    <h5>₹ {walletInfo.walletAmount ?? 0}</h5>
                  </div>
                </>
            }
          </div>


        </Modal.Body>
      </Modal >
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
          <button onClick={handleShow}><FaWallet className='text-3xl' color="#245ced" /></button>
        </div>


      </div>
    </>
  )
}

export default AdminNavbar
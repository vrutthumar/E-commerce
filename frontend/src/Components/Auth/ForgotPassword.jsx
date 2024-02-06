import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { Context } from '../../App'
import { json, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const [forgotPasswordObj, setforgotPasswordObj] = useState({})
  const [verifyEmailObj, setverifyEmailObj] = useState({})
  const [error, seterror] = useState('')
  let [otp, setotp] = useState({})
  const [readOnly, setreadOnly] = useState(false)
  const navigate = useNavigate()
  const role = useContext(Context)
  const token = JSON.parse(localStorage.getItem("token"))
  let auth = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }


  const forgotPasswordData = (e) => {
    if (e.target.type == "password" && e.target.name == "cpassword") {

      if (e.target.value == forgotPasswordObj['password']) {

        forgotPasswordObj['password'] = e.target.value
        seterror('')
      }
      else {
        seterror("Confirm Password And password should match")
      }
    }

    forgotPasswordObj[e.target.name] = e.target.value
    setforgotPasswordObj({ ...forgotPasswordObj })
  }

  const verifyEmailData = (e) => {
    verifyEmailObj[e.target.name] = e.target.value
    setverifyEmailObj({ ...verifyEmailObj })
  }

  const otpData = (e) => {
    otp[e.target.name] = Number(e.target.value)
    setotp({ ...otp })

  }

  const display = () => {
    document.querySelector(".newPassword").classList.toggle("d-none")
    document.querySelector(".verifyEmail").classList.toggle("d-none")
  }

  const enterOtp = () => {

    document.querySelector(".otpVerify").classList.toggle("d-none")
    document.querySelector(".email-btn").classList.toggle("d-none")
    setreadOnly(!readOnly)
  }

  const otpVerify = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:4000/codeswear/auth/otpverify`, otp, auth).then(response => {
      if (response.data.status) {
        display()
        toast.success(response.data.message)
      }
      else {
        e.target.reset();
        enterOtp();
        toast.error(response.data.message)

      }
    })
  }

  const forgotPassword = (e) => {
    e.preventDefault();
    if (error == '') {
      axios.post(`http://localhost:4000/codeswear/auth/forgotpassword`, forgotPasswordObj, auth).then(response => {
        if (response.data.success) {
          e.target.reset()
          navigate('/')
          toast.success(response.data.message)
        }
        else {
          toast.error(response.data.message)

        }
      })
    }
  }

  const verifyEmail = (e) => {
    e.preventDefault();
    verifyEmailObj['role'] = role.role
    setverifyEmailObj({ ...verifyEmailObj })
    axios.post("http://localhost:4000/codeswear/auth/emailverify", verifyEmailObj).then(response => {

      if (response.data.status) {
        enterOtp();
        localStorage.setItem('token', JSON.stringify(response.data.token))
        toast.success(response.data.message)
      }
      else {
        toast.error(response.data.message)

      }
    })
  }

  return (
    <div className="forgotPassword p-3">
      <div className='d-flex justify-content-center'>
        <img src="/logo.png" alt="" width={500} />
      </div>
      <legend className='fw-bold'>Forgot Password</legend>

      <div className='verifyEmail'>

        <Form onSubmit={verifyEmail}>
          <Form.Label className='fw-bold mt-2'>Email</Form.Label>
          <Form.Control type="email" name="email" onChange={verifyEmailData} readOnly={readOnly} />
          <button className='primary-btn mt-3 email-btn' type='dubmit'>Verify Email</button>
        </Form>

        <Form className='otpVerify d-none' onSubmit={otpVerify}>
          <Form.Label className='fw-bold mt-2'>Enter OTP</Form.Label>
          <Form.Control type="text" name="otp" onChange={otpData} />
          <button className='primary-btn mt-3' type='submit'>Verify OTP</button>
        </Form>

      </div>

      <Form className='newPassword d-none' onSubmit={forgotPassword}>
        <Form.Label className='fw-bold mt-2'>New Password</Form.Label>
        <Form.Control type="password" name="password" onChange={forgotPasswordData} />
        <Form.Label className='fw-bold mt-2'>Confirm Password</Form.Label>
        <Form.Control type="password" name="cpassword" onChange={forgotPasswordData} />
        <p className='text-danger mt-1'>{error}</p>
        <button className='primary-btn mt-3' type='submit'>Save Password</button>
      </Form>

    </div>

  )
}

export default ForgotPassword
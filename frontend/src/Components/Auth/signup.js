import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import axios from 'axios'
import toast from 'react-hot-toast';
import { Context } from '../../App';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const [signUpObj, setsignUpObj] = useState({})
  const [error, seterror] = useState('')
  let role = useContext(Context)
  const navigate = useNavigate()
  const signUpData = (e) => {
    if (e.target.type == "password" && e.target.name == "cpassword") {

      if (e.target.value == signUpObj['password']) {
        signUpObj[e.target.name] = e.target.value

        seterror('')
      }
      else {
        seterror("Confirm Password And password should match")
      }
    }
    else {
      signUpObj[e.target.name] = e.target.value
    }
    setsignUpObj({ ...signUpObj })
  }


  const signUp = (e) => {
    signUpObj['role'] = role.role
    e.preventDefault()
    if (error == '') {
      axios.post("http://localhost:4000/codeswear/auth/signup", signUpObj).then(response => {
        if (response.data.success) {
          e.target.reset()
          toast.success(response.data.message)
          localStorage.setItem('isLogin', true)
          localStorage.setItem('token', JSON.stringify(response.data.token))
          localStorage.setItem('loginId', JSON.stringify(response.data.data.Id))
          role.setLogin(true)
          role.role == "Admin" ? navigate('/adminprofile') : navigate("/userpage")
        } else {

          toast.error(response.data.message)
        }
      })
    }

  }

  return (
    <>
      <Form onSubmit={signUp} className="signUp p-3">
        <legend className='fw-bold'>Sign Up</legend>
        <Form.Label className='fw-bold mt-2'>User Name</Form.Label>
        <Form.Control type="text" name="username" onChange={signUpData} />
        <Form.Label className='fw-bold mt-2'>Email</Form.Label>
        <Form.Control type="email" name="email" onChange={signUpData} />
        <Form.Label className='fw-bold mt-2'>Password</Form.Label>
        <Form.Control type="password" name="password" onChange={signUpData} />
        <Form.Label className='fw-bold mt-2'>Confirm Password</Form.Label>
        <Form.Control type="password" name="cpassword" onChange={signUpData} />
        <p className='text-danger mt-1'>{error}</p>
        <Form.Label className='fw-bold mt-2'>Mobile</Form.Label>
        <Form.Control type="text" name="mobile" onChange={signUpData} />
        {
          role.role == "User"
            ?
            <>
              <Form.Label className='fw-bold mt-2'>Referal Code</Form.Label>
              <Form.Control type="text" name="refPerson" onChange={signUpData} />
            </>
            :
            <></>
        }


        <button className='primary-btn mt-3' type='submit'>Sign Up</button>
      </Form>

    </>
  )
}

export default Signup
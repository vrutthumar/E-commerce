import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import axios from 'axios'
import toast from 'react-hot-toast';
import { NavLink, useNavigate } from 'react-router-dom';
import { Context } from '../../App';


const Login = (props) => {
    const navigate = useNavigate()
    let islogin = useContext(Context)
    const [loginObj, setloginObj] = useState({})

    const loginData = (e) => {
        loginObj[e.target.name] = e.target.value
        setloginObj({ ...loginObj })
    }

    console.log(props.role)
    const login = (e) => {
        loginObj['role'] = props.role
        setloginObj({ ...loginObj })
        e.preventDefault();
        axios.post(`http://localhost:4000/codeswear/auth/login`, loginObj).then(response => {
            if (response.data.success) {
                e.target.reset()
                toast.success(response.data.message)
                localStorage.setItem('isLogin', true)
                localStorage.setItem('token', JSON.stringify(response.data.token))
                localStorage.setItem('loginId', JSON.stringify(response.data.data.Id))
                islogin.setLogin(true)
                props.role == "Admin" ? navigate('/adminprofile') : navigate("/userpage")
            }
            else {

                toast.error(response.data.message)
            }
        })
    }

    return (
        <Form className="login p-3" onSubmit={login} >
            <legend className='fw-bold'>Login</legend>
            <Form.Label className='fw-bold mt-2'>Email</Form.Label>
            <Form.Control type="email" name="email" onChange={loginData} />
            <Form.Label className='fw-bold mt-2'>Password</Form.Label>
            <Form.Control type="password" name="password" onChange={loginData} />
            <div className='flex items-center justify-between'>
                <button className='primary-btn mt-3' type='submit'>Login</button>
                <NavLink to='/forgotpassword'>Forgot Password</NavLink>

            </div>

        </Form>
    )
}

export default Login
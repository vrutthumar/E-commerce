import React, { useEffect, useState } from 'react'
import { Form, Modal, Table } from 'react-bootstrap'
import { MainAdmin } from '../MainAdmin';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Loading from '../../Loading';

const User = () => {
    const [loading, setloading] = useState(true)

    const [show, setShow] = useState(false);
    const [img, setImg] = useState('');
    const [error, seterror] = useState('')
    const [blank, setbalnk] = useState({})
    let [userObj, setuserObj] = useState({})
    let [allUser, setallUser] = useState([])

    const handleClose = () => {
        setuserObj({ ...blank })
        setShow(false)
    };

    const handleShow = () => setShow(true);

    const token = JSON.parse(localStorage.getItem("token"))

    let auth = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const save = () => {

        if (userObj.Id == undefined) {
            userObj['role'] = "User"
            setuserObj({ ...userObj })
            axios.post('http://localhost:4000/codeswear/admin/adduser', userObj, auth).then(res => {
                if (res.data.success) {
                    handleClose();
                    toast.success(res.data.message)
                    getAll();
                    setuserObj({ ...blank })
                }
                else {
                    toast.error(res.data.message)

                }
            })
        }
        else {

            axios.patch(`http://localhost:4000/codeswear/admin/updateuser/${userObj.Id}`, userObj, auth).then(res => {
                if (res.data.success) {
                    handleClose();
                    toast.success(res.data.message)
                    getAll();
                    setuserObj({ ...blank })
                }
                else {
                    toast.error(res.data.message)

                }
            })

        }
    }

    const getAll = () => {
        axios.get('http://localhost:4000/codeswear/admin/getalluser', auth).then(res => {
            if (res.data.success) {
                setallUser([...res.data.data])
                setloading(false)


            }

        })
    }

    const editUser = (id) => {
        handleShow()
        axios.get(`http://localhost:4000/codeswear/admin/getId/${id}`, auth).then(res => {
            if (res.data.success) {
                setuserObj({ ...res.data.data })


            }

        })
    }

    const deleteUser = (id) => {
        Swal.fire({
            title: "Are You Sure ??",
            icon: "warning",
            showCancelButton: true,

            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            allowEscapeKey: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:4000/codeswear/admin/deleteuser/${id}`, auth).then(res => {
                    if (res.data.success) {
                        toast.success(res.data.message)
                        getAll()

                    }

                })

            }
            else {


            }
        })

    }


    useEffect(() => {
        getAll();
    }, [])

    const userData = (e) => {
        if (e.target.type == "password" && e.target.name == "cpassword") {

            if (e.target.value == userObj['password']) {
                userObj[e.target.name] = e.target.value

                seterror('')
            }
            else {
                seterror("Confirm Password And password should match")
            }
        }
        else {
            userObj[e.target.name] = e.target.value
        }
        setuserObj({ ...userObj })
    }



    return (
        <>
            {
                loading ? (<Loading />) :
                    (
                        allUser.length == 0
                            ?
                            <>
                                <div className='text-center w-100 mt-5'>
                                    <h1 className='flex items-center justify-center text-dark' >No Users Found<img src="https://cdn2.iconfinder.com/data/icons/delivery-and-logistic/64/Not_found_the_recipient-no_found-person-user-search-searching-4-512.png" alt="" style={{ height: "200px", width: "200px" }} /></h1>
                                </div>
                            </>
                            :

                            <>
                                <div className='d-flex align-items-center justify-content-between px-5 py-3 '>
                                    <h3>All Users</h3>
                                    <button className='btn btn-outline-primary' onClick={handleShow}>
                                        Add Users
                                    </button>
                                </div>
                                <Modal show={show} onHide={handleClose} size='lg' scrollable>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Add Data</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>

                                        <Form.Label className='fw-bold mt-2'>User Name</Form.Label>
                                        <Form.Control type="text" name="username" onChange={userData} value={userObj.username ?? ""} />
                                        <Form.Label className='fw-bold mt-2'>Email</Form.Label>
                                        <Form.Control type="email" name="email" onChange={userData} value={userObj.email ?? ""} />
                                        {
                                            !userObj.Id &&
                                            <>
                                                <Form.Label className='fw-bold mt-2'>Password</Form.Label>
                                                <Form.Control type="password" name="password" onChange={userData} value={userObj.password ?? ""} />
                                                <Form.Label className='fw-bold mt-2'>Confirm Password</Form.Label>
                                                <Form.Control type="password" name="cpassword" onChange={userData} />
                                            </>
                                        }
                                        <p className='text-danger mt-1'>{error}</p>
                                        <Form.Label className='fw-bold mt-2'>Mobile</Form.Label>
                                        <Form.Control type="text" name="mobile" onChange={userData} value={userObj.mobile ?? ""} />



                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button className='btn btn-outline-primary' onClick={() => { save() }} type='button'>Save Changes</button>
                                    </Modal.Footer>
                                </Modal>
                                <div className="w-100 ">
                                    <Table className='border border-3 text-center recent-act w-100 mt-3'>
                                        <thead>
                                            <tr>
                                                <th className='border border-3 active-tab'>User Id</th>
                                                <th className='border border-3 active-tab'>User Name</th>
                                                <th className='border border-3 active-tab'>Email </th>
                                                <th className='border border-3 active-tab'>Mobile </th>
                                                <th className='border border-3 active-tab'>Action </th>


                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allUser?.map((x, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className='border border-3'>{x.Id}</td>
                                                            <td className='border border-3'>{x.username}</td>
                                                            <td className='border border-3'>{x.email}</td>
                                                            <td className='border border-3'>{x.mobile}</td>
                                                            <td className='border border-3'>
                                                                <div className="btn btn-outline-success me-2" onClick={(id) => editUser(x.Id)}>Edit</div>
                                                                <div className="btn btn-outline-danger" onClick={(id) => deleteUser(x.Id)}>Delete</div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                    )}

        </>
    )
}

export default MainAdmin(User)
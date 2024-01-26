import React, { useEffect, useState } from 'react'
import Loading from '../../Loading'
import axios from 'axios'
import { Modal, Table } from 'react-bootstrap'
import moment from 'moment'
import { MainAdmin } from '../MainAdmin'
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { RxCounterClockwiseClock } from "react-icons/rx";

const Wallet = () => {
    const [loading, setloading] = useState(true)
    const [walletInfo, setWalletInfo] = useState([])
    const [transactions, setTransactions] = useState([])
    const [show, setShow] = useState(false);

    const token = JSON.parse(localStorage.getItem("token"))
    let auth = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const getWalletInfo = () => {

        axios.get(`http://localhost:4000/codeswear/admin/walletInfo`, auth).then(res => {
            if (res.data.success) {
                setWalletInfo([...res.data.data])
                setloading(false)

            }

        })
    }
    useEffect(() => {
        getWalletInfo()
    }, [])

    const handleClose = () => {
        setShow(false)

    };
    const handleShow = (transaction) => {
        setShow(true)
        setTransactions([...transaction])

    };

    return (
        <>
            {
                loading ? (<Loading />) :
                    (

                        <>
                            <Modal show={show} onHide={handleClose} scrollable size='lg'>
                                <Modal.Header closeButton>
                                    <h2><RxCounterClockwiseClock className='d-inline-block' /> Transaction</h2>
                                </Modal.Header>
                                <Modal.Body >
                                    <div className='w-75 mx-auto'>
                                        {
                                            transactions.map((x) => {
                                                return <div className="py-2 d-flex align-items-center justify-content-between">
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
                                    </div>
                                </Modal.Body>
                            </Modal >
                            <div className='d-flex align-items-center justify-content-between px-5 py-3 '>
                                <h3>All Produucts</h3>

                            </div>
                            <div className="w-100 ">
                                <Table className='border border-3 text-center recent-act w-100 mt-3'>
                                    <thead>
                                        <tr>
                                            <th className='border border-3 active-tab'>User Id</th>
                                            <th className='border border-3 active-tab'>Transaction Info</th>
                                            <th className='border border-3 active-tab'>Wallet Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            walletInfo?.map((x, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td className='border border-3 fw-semibold'>{x.Id}</td>
                                                        <td className='border border-3'> <button className='btn btn-primary' onClick={(transaction) => handleShow(x.transactions)}>Show Transaction Details</button> </td>
                                                        <td className='border border-3 fw-semibold'>₹ {x.walletAmount}</td>
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

export default MainAdmin(Wallet)
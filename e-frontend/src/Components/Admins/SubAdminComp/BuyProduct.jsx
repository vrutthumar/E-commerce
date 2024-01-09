import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Modal, Table } from 'react-bootstrap'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { MainAdmin } from '../MainAdmin'
import Loading from '../../Loading'

const BuyProduct = () => {
    const [loading, setloading] = useState(true)

    const [buyProduct, setbuyProduct] = useState([])
    const [img, setImg] = useState('');
    const [showimg, setShowImg] = useState(false);

    const handleCloseimg = () => {
        setShowImg(false)
        setImg("")
    };
    const handleShowImg = (url) => {
        setShowImg(true)
        setImg(url)
    };
    const token = JSON.parse(localStorage.getItem("token"))
    let auth = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const getAll = () => {
        axios.get('http://localhost:4000/codeswear/admin/getallbuyproduct', auth).then(res => {
            console.log(res.data)
            if (res.data.success) {

                setbuyProduct([...res.data.data])
                setloading(false)


            }

        })
    }

    const deliver = (id) => {
        console.log(auth)
        Swal.fire({
            title: "Are You Sure??",
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
                axios.delete(`http://localhost:4000/codeswear/admin/deliverproduct/${id}`, auth).then(res => {
                    if (res.data.success) {
                        toast.success(res.data.message)
                        getAll()

                    }

                })

            }

        })

    }
    useEffect(() => {
        getAll()
    }, [])

    return (
        <>
            {
                loading ? (<Loading />) :
                    (
                        buyProduct.length == 0
                            ?
                            <>
                                <div className='text-center w-100 mt-5'>
                                    <h1 className='flex items-center justify-center text-dark' >Product List is Empty <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="" style={{ height: "200px", width: "200px" }} /></h1>
                                </div>
                            </>
                            :
                            <>
                                <Modal show={showimg} onHide={handleCloseimg} scrollable>
                                    <Modal.Header closeButton>
                                    </Modal.Header>
                                    <Modal.Body className='flex justify-center'>
                                        <img src={img} alt="" />
                                    </Modal.Body>

                                </Modal >
                                <div className='d-flex align-items-center justify-content-between px-5 py-3 '>
                                    <h3>All Produucts</h3>

                                </div>
                                <div className="w-100 ">
                                    <Table className='border border-3 text-center recent-act w-100 mt-3'>
                                        <thead>
                                            <tr>
                                                <th className='border border-3 active-tab'>Product Id</th>
                                                <th className='border border-3 active-tab'>Product</th>
                                                <th className='border border-3 active-tab'>Product Name</th>
                                                <th className='border border-3 active-tab'>User Id </th>
                                                <th className='border border-3 active-tab'>User Name </th>
                                                <th className='border border-3 active-tab'>Quantity </th>
                                                <th className='border border-3 active-tab'>Total </th>
                                                <th className='border border-3 active-tab'>Action </th>


                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                buyProduct?.map((x, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className='border border-3'>{x.productId}</td>
                                                            <td className='border border-3 flex justify-center cursor-pointer' onClick={(url) => handleShowImg(x.productUrl)}><img src={x.productUrl} alt="" style={{ height: "55px" }} /></td>
                                                            <td className='border border-3'>{x.productName}</td>
                                                            <td className='border border-3'>{x.Id}</td>
                                                            <td className='border border-3'>{x.userName}</td>
                                                            <td className='border border-3'>{x.quantity}</td>
                                                            <td className='border border-3'>₹ {x.total}</td>
                                                            <td className='border border-3'>
                                                                <div className="btn btn-outline-success" onClick={(id) => deliver(x.productId)}>Deliver The Product</div>
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

export default MainAdmin(BuyProduct)
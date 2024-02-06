import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { AiFillMinusCircle, AiFillPlusCircle } from 'react-icons/ai'
import { MainUser } from './MainUser'
import { NavLink } from 'react-router-dom'
import { getUserCart, getWalletInfo } from './UserNav'
import Loading from '../Loading'
import toast from 'react-hot-toast'
import { Modal } from 'react-bootstrap'
import { RiDeleteBin6Line } from "react-icons/ri";
import { getApiResource, postApiData } from './axiosUserClient'

const Cart = () => {
    const [loading, setloading] = useState(true)
    let [total, settotal] = useState(0)
    const [userCart, setuserCart] = useState([])


    const [quantity, setquantity] = useState({})



    const getUserCartDetails = async () => {
        const response = await getApiResource(`/getusercart/${JSON.parse(localStorage.getItem("loginId"))}`)

        if (response.success) {
            setuserCart([...response.data])
            getUserCart();
            getWalletInfo()
            setloading(false)

        }
    }
    useEffect(() => {
        settotal(total)
    }, [total])

    useEffect(() => {
        getUserCartDetails()

    }, [])

    const changeQuantity = async (n, id) => {
        quantity['userId'] = JSON.parse(localStorage.getItem("loginId"))
        quantity['productId'] = id
        quantity['quantity'] = n
        setquantity({ ...quantity })
        const response = await postApiData(`/updatecart`, quantity)
        if (response.success) {
            getUserCartDetails()
        }
    }
    const [buyProductObj, setbuyProductObj] = useState({})

    const placeOrder = async (quantity) => {
        buyProductObj['productId'] = product.productId
        buyProductObj["Id"] = JSON.parse(localStorage.getItem("loginId"))
        buyProductObj["quantity"] = quantity
        buyProductObj["orderType"] = "buy"
        setbuyProductObj({ ...buyProductObj })
        const response = await postApiData("/addproduct", buyProductObj)
        if (response.success) {
            handleCloseproduct();
            changeQuantity(-buyProductObj.quantity, product.productId)
            getUserCart();
            toast.success(response.message)
        }
        else {
            toast.error(response.message)
        }

    }

    const [product, setproduct] = useState({})

    const [showproduct, setshowproduct] = useState(false)

    const handleCloseproduct = () => {
        setshowproduct(false)
    };

    const handleShowProduct = (x) => {
        setshowproduct(true)
        setproduct({ ...x })
    };
    return (
        <>{
            loading ? (<Loading />) :
                (
                    <>
                        <Modal show={showproduct} onHide={handleCloseproduct} scrollable backdrop="static">
                            <Modal.Header closeButton>
                            </Modal.Header>
                            <Modal.Body className='flex justify-between space-x-3'>
                                <div className='w-1/2'>
                                    <img src={`http://localhost:4000/image/uploads/${product.productDetails?.productUrl}`} alt="" />
                                </div>
                                <div className='w-1/2'>
                                    <p className='fw-semibold'>Product Name : </p><p> {product.productDetails?.productName}</p>
                                    <p className='fw-semibold'>Quantity :  {product.quantity}</p>
                                    <p className='fw-semibold'>Total : {product.quantity * product.productDetails?.price}</p>
                                    <button className='w-100 mt-2 btn btn-outline-success' onClick={() => placeOrder(product.quantity)}>Confirm Order</button>
                                    <button className='w-100 mt-2 btn btn-outline-danger' onClick={handleCloseproduct}>Cancel Order</button>
                                </div>
                            </Modal.Body>

                        </Modal >
                        <section className="text-gray-600 body-font" >
                            <div className="container  py-10 mx-auto">
                                <h2 className='text-black text-center'>My cart</h2>
                                <div className="flex flex-wrap  ">
                                    {
                                        userCart.length == 0
                                            ?
                                            <>
                                                <div className='text-center w-100'>
                                                    <h1 className='flex items-center justify-center text-dark' >Your Cart Is Empty <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="" style={{ height: "200px", width: "200px" }} /></h1>
                                                    <NavLink to='/allproducts'><button className='primary-btn fs-3 '>Continue Shopping</button></NavLink>
                                                </div>
                                            </>
                                            :
                                            <>
                                                {
                                                    userCart?.map((x) => {
                                                        total += (x.quantity * x.productDetails.price)
                                                        return <div className='w-25 p-3 product-info'>
                                                            <div className="p-2 cursor-pointer  shadow-lg h-100">
                                                                <a className="block relative  rounded overflow-hidden">
                                                                    <img alt="ecommerce" className="m-auto md:m-0 h-[25vh]  block" src={`http://localhost:4000/image/uploads/${x.productDetails.productUrl}`} />
                                                                </a>
                                                                <div className=' py-3  fs-5 font-semibold flex flex-col items-center'>
                                                                    <p>{x.productDetails.productName}</p>
                                                                    <div className='flex items-center fs-4'>
                                                                        <button onClick={() => changeQuantity(-1, x.productId)} className='border bottom-2 p-1 flex justify-center items-center ' style={{ height: "30px", width: "30px" }}><AiFillMinusCircle /></button>
                                                                        <div className='border bottom-2 p-1 flex justify-center items-center  ' style={{ height: "30px", width: "30px" }}>{x.quantity}</div>
                                                                        <button onClick={() => changeQuantity(1, x.productId)} className='border bottom-2 p-1 flex justify-center items-center  ' style={{ height: "30px", width: "30px" }}><AiFillPlusCircle /></button>
                                                                    </div>
                                                                    <p className='mt-2'>Total : ₹ {x.quantity * x.productDetails?.price}</p>
                                                                </div>
                                                                <div className='mt-2 flex justify-center items-center space-x-5'>
                                                                    <button className='primary-btn me-1' onClick={() => handleShowProduct(x)}>Buy Now</button>
                                                                    <RiDeleteBin6Line onClick={() => changeQuantity(-x.quantity, x.productId)} className='text-2xl text-danger' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </>
                                    }

                                </div>
                                <h3 className='text-dark flex space-x-2'><span>Grand Total : </span><span> ₹ {total}</span></h3>
                            </div>
                        </section>
                    </>
                )}

        </>

    )
}

export default MainUser(Cart)
import axios from 'axios'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import toast from 'react-hot-toast'
import { getUserCart } from '../UserNav'
import { postApiData } from '../axiosUserClient'


const ProductDisplay = (props) => {
    const [product, setproduct] = useState({})

    const [buyProductObj, setbuyProductObj] = useState({})

    const buyProduct = async (product, type) => {
        buyProductObj['productId'] = product.productId
        buyProductObj["Id"] = JSON.parse(localStorage.getItem("loginId"))
        buyProductObj["quantity"] = 1
        buyProductObj["orderType"] = type
        setbuyProductObj({ ...buyProductObj })
        if (type == "buy") {
            handleShowProduct()

            setproduct(product)
        }

        else {
            const response = await postApiData("/addproduct", buyProductObj)
            if (response.success) {
                toast.success(response.message)
                getUserCart();
            }

        }

    }

    const placeOrder = async () => {

        const response = await postApiData("/addproduct", buyProductObj)
        if (response.success) {
            handleCloseproduct();
            toast.success(response.message)
            getUserCart();
        }
    }
    const [showproduct, setshowproduct] = useState(false)

    const handleCloseproduct = () => {
        setshowproduct(false)
    };

    const handleShowProduct = (url) => {
        setshowproduct(true)
    };
    return (
        <>
            <div>
                <Modal show={showproduct} onHide={handleCloseproduct} scrollable backdrop="static">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body className='flex justify-between space-x-3'>
                        <div className='w-1/2'>
                            <img src={`http://localhost:4000/image/uploads/${product.productUrl}`} alt="" />
                        </div>
                        <div className='w-1/2'>
                            <p className='fw-semibold'>Product Name : </p><p> {product.productName}</p>
                            <p className='fw-semibold'>Product Type : </p><p> {product.productType}</p>
                            <p className='fw-semibold'>Price : {product.price}</p>
                            <button className='w-100 mt-2 btn btn-outline-success' onClick={placeOrder}>Confirm Order</button>
                            <button className='w-100 mt-2 btn btn-outline-danger' onClick={handleCloseproduct}>Cancel Order</button>
                        </div>
                    </Modal.Body>

                </Modal >
                <section className="text-gray-600 body-font" >
                    <div className="container  py-10 mx-auto">
                        <div className="flex flex-wrap  ">
                            {
                                props.product.length == 0
                                    ?
                                    <>
                                        <div className='text-center w-100'>
                                            <h1 className='flex items-center justify-center text-dark' >No Products Found<img src="https://tradibha.com/images/empty_cart.png" alt="" style={{ height: "200px", width: "200px" }} /></h1>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {
                                            props.product.map((x) => {
                                                return <div className='w-25 p-3 product-info'>
                                                    <div className="p-2 cursor-pointer  shadow-lg h-100">
                                                        <a className="block relative  rounded overflow-hidden">
                                                            <img alt="ecommerce" className="m-auto md:m-0 h-[20vh]  block" src={`http://localhost:4000/image/uploads/${x.productUrl}`} />
                                                        </a>
                                                        <div className="mt-4 text-center md:text-left">
                                                            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{x.productType}</h3>
                                                            <h2 className="text-gray-900 title-font text-lg font-medium">{x.productName}</h2>
                                                            <p className="mt-1 fw-bold">₹ {x.price}</p>
                                                            <p className="mt-1">{x.discription}</p>
                                                        </div>
                                                        <div className='mt-2 flex justify-center'>
                                                            <button className='primary-btn me-1' onClick={() => buyProduct(x, "buy")}>Buy Now</button>
                                                            <button className=' primary-btn ' onClick={() => buyProduct(x, "cart")}>Add To Cart</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </>
                            }

                        </div >
                    </div >
                </section >
            </div >

        </>
    )
}

export default ProductDisplay
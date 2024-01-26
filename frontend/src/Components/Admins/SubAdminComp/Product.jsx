import React, { useEffect, useState } from 'react'
import { Form, Modal, Table } from 'react-bootstrap'
import { MainAdmin } from '../MainAdmin';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import Loading from '../../Loading';

const Product = () => {
    const [loading, setloading] = useState(true)

    const [show, setShow] = useState(false);
    const [img, setImg] = useState('');
    let [diaplayimg, setdiaplayImg] = useState('');

    const [showimg, setShowImg] = useState(false);
    const [blank, setbalnk] = useState({})
    let [productObj, setproductObj] = useState({})
    let [allProduct, setallProduct] = useState([])

    const handleClose = () => {
        setproductObj({ ...blank })
        setdiaplayImg('')
        setShow(false)
    };
    const handleShow = () => setShow(true);
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
    const productData = async (e) => {
        if (e.target.type == "file") {
            productObj[e.target.name] = e.target.files[0]
            setdiaplayImg(await toBase64(e.target.files?.[0]))
        }
        else {
            productObj[e.target.name] = e.target.value

        }
        setproductObj({ ...productObj })
    }

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });


    const save = () => {
        let formData = new FormData()
        for (let key in productObj) {
            formData.append(key, productObj[key])
        }
        if (productObj.productId == undefined) {


            axios.post('http://localhost:4000/codeswear/admin/addproduct', formData, auth).then(res => {
                if (res.data.success) {
                    handleClose();
                    toast.success(res.data.message)
                    getAll();
                    setproductObj({ ...blank })
                    setdiaplayImg('')

                }
                else {
                    toast.error(res.data.message)

                }
            })
        }
        else {

            axios.patch(`http://localhost:4000/codeswear/admin/updateproduct/${productObj.productId}`, formData, auth).then(res => {
                if (res.data.success) {
                    handleClose();
                    toast.success(res.data.message)
                    getAll();
                    setproductObj({ ...blank })
                    setdiaplayImg('')

                }
                else {
                    toast.error(res.data.message)

                }
            })

        }
    }

    const getAll = () => {
        axios.get('http://localhost:4000/codeswear/admin/getallproduct', auth).then(res => {
            if (res.data.success) {
                setallProduct([...res.data.data])
                setloading(false)


            }

        })
    }

    const editProduct = (id) => {
        handleShow()
        axios.get(`http://localhost:4000/codeswear/admin/getproductid/${id}`, auth).then(res => {
            if (res.data.success) {
                setproductObj({ ...res.data.data })
                setdiaplayImg(`http://localhost:4000/image/uploads/${res.data.data.productUrl}`)


            }

        })
    }

    const deleteProduct = (id) => {
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
                axios.delete(`http://localhost:4000/codeswear/admin/deleteproduct/${id}`, auth).then(res => {
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





    return (
        <>
            {
                loading ? (<Loading />) :
                    (
                        allProduct.length == 0
                            ?
                            <>
                                <div className='text-center w-100 mt-5'>
                                    <h1 className='flex items-center justify-center text-dark' >No Products Found<img src="https://tradibha.com/images/empty_cart.png" alt="" style={{ height: "200px", width: "200px" }} /></h1>
                                </div>
                            </>
                            :
                            <>
                                <Modal show={showimg} onHide={handleCloseimg} scrollable>
                                    <Modal.Header closeButton>
                                    </Modal.Header>
                                    <Modal.Body className='flex justify-center'>
                                        <img src={`http://localhost:4000/image/uploads/${img}`} alt="" />
                                    </Modal.Body>

                                </Modal >
                                <div className='d-flex align-items-center justify-content-between px-5 py-3 '>
                                    <h3>All Products</h3>
                                    <button className='btn btn-outline-primary' onClick={handleShow}>
                                        Add Products
                                    </button>
                                </div>
                                <Modal show={show} onHide={handleClose} size='lg' scrollable>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Add Data</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>


                                        <Form.Label className='d-block fw-bold'>Product Name</Form.Label>
                                        <Form.Control type="text" name='productName' onChange={productData} value={productObj.productName ?? ""} />

                                        <Form.Label className='d-block fw-bold mt-2'>Product Url</Form.Label>
                                        <Form.Control type="file" name='productUrl' onChange={productData} />

                                        <Form.Label className='d-block fw-bold mt-2'>Product Type </Form.Label>
                                        <Form.Check inline type="radio" label="T-Shirt" value="T-Shirt" checked={productObj?.productType == "T-Shirt"} name='productType' onChange={productData} />
                                        <Form.Check inline type="radio" label="Hoodies" value="Hoodies" checked={productObj?.productType == "Hoodies"} name='productType' onChange={productData} />
                                        <Form.Check inline type="radio" label="Stickers" value="Stickers" checked={productObj?.productType == "Stickers"} name='productType' onChange={productData} />
                                        <Form.Check inline type="radio" label="Mugs" value="Mugs" checked={productObj?.productType == "Mugs"} name='productType' onChange={productData} />

                                        <Form.Label className='d-block fw-bold mt-2'>Price</Form.Label>
                                        <Form.Control type="number" name='price' onChange={productData} value={productObj.price ?? ""} />

                                        <Form.Label className='d-block fw-bold mt-2'>Discription</Form.Label>
                                        <Form.Control type="text" name='discription' onChange={productData} value={productObj.discription ?? ""} />

                                        <div className='mt-2'>
                                            <img src={diaplayimg} alt="" style={{ height: "auto", maxHeight: "150px" }} />
                                        </div>

                                    </Modal.Body>
                                    <Modal.Footer>
                                        <button className='btn btn-outline-primary' onClick={() => { save() }} type='button'>Save Changes</button>
                                    </Modal.Footer>
                                </Modal>
                                <div className="w-100 ">
                                    <Table className='border border-3 text-center recent-act w-100 mt-3'>
                                        <thead>
                                            <tr>
                                                <th className='border border-3 active-tab'>Product Id</th>
                                                <th className='border border-3 active-tab'>Product Name</th>
                                                <th className='border border-3 active-tab'>Product</th>
                                                <th className='border border-3 active-tab'>Product Type </th>
                                                <th className='border border-3 active-tab'>Price </th>
                                                <th className='border border-3 active-tab'>Discription </th>
                                                <th className='border border-3 active-tab'>Action </th>


                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allProduct?.map((x, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td className='border border-3'>{x.productId}</td>
                                                            <td className='border border-3'>{x.productName}</td>
                                                            <td className='border border-3 flex justify-center cursor-pointer' onClick={(url) => handleShowImg(x.productUrl)}><img src={`http://localhost:4000/image/uploads/${x.productUrl}`} alt="" style={{ height: "55px" }} /></td>
                                                            <td className='border border-3'>{x.productType}</td>
                                                            <td className='border border-3'>₹ {x.price}</td>
                                                            <td className='border border-3'>{x.discription}</td>
                                                            <td className='border border-3'>
                                                                <div className="btn btn-outline-success me-2" onClick={(id) => editProduct(x.productId)}>Edit</div>
                                                                <div className="btn btn-outline-danger" onClick={(id) => deleteProduct(x.productId)}>Delete</div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                    )
            }
        </>

    )
}

export default MainAdmin(Product)
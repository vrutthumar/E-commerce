import React, { useEffect, useState } from 'react'
import { MainUser } from '../MainUser'
import axios from 'axios'
import Loading from '../../Loading'
import ProductDisplay from './ProductDisplay'

const AllProducts = () => {
  const [loading, setloading] = useState(true)
  const [allProducts, setallProducts] = useState([])
  const token = JSON.parse(localStorage.getItem("token"))
  let auth = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }


  const getAllProducts = () => {
    axios.get("http://localhost:4000/codeswear/user/getallproduct", auth).then(response => {
      setallProducts([...response.data.data])
      setloading(false)
    })
  }
  useEffect(() => {
    getAllProducts();
  }, [])

  return (
    <>
      {
        loading ? (<Loading />) :
          (
            <ProductDisplay product={allProducts} />
          )}



    </>
  )
}
export default MainUser(AllProducts)
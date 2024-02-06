import React, { useEffect, useState } from 'react'
import { MainUser } from '../MainUser'
import axios from 'axios'
import Loading from '../../Loading'
import ProductDisplay from './ProductDisplay'
import { getApiResource } from '../axiosUserClient'

const AllProducts = () => {
  const [loading, setloading] = useState(true)
  const [allProducts, setallProducts] = useState([])
  const token = JSON.parse(localStorage.getItem("token"))
  let auth = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }


  const getAllProducts = async () => {
    const response = await getApiResource("/getallproduct")
    if (response.success) {
      setallProducts([...response.data])
      setloading(false)
    }

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
import React, { useEffect, useState } from 'react'
import { MainUser } from '../MainUser'
import axios from 'axios'
import Loading from '../../Loading'
import ProductDisplay from './ProductDisplay'
import { getApiResource } from '../axiosUserClient'

const Mugs = () => {
  const [loading, setloading] = useState(true)
  const [mugs, setmugs] = useState([])


  const getmugs = async () => {
    const response = await getApiResource("http://localhost:4000/codeswear/user/mugs")
    if (response.success) {
      setmugs([...response.data])
      setloading(false)
    }

  }


  useEffect(() => {
    getmugs();
  }, [])
  return (
    <>
      {
        loading ? (<Loading />) :
          (
            <ProductDisplay product={mugs} />
          )}



    </>
  )
}

export default MainUser(Mugs)
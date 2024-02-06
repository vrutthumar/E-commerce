import React, { useEffect, useState } from 'react'
import { MainUser } from '../MainUser'
import axios from 'axios'

import Loading from '../../Loading'
import ProductDisplay from './ProductDisplay'
import { getApiResource } from '../axiosUserClient'

const Tshirts = () => {
  const [loading, setloading] = useState(true)
  const token = JSON.parse(localStorage.getItem("token"))
  const [tShirts, settShirts] = useState([])
  let auth = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const gettShirts = async () => {
    const response = await getApiResource("/tshirts")
    if (response.success) {
      settShirts([...response.data])
      setloading(false)
    }
  }

  useEffect(() => {
    gettShirts();
  }, [])

  return (
    <>
      {
        loading ? (<Loading />) :
          (
            <ProductDisplay product={tShirts} />
          )}



    </>
  )
}

export default MainUser(Tshirts)
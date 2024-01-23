

import React, { useEffect, useState } from 'react'
import { MainUser } from '../MainUser'
import axios from 'axios'
import Loading from '../../Loading'
import ProductDisplay from './ProductDisplay'

const Hoodies = () => {
  const [loading, setloading] = useState(true)
  const [hoodies, sethoodies] = useState([])
  const token = JSON.parse(localStorage.getItem("token"))
  let auth = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const gethoodies = () => {
    axios.get("http://localhost:4000/codeswear/user/hoodies", auth).then(response => {
      sethoodies([...response.data.data])
      setloading(false)

    })
  }



  useEffect(() => {
    gethoodies();
  }, [])
  return (
    <>
      {
        loading ? (<Loading />) :
          (
            <ProductDisplay product={hoodies} />
          )}



    </>
  )
}

export default MainUser(Hoodies)
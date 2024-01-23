import React, { useEffect, useState } from 'react'
import { MainUser } from '../MainUser'
import axios from 'axios'
import Loading from '../../Loading'
import ProductDisplay from './ProductDisplay'

const Mugs = () => {
  const [loading, setloading] = useState(true)

  const [mugs, setmugs] = useState([])
  const token = JSON.parse(localStorage.getItem("token"))
  let auth = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const getmugs = () => {
    axios.get("http://localhost:4000/codeswear/user/mugs", auth).then(response => {
      setmugs([...response.data.data])
      setloading(false)

    })
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
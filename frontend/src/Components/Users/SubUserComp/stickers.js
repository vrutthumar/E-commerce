import React, { useEffect, useState } from 'react'
import { MainUser } from '../MainUser'
import axios from 'axios'
import Loading from '../../Loading'
import ProductDisplay from './ProductDisplay'

const Stickers = () => {
  const [stickers, setstickers] = useState([])
  const [loading, setloading] = useState(true)
  const token = JSON.parse(localStorage.getItem("token"))
  let auth = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }


  const getstickers = () => {
    axios.get("http://localhost:4000/codeswear/user/stickers", auth).then(response => {
      setstickers([...response.data.data])
      setloading(false)

    })
  }
  useEffect(() => {
    getstickers();
  }, [])
  return (
    <>
      {
        loading ? (<Loading />) :
          (
            <ProductDisplay product={stickers} />
          )}



    </>
  )
}

export default MainUser(Stickers)
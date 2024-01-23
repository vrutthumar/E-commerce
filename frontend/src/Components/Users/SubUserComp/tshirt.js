import React, { useEffect, useState } from 'react'
import { MainUser } from '../MainUser'
import axios from 'axios'

import Loading from '../../Loading'
import ProductDisplay from './ProductDisplay'

const Tshirts = () => {
  const [loading, setloading] = useState(true)
  const token = JSON.parse(localStorage.getItem("token"))
  const [tShirts, settShirts] = useState([])
  let auth = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const gettShirts = () => {
    axios.get("http://localhost:4000/codeswear/user/tshirts", auth).then(response => {
      settShirts([...response.data.data])
      setloading(false)

    })
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
import React, { useEffect, useState } from 'react'
import { MainUser } from '../MainUser'
import axios from 'axios'
import Loading from '../../Loading'
import ProductDisplay from './ProductDisplay'
import { getApiResource } from '../axiosUserClient'

const Stickers = () => {
  const [stickers, setstickers] = useState([])
  const [loading, setloading] = useState(true)


  const getstickers = async () => {
    const response = await getApiResource("/stickers")
    if (response.success) {
      setstickers([...response.data])
      setloading(false)
    }
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
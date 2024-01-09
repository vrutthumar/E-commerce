import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loading = () => {
  return (
    <div className='absolute top-0 right-0 left-0 bottom-0 flex justify-center items-center'><h3><Spinner animation="border" variant="primary" className='me-3' />Loading</h3></div>
  )
}

export default Loading
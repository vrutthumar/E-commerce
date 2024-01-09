import React from 'react'
import UserFooter from './UserFooter'
import UserNavbar from './UserNav'

export const MainUser = (Component) => {
  const newComponent = () => {

    return (
      <>
        <UserNavbar />
        <div className='relative' style={{minHeight : 'calc(100vh - 267px )'}} >
          <Component />
        </div>
        <UserFooter />
      </>
    )
  }
  return newComponent
}


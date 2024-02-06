import React from 'react'
import AdminNavbar from './AdminNav'
import AdminFooter from './AdminFooter'

export const MainAdmin = (Component) => {
  const newComponent = () => {
    return (
      <>
        <AdminNavbar />
        <div className='relative' style={{ minHeight: 'calc(100vh - 247px)' }} >
          <Component />
        </div>
        <AdminFooter />
      </>
    )
  }
  return newComponent
}
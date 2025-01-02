import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Home from './Home'

const AdminAuthenticator = () => {
    const isVendor = useSelector(state => state.user.isVendor)
    const isAuthenticated = useSelector(state => state.user.isLogin)

    return (
        <div>
            {isVendor && isAuthenticated ? <Outlet /> : <Home />}
        </div>
    )
}

export default AdminAuthenticator
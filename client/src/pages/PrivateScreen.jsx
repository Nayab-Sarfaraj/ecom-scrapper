import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Outlet } from 'react-router-dom'
import Login from './Login'

const PrivateScreen = () => {
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(state => state.user.isLogin)
    console.log(isAuthenticated)
    return (
        <div>
            {isAuthenticated ? <Outlet /> : <Login />}
        </div>
    )
}

export default PrivateScreen
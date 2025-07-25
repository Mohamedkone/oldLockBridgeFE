import { SocketProvider } from 'context/socket/socketContext'
import React from 'react'
import { Outlet } from "react-router-dom"
function SocketOutlet() {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  )
}

export default SocketOutlet
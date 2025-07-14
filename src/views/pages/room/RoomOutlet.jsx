import { SocketProvider } from 'context/socket/socketContext'
import React from 'react'
import { Outlet } from "react-router-dom"
function RoomOutlet() {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  )
}

export default RoomOutlet
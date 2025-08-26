import { Outlet } from "react-router-dom"

const RootLayOut = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden ">
      <Outlet />
    </div>
  )
}

export default RootLayOut

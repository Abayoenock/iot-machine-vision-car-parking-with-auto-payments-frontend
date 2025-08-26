import SideNav from "@/components/dashboardLayOut/SideNav"
import TopNav from "@/components/dashboardLayOut/TopNav"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Outlet } from "react-router-dom"

import { RiMenuUnfold3Line2 } from "react-icons/ri"
import BreadCrumb from "@/components/dashboardLayOut/BreadCrumb"
import { Button } from "@/components/ui/button"
import { RiMenuUnfold4Line2 } from "react-icons/ri"

import { UserProvider } from "@/providers/UserProvider"
import AuthProvider from "@/providers/AuthProvider"

const DashboardLayOut = () => {
  const [showLabels, setShowLabels] = useState(true)

  return (
    <UserProvider>
      <AuthProvider>
        <div className="w-full  relative">
          <div className="w-full flex relative  min-h-screen   ">
            <div
              className={cn(
                "transition-all duration-300 w-full hidden md:flex flex-col h-screen bg-rcsDarkColor text-gray-100 fixed top-0 left-0",
                showLabels ? "md:w-[250px]" : "md:w-[70px]"
              )}
            >
              <div className="w-full flex gap-2 p-2 justify-between">
                <div className="flex gap-2 items-center">
                  {showLabels && (
                    <>
                      <span className="text-2xl">
                        <img src="/icon.svg" className="w-[40px]" />
                      </span>
                      {/* <h1>{import.meta.env.VITE_APPNAME}</h1> */}
                      <h1>IoT & MV</h1>
                    </>
                  )}
                </div>
                <Button
                  className="rounded-full hover:bg-white/10 hover:text-white text-lg p-2"
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowLabels((prev) => !prev)}
                >
                  {showLabels ? <RiMenuUnfold4Line2 /> : <RiMenuUnfold3Line2 />}
                </Button>
              </div>
              <div className="w-[90%] border-b-[1px] border-rcsSilverColor/20 mx-auto"></div>

              <SideNav showLabels={showLabels} />
            </div>

            <div
              className={cn(
                " transition-all duration-300 relative w-full min-h-screen ",
                showLabels
                  ? "md:w-[calc(100%-250px)] md:ml-[250px]"
                  : "md:w-[calc(100%-70px)] md:ml-[70px]"
              )}
            >
              <div className=" w-full  relative     ">
                <div
                  className={cn(
                    " transition-all duration-300 fixed  top-0 right-0 h-[57px] w-full  ",
                    showLabels
                      ? "md:w-[calc(100%-250px)] "
                      : "md:w-[calc(100%-70px)]"
                  )}
                >
                  <TopNav />
                </div>

                <div className="w-full  flex flex-col gap-2 p-2 mt-[60px]">
                  <div className="w-full pl-4">
                    <BreadCrumb />
                  </div>
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthProvider>
    </UserProvider>
  )
}

export default DashboardLayOut

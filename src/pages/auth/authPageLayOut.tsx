import { Outlet } from "react-router-dom"

import { DotLottieReact } from "@lottiefiles/dotlottie-react"
const AuthPageLayOut = () => {
  return (
    <div className=" grid grid-cols-1 md:grid-cols-2 w-full h-screen md:overflow-y-hidden">
      <div className=" w-full  h-full bg-gray-900 hidden md:flex relative">
        <div className=" absolute w-full h-full bg-rcsDarkColor   backdrop-blur-[1px] flex flex-col  items-center    ">
          <div className=" absolute w-full h-full bg-blue-900/70   backdrop-blur-[1px] flex flex-col  items-center    "></div>
          <div className=" h-fit flex gap-3 items-center mt-[20px] absolute top-16  left-0">
            <h1 className=" text-center text-white/90  font-extrabold text-5xl  leading-[40px] lg:px-12">
              IoT Machine Vision Lisence Plate Recognition System
            </h1>
          </div>
          <img src="/gat.png" className=" w-full h-full" />

          <div className="pt-12 w-[200px]  absolute  bottom-0  -right-[190px]">
            <DotLottieReact src="plate3.lottie" loop autoplay speed={0.5} />
          </div>
        </div>
      </div>
      <div className=" p-6 w-full flex justify-center  items-center   relative ">
        <div className=" w-full h-full absolute left-0 top-0  rounded-full  blur-3xl -z-[0]"></div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthPageLayOut

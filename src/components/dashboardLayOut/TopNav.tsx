import UserTopNav from "./UserTopNav"

import MobileNav from "./MobileNav"
import { UserContext } from "@/providers/UserProvider"
import { useContext } from "react"

const TopNav = () => {
  const userContext = useContext(UserContext)

  return (
    <nav className=" w-full  h-full bg-white/20 backdrop-blur-sm  border-b-[1px] border-rcsSilverColor z-[20]   flex gap-3   md:justify-end justify-between  item p-2 px-6 pr-3 ">
      <div className=" flex md:hidden gap-2 items-center">
        <span className=" text-2xl">
          <img src="/icon.svg" className="w-[40px]" />
        </span>
        <h1>IoT & MV SPS</h1>
      </div>
      <div className=" flex gap-4 pr-3  ">
        <UserTopNav user={userContext?.user} />
        <MobileNav />
      </div>
    </nav>
  )
}

export default TopNav

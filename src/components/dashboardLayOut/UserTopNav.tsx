import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegUser } from "react-icons/fa"
import { FaPowerOff } from "react-icons/fa6"
import useLogout from "@/lib/logOut"
import { Link } from "react-router-dom"

const UserTopNav = ({ user }: { user: any }) => {
  const logOut = useLogout()
  return (
    <div className=" flex items-center gap-3  ">
      <span className=" ">{user?.firstname} </span>
      <DropdownMenu>
        <DropdownMenuTrigger className=" outline-none focus:outline-none">
          <Avatar className=" size-[30px]">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback className=" uppercase text-xs font-semibold">
              {user?.firstname[0]}
              {user?.lastname[0]}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Link to={"/dashboard/profile"}>
            <DropdownMenuItem className=" gap-2">
              <FaRegUser />
              Profile
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem className=" gap-2" onClick={logOut}>
            <FaPowerOff />
            LogOut
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserTopNav

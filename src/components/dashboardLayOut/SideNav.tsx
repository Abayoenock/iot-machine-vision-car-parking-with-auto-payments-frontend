import { NavLink } from "react-router-dom"
import { NavLinks } from "./navLinks"
import "./nav.css"
// import { FaPowerOff } from "react-icons/fa6"
// import useLogout from "@/lib/logOut"
import { useContext } from "react"
import { UserContext } from "@/providers/UserProvider"

const SideNav = ({ showLabels }: { showLabels: boolean }) => {
  const userContext = useContext(UserContext)
  // const logOut = useLogout()
  return (
    <aside className=" w-full h-full ">
      <ul className=" w-full flex flex-col mt-[30px]  h-full">
        {NavLinks.map((link) => {
          if (!link.privileges.includes(userContext?.user?.role as number)) {
            return null
          }
          return (
            <NavLink
              to={link.navLink}
              className={({ isActive }) => {
                return isActive ? "ActiveLink" : " "
              }}
              key={link.navLabel}
            >
              <li className=" transition-all duration-300 w-full relative pl-4  p-3  flex gap-2 items-center  cursor-pointer   text-white hover:bg-white hover:bg-opacity-10 hover:pl-6 before:w-[20px] before:h-[20px] before:transition-all before:duration-300 before:bg-transparent before:absolute before:right-0 before:-top-[20px] before:rounded-lg after:w-[20px] after:h-[20px]  after:transition-all after:duration-300 after:bg-transparent after:absolute after:right-0 after:-bottom-[20px] after:rounded-lg">
                <span className=" transition-all duration-300 group-hover:translate-x-2 flex  gap-2 items-center   ">
                  <span className="  text-2xl"> {link.navIcon}</span>{" "}
                  {showLabels && (
                    <span className=" text-sm">{link.navLabel}</span>
                  )}
                </span>
              </li>
            </NavLink>
          )
        })}
        {/* <div className=" absolute  bottom-2 left-0  w-full">
          <li
            className=" transition-all duration-300 w-full relative pl-4  p-3  flex gap-2 items-center  cursor-pointer   text-white hover:bg-white hover:bg-opacity-10 hover:pl-6 before:w-[20px] before:h-[20px] before:transition-all before:duration-300 before:bg-transparent before:absolute before:right-0 before:-top-[20px] before:rounded-lg after:w-[20px] after:h-[20px]  after:transition-all after:duration-300 after:bg-transparent after:absolute after:right-0 after:-bottom-[20px] after:rounded-lg   "
            onClick={logOut}
          >
            <span className=" transition-all duration-300 group-hover:translate-x-2 flex  gap-2 items-center   ">
              <span className="  text-2xl">
                {" "}
                <FaPowerOff />
              </span>{" "}
              {showLabels && <span className=" text-sm">Logout</span>}
            </span>
          </li>
        </div> */}
      </ul>
    </aside>
  )
}

export default SideNav

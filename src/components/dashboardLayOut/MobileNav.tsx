import { NavLink } from "react-router-dom"
import { NavLinks } from "./navLinks"
import "./nav.css"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"
import { RiMenu3Fill } from "react-icons/ri"

const MobileNav = () => {
  return (
    <div className="flex md:hidden ">
      <Sheet>
        <SheetTrigger>
          <RiMenu3Fill />
        </SheetTrigger>

        <SheetContent className=" bg-rcsDarkColor text-white border-0  ">
          <SheetHeader className=" sr-only">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>mobile navigation menu</SheetDescription>
          </SheetHeader>
          <aside className=" w-full h-full">
            <ul className=" w-full flex flex-col mt-[30px] ">
              {NavLinks.map((link) => (
                <NavLink
                  to={link.navLink}
                  className={({ isActive }) => {
                    return isActive ? "ActiveLinkMobile" : " "
                  }}
                  key={link.navLabel}
                >
                  <SheetClose asChild>
                    <li className=" transition-all duration-300 w-full relative  p-3  flex gap-2 items-center  cursor-pointer   text-white hover:bg-white hover:bg-opacity-10 hover:pl-6 ">
                      <span className=" transition-all duration-300 group-hover:translate-x-2 flex  gap-2 items-center   ">
                        <span className="  text-2xl"> {link.navIcon}</span>{" "}
                        <span className=" text-sm">{link.navLabel}</span>
                      </span>
                    </li>
                  </SheetClose>
                </NavLink>
              ))}
            </ul>
          </aside>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav

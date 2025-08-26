import { TfiDashboard, TfiPanel } from "react-icons/tfi"
import { TbTransactionDollar, TbUsersGroup } from "react-icons/tb"
import { ImProfile } from "react-icons/im"
import { ReactElement } from "react"

import { TbReport } from "react-icons/tb"

import { IoCarSportOutline } from "react-icons/io5"

import { FaCogs } from "react-icons/fa"

export const NavLinks: {
  navLabel: string
  navLink: string
  navIcon: ReactElement
  privileges: number[]
}[] = [
  {
    navLabel: "Dashboard",
    navLink: "/dashboard/",
    navIcon: <TfiDashboard />,
    privileges: [0, 1], // Both admin and other users can access
  },

  {
    navLabel: "Control Panel",
    navLink: "/dashboard/control-panel",
    navIcon: <TfiPanel />,
    privileges: [0, 1], // Only admin can access
  },
  {
    navLabel: "Access report",
    navLink: "/dashboard/report",
    navIcon: <TbReport />,
    privileges: [0, 1], // Only admin can access
  },
  {
    navLabel: "Transactions",
    navLink: "/dashboard/Transactions",
    navIcon: <TbTransactionDollar />,
    privileges: [0], // Only admin can access
  },
  {
    navLabel: "Vehicles",
    navLink: "/dashboard/vehicles",
    navIcon: <IoCarSportOutline />,
    privileges: [0, 1], // Only admin can access
  },
  {
    navLabel: "Settings",
    navLink: "/dashboard/settings",
    navIcon: <FaCogs />,
    privileges: [0], // Only admin can access
  },

  {
    navLabel: "Staff",
    navLink: "/dashboard/users",
    navIcon: <TbUsersGroup />,
    privileges: [0], // Only admin can access
  },
  {
    navLabel: "Profile",
    navLink: "/dashboard/profile",
    navIcon: <ImProfile />,
    privileges: [0, 1], // Both admin and other users can access
  },
]

export const checkPrivileges = (userPrivilege: number, link: string) => {
  // Explicitly allow /dashboard/
  if (link === "/dashboard/") {
    return true
  }

  // Split the link into parts
  const linkParts = link.split("/").filter(Boolean)
  console.log(linkParts)

  // Check for the most specific match first
  for (let i = linkParts.length; i > 0; i--) {
    const partialLink = "/" + linkParts.slice(0, i).join("/")
    const linkItem = NavLinks.find((item) => item.navLink === partialLink)
    if (linkItem) {
      return linkItem.privileges.includes(userPrivilege)
    }
  }

  // If no match is found, return false
  return false
}

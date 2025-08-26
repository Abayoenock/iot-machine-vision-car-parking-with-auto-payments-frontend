import { checkPrivileges } from "@/components/dashboardLayOut/navLinks"
import { useContext, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { UserContext } from "./UserProvider"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const userContext = useContext(UserContext)

  useEffect(() => {
    const currentPath = location.pathname

    // Wait for user context to be available
    if (userContext?.user) {
      if (!checkPrivileges(userContext.user.role, currentPath)) {
        navigate(
          `/auth?e=${
            userContext.user.firstname || " "
          } you do not have the required privileges to access that page `
        ) // Redirect to an unauthorized page
      }
    }
  }, [location, navigate, userContext])

  // Render children only if user context is available
  if (!userContext?.user) {
    return null // or a loading spinner, or a placeholder component
  }

  return <>{children}</>
}

export default AuthProvider

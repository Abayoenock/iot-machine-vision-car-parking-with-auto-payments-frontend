import { useNavigate } from "react-router-dom"

const useLogout = () => {
  const navigate = useNavigate()

  const logout = () => {
    // Remove the JWT token from localStorage
    localStorage.removeItem("JWT_TOKEN")

    // Navigate to the auth page and replace the current URL
    navigate("/auth", { replace: true })
  }

  return logout
}

export default useLogout

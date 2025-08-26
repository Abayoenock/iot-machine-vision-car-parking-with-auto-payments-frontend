import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

interface PostState {
  loading: boolean
  error: string | null
  success: boolean
}

const usePost = (url: string, includeAuth: boolean = false) => {
  const [state, setState] = useState<PostState>({
    loading: false,
    error: null,
    success: false,
  })
  const navigate = useNavigate()

  const postData = async (data: any) => {
    setState({ loading: true, error: null, success: false })
    try {
      const headers = includeAuth
        ? { Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}` }
        : {}
      await axios.post(`${import.meta.env.VITE_BACKEND_ENDPOINT}${url}`, data, {
        headers,
      })
      setState({ loading: false, error: null, success: true })
      toast.success("Item created successfully")
    } catch (err: any) {
      if (err.response.status === 401 || err.response.status === 403) {
        navigate(`/auth?e=${err.response.data.error}`)
        return
      }
      setState({
        loading: false,
        error: err.response.data.error,
        success: false,
      })
      toast.error("Failed to create item")
    }
  }

  return { ...state, postData }
}

export default usePost

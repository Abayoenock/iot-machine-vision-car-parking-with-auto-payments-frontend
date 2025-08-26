import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useLoadingBar } from "react-top-loading-bar"

interface UpdateState {
  loading: boolean
  error: string | null
  success: boolean
}

const useUpdate = (url: string, includeAuth: boolean = false) => {
  const [state, setState] = useState<UpdateState>({
    loading: false,
    error: null,
    success: false,
  })
  const navigate = useNavigate()
  const { start, complete } = useLoadingBar({
    color: "hsl(252, 76.40%, 21.60%)",
    height: 2,
  })
  const updateData = async (data: any) => {
    setState({ loading: true, error: null, success: false })
    start()
    try {
      const headers = includeAuth
        ? { Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}` }
        : {}
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}${url}`,
        data,
        {
          headers,
        }
      )
      setState({ loading: false, error: null, success: true })
      complete()
      if (response.data.message) {
        toast.success(`${response.data.message}`, { position: "top-right" })
      }
    } catch (err: any) {
      if (err.response.status === 401 || err.response.status === 403) {
        navigate(`/auth?e=${err.response.data.error}`)
        return
      }
      complete()
      setState({
        loading: false,
        error: err.response.data.error,
        success: false,
      })
      toast.error(err.response.data.error || "Failed to update item")
    }
  }

  return { ...state, updateData }
}

export default useUpdate

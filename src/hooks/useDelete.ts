import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useLoadingBar } from "react-top-loading-bar"

interface DeleteState {
  loading: boolean
  error: string | null
  success: boolean
}

const useDelete = (url: string, includeAuth: boolean = false) => {
  const { start, complete } = useLoadingBar({
    color: "hsl(252, 76.40%, 21.60%)",
    height: 2,
  })

  const [state, setState] = useState<DeleteState>({
    loading: false,
    error: null,
    success: false,
  })
  const navigate = useNavigate()

  const deleteData = async () => {
    setState({ loading: true, error: null, success: false })
    start()
    try {
      const headers = includeAuth
        ? { Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}` }
        : {}
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}${url}`,
        {
          headers,
        }
      )
      complete()
      setState({ loading: false, error: null, success: true })
      toast.success(`${response.data.message}`)
    } catch (err: any) {
      if (err.response.status == 401 || err.response.status == 403) {
        navigate(`/auth?e=${err.response.data.error}`)
        return
      }
      complete()
      setState({
        loading: false,
        error: err.response.data.error,
        success: false,
      })
      toast.error("Failed to delete item")
    }
  }

  return { ...state, deleteData }
}

export default useDelete

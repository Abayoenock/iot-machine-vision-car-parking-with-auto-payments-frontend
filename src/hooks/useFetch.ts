import { useQuery } from "react-query"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useLoadingBar } from "react-top-loading-bar"

const useFetch = <T>(
  url: string,
  includeAuth: boolean = false,
  autoFetch: boolean = true,
  maxRetries: number = 3
) => {
  const { start, complete } = useLoadingBar({
    color: "hsl(252, 76.40%, 21.60%)",
    height: 2,
  })

  const navigate = useNavigate()

  const fetchData = async () => {
    start()
    try {
      const headers = includeAuth
        ? { Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}` }
        : {}
      const response = await axios.get<T>(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}${url}`,
        { headers }
      )
      complete()
      return response.data
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate(`/auth?e=${err.response.data.error}`)
        complete()
        throw new Error(err.response.data.error)
      }
      throw err
    }
  }

  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery<T, Error>(
    url, // Query key
    fetchData, // Query function
    {
      enabled: autoFetch, // Disable auto-fetch if not required
      retry: maxRetries, // Max retries
      onError: (err: Error) => {
        console.error("Error fetching data:", err.message)
      },
    }
  )

  return {
    data: data || null,
    loading,
    error: isError ? error?.message || "An error occurred" : null,
    refetch,
  }
}

export default useFetch

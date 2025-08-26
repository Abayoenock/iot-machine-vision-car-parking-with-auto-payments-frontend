import ChangePasswordForm from "@/components/auth/changePasswordForm"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

const ForgotPasswordPage = () => {
  const [message, setMessage] = useState("")
  const [verifyState, setVerifyState] = useState({
    isPending: true,
    isValid: false,
    isError: false,
  })
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  // Access specific query parameter
  const token = queryParams.get("token")
  console.log(token)
  // verify the token before mounting the chnage password form
  useEffect(() => {
    const verify = async () => {
      try {
        const results = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_ENDPOINT
          }/api/auth/verify-token?token=${token}`
        )
        setMessage(results.data.message)
        setVerifyState((prevState) => {
          return { ...prevState, isValid: true }
        })
      } catch (err: any) {
        console.log(err)
        setMessage(err.response.data.error)
        setVerifyState((prevState) => {
          return { ...prevState, isError: true }
        })
      } finally {
        setVerifyState((prevState) => {
          return { ...prevState, isPending: false }
        })
      }
    }
    verify()
  }, [])
  return (
    <>
      {/* LOG IN forms */}
      {verifyState.isPending && <h1>verifiying token </h1>}
      {verifyState.isError && (
        <div className=" w-full  flex flex-col gap-4">
          <div className=" bg-red-100 text-red-600  w-full break-words p-3 rounded-md text-xs">
            {message}
          </div>
          <div className=" flex gap-8 text-xs px-6">
            <Link to={"/auth"}>Login ?</Link>
            <Link to={"/auth/forgot-password"}>Forgot Your Password ?</Link>
          </div>
        </div>
      )}
      {verifyState.isValid && (
        <div className=" w-full md:w-fit h-fit border-[1px] rounded-md p-4 bg-white/70 backdrop-blur-sm">
          <h1 className=" text-xl font-bold  mb-4">Change Your Password </h1>
          <div className=" w-full md:w-[400px]">
            <ChangePasswordForm />
          </div>
        </div>
      )}
    </>
  )
}

export default ForgotPasswordPage

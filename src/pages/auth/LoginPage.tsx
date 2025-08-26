import LoginForm from "@/components/auth/LoginForm"
import { useSearchParams } from "react-router-dom"

const LoginPage = () => {
  const [searchParams] = useSearchParams()
  return (
    <div className=" w-full flex flex-col justify-center items-center gap-2">
      {searchParams.get("e") && (
        <div className=" p-2 px-4 bg-red-100 text-red-500  rounded-md text-sm w-fit ">
          <p>{searchParams.get("e")}</p>
        </div>
      )}

      <div className=" w-full md:w-fit h-fit border-[1px] rounded-md p-4 shadow-lg  bg-white/70 backdrop-blur-sm">
        <h1 className=" text-xl font-bold  mb-4">Welcome Back !</h1>

        <div className=" md:w-[400px] w-full ">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default LoginPage

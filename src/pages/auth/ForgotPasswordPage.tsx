import PasswordResetForm from "@/components/auth/PasswordResetForm"

const ForgotPasswordPage = () => {
  return (
    <>
      {/* LOG IN forms */}
      <div className=" w-full md:w-fit h-fit border-[1px] rounded-md p-4 bg-white/70 backdrop-blur-sm">
        <h1 className=" text-xl font-bold  mb-4">Reset Your Password </h1>
        <div className=" w-full md:w-[400px]">
          <PasswordResetForm />
        </div>
      </div>
    </>
  )
}

export default ForgotPasswordPage

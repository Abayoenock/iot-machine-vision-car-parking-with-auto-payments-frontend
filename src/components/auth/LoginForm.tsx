import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { loginSchema } from "@/lib/types"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "../ui/input"
import CircularBars from "../loaders/spinner/circularBars/CircularBars"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const LoginForm = () => {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    //const state = await reviewAction(data)
    console.log(data)
    try {
      const response = await axios.post<any>(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/auth`,
        data,
        {
          withCredentials: true,
        }
      )

      console.log(response.data)

      if (response.data?.error) {
        return toast.error(response.data.error, {
          position: "top-right",
          duration: 4000,
        })
      }

      localStorage.setItem("JWT_TOKEN", response.data.token)

      toast.success(response.data?.message, {
        position: "top-right",
        duration: 4000,
      })
      navigate("/dashboard/")
    } catch (err: any) {
      if (err.response.data.error) {
        return toast.error(err.response.data.error)
      }
      toast.error("An error occured please try again ")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 text-left "
      >
        <div className=" w-full grid grid-cols-1  gap-2 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email Address" {...field} />
                </FormControl>
                <FormMessage className=" font-normal text-xs  " />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your password"
                    {...field}
                    type="password"
                  />
                </FormControl>

                <FormMessage className=" font-normal text-xs" />
                <div className=" flex justify-end">
                  <Link
                    to={"/auth/forgot-password"}
                    className=" text-right text-xs"
                  >
                    Forgot Password ?
                  </Link>
                </div>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className=" w-full transition-all duration-300 bg-rcsDarkColor hover:bg-rcsDarkColor/70 "
        >
          {!form.formState.isSubmitting ? (
            "Login"
          ) : (
            <span className=" flex  items-center  gap-2">
              {"Loging In "}
              <CircularBars size="micro" speed="average" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
export default LoginForm

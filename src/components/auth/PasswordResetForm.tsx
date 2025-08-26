import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { emailSchema } from "@/lib/types"
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
import { useState } from "react"

const PasswordResetForm = () => {
  const [message, setMessage] = useState("")
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof emailSchema>) {
    console.log(data)
    try {
      const response = await axios.post<any>(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/auth/reset-password`,
        data,
        {
          withCredentials: true,
        }
      )

      console.log(response.data)

      if (response.data?.error) {
        return toast.error(response.data.error)
      }
      setMessage(response.data?.message)
      toast.success(response.data?.message, {
        duration: 4000,
        position: "top-right",
      })
      form.reset()
    } catch (err: any) {
      if (err.response.data.error) {
        return toast.error(err.response.data.error)
      }
      toast.error("An error occured please try again ", {
        duration: 4000,
        position: "top-right",
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 text-left"
      >
        <div className=" w-full grid grid-cols-1  gap-2 ">
          {message && (
            <div className=" bg-green-100 text-green-600  w-full break-words p-3 rounded-md text-xs">
              {message}
            </div>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email Address" {...field} />
                </FormControl>
                <FormMessage className=" font-normal text-xs" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className=" w-full transition-all duration-300 bg-rcsDarkColor hover:bg-rcsDarkColor/70"
        >
          {!form.formState.isSubmitting ? (
            "Send Link"
          ) : (
            <span className=" flex  items-center  gap-2">
              {"Sending Link "}
              <CircularBars size="micro" speed="average" />
            </span>
          )}
        </Button>

        <div className=" w-full flex justify-end text-xs">
          <Link to={"/auth"}>Back to Login ?</Link>
        </div>
      </form>
    </Form>
  )
}
export default PasswordResetForm

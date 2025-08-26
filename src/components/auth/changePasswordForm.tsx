import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { forgotPasswordResetSchema } from "@/lib/types"
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
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"

const ChangePasswordForm = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const navigate = useNavigate()

  // Access specific query parameter
  const token = queryParams.get("token")

  const form = useForm<z.infer<typeof forgotPasswordResetSchema>>({
    resolver: zodResolver(forgotPasswordResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: z.infer<typeof forgotPasswordResetSchema>) {
    //const state = await reviewAction(data)
    console.log(data)
    try {
      const response = await axios.put<any>(
        `${
          import.meta.env.VITE_BACKEND_ENDPOINT
        }/api/auth/change-password-reset?token=${token}`,
        data
      )

      console.log(response.data)

      if (response.data?.error) {
        return toast.error(response.data.error)
      }

      toast.success(response.data?.message, {
        duration: 6000,
        position: "top-right",
      })
      navigate("/auth")
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
        className="w-full space-y-6 text-left"
      >
        <div className=" w-full grid grid-cols-1  gap-2 ">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your new password"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage className=" text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm entered password"
                    {...field}
                    type="password"
                  />
                </FormControl>

                <FormMessage className=" text-xs" />
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
            "Change Password"
          ) : (
            <span className=" flex  items-center  gap-2">
              {"Chnaging password .. "}
              <CircularBars size="micro" speed="average" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default ChangePasswordForm

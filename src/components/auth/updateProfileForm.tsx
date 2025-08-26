import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { updateAccountSchema } from "@/lib/types"
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

import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { UserContext } from "@/providers/UserProvider"
import { useContext } from "react"
const UpdateProfileForm = ({
  userData,
}: {
  userData: z.infer<typeof updateAccountSchema>
}) => {
  const userContext = useContext(UserContext)
  const form = useForm<z.infer<typeof updateAccountSchema>>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      _id: userData._id,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      NID: userData.NID,
    },
  })
  console.log("Form Errors:", form.formState.errors)

  async function onSubmit(data: z.infer<typeof updateAccountSchema>) {
    console.log(data)

    try {
      if ((userContext?.user?.role as number) != 0) {
        toast.error(
          `Dear ${userContext?.user?.firstname} you can not update your profile, to update your profile please contact the system administrator`,
          { position: "bottom-center" }
        )
        return
      }
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}`,
      }

      const response = await axios.put<any>(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/auth/update-profile`,
        data,
        {
          headers,
        }
      )

      console.log(response.data)

      if (response.data?.error) {
        return toast.error(response.data.error)
      }
      // @ts-ignore
      const { user, setUser } = userContext

      setUser(() => {
        return { ...user, ...data }
      })
      toast.success(response.data?.message)
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
        <div className=" w-full grid grid-cols-2  gap-2 ">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-xs">Firstname</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter user firstname"
                    {...field}
                    className=" focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-xs"
                    disabled={(userContext?.user?.role as number) == 1}
                  />
                </FormControl>
                <FormMessage className=" font-normal text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-xs">Lastname</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter user  lastname"
                    {...field}
                    className=" focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-xs"
                    disabled={(userContext?.user?.role as number) == 1}
                  />
                </FormControl>
                <FormMessage className=" font-normal text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-xs">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter user email Address"
                    {...field}
                    className=" focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-xs"
                    disabled={(userContext?.user?.role as number) == 1}
                  />
                </FormControl>
                <FormMessage className=" font-normal text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="NID"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-xs">NID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your NID"
                    {...field}
                    className=" focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-xs"
                    disabled={(userContext?.user?.role as number) == 1}
                  />
                </FormControl>
                <FormMessage className=" font-normal text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    placeholder="Enter phone number"
                    {...field}
                    className=""
                    disabled={(userContext?.user?.role as number) == 1}
                  />
                </FormControl>

                <FormMessage className=" font-normal  text-xs" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          className="bg-rcsDarkColor hover:bg-rcsDarkColor/80"
        >
          {!form.formState.isSubmitting ? (
            "Update profile"
          ) : (
            <span className=" flex  items-center  gap-2">
              {"Updating profile "}
              <CircularBars size="micro" speed="average" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
export default UpdateProfileForm

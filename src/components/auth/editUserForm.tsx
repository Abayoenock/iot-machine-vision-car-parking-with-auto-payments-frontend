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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQueryClient } from "react-query"

const EdituserForm = ({
  userData,
}: {
  userData: z.infer<typeof updateAccountSchema>
}) => {
  const queryClient = useQueryClient()
  const handleRevalidate = () => {
    // Revalidate the query
    queryClient.invalidateQueries(`/api/auth/user/${userData._id}`)
  }

  const form = useForm<z.infer<typeof updateAccountSchema>>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      _id: userData._id,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      NID: userData.NID,
      phone: userData.phone,
      role: userData.role,
    },
  })

  async function onSubmit(data: z.infer<typeof updateAccountSchema>) {
    //const state = await reviewAction(data)
    console.log(data)
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}`,
      }

      const response = await axios.put<any>(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/auth/update-profile/${
          userData._id
        }`,
        data,
        {
          headers,
        }
      )

      console.log(response.data)

      if (response.data?.error) {
        return toast.error(response.data.error)
      }
      handleRevalidate()
      toast.success(response.data?.message)
    } catch (err: any) {
      if (err.response.data.error) {
        return toast.error(err.response.data.error)
      }
      toast.error("An error occured please try again ")
    }
  }

  const handleValueChange = (field: any) => (value: any) => {
    const parsedValue = parseInt(value, 10)
    field.onChange(parsedValue)
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
                  />
                </FormControl>
                <FormMessage className=" font-normal text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"NID"}
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-xs">National ID No</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter user Nationa ID"
                    {...field}
                    className=" focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-xs"
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
                  />
                </FormControl>

                <FormMessage className=" font-normal  text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Privileges</FormLabel>
                <Select
                  onValueChange={handleValueChange(field)}
                  defaultValue={`${userData.role}`}
                >
                  <FormControl className=" focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-xs">
                    <SelectTrigger>
                      <SelectValue placeholder="Select user Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Security Officer</SelectItem>
                    <SelectItem value="0">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage className=" font-normal text-xs" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          className="transition-all duration-300 bg-rcsDarkColor hover:bg-rcsDarkColor/70"
        >
          {!form.formState.isSubmitting ? (
            "Update user"
          ) : (
            <span className=" flex  items-center  gap-2">
              {"Updating User "}
              <CircularBars size="micro" speed="average" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
export default EdituserForm

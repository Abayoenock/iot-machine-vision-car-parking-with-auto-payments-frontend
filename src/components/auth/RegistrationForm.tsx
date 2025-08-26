import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createAccountSchema } from "@/lib/types"
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

const RegistrationForm = () => {
  const form = useForm<z.infer<typeof createAccountSchema>>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      NID: "",
      role: undefined,
    },
  })

  async function onSubmit(data: z.infer<typeof createAccountSchema>) {
    //const state = await reviewAction(data)
    console.log(data)
    try {
      const response = await axios.post<any>(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/auth/create`,
        data,
        {
          withCredentials: true,
        }
      )

      console.log(response.data)

      if (response.data?.error) {
        return toast.error(response.data.error)
      }

      toast.success(response.data?.message)
      form.reset()
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
        className="w-full space-y-6 text-left px-4 "
      >
        <div className=" w-full grid grid-cols-1 md:grid-cols-2  gap-2  ">
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
                <Select onValueChange={handleValueChange(field)}>
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
          disabled={form.formState.isSubmitting}
          className="bg-rcsDarkColor hover:bg-rcsDarkColor/70"
        >
          {!form.formState.isSubmitting ? (
            "Save user"
          ) : (
            <span className=" flex  items-center  gap-2">
              {"Saving User "}
              <CircularBars size="micro" speed="average" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}
export default RegistrationForm

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { passwordResetSchema } from "@/lib/types"
import { Button } from "@/components/ui/button"
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
import useUpdate from "@/hooks/useUpdate"
import { useEffect } from "react"

const ChangeUserPasswordForm = () => {
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const { success, updateData } = useUpdate(`/api/auth/change-password`, true)
  useEffect(() => {
    form.reset()
  }, [success])

  async function onSubmit(data: z.infer<typeof passwordResetSchema>) {
    //const state = await reviewAction(data)
    console.log(data)
    updateData(data)
    if (success) {
      form.reset()
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
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your current password"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage className=" text-xs font-normal" />
              </FormItem>
            )}
          />
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
                <FormMessage className=" text-xs font-normal" />
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

                <FormMessage className=" text-xs font-normal" />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className=" w-full  bg-rcsDarkColor hover:bg-rcsDarkColor/90"
        >
          {!form.formState.isSubmitting ? (
            "Update Password"
          ) : (
            <span className=" flex  items-center  gap-2">
              {"Updating Password "}
              <CircularBars size="micro" speed="average" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default ChangeUserPasswordForm

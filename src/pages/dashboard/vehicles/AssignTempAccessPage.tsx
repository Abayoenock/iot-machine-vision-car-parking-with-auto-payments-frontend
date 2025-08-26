import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { tempAccessSchema } from "@/lib/types"
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
import toast from "react-hot-toast"

import "react-phone-number-input/style.css"

import { Input } from "@/components/ui/input"
import CircularBars from "@/components/loaders/spinner/circularBars/CircularBars"

import { vehicle } from "./EditVehiclePage"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const AssignTempAccessPage = ({
  vehicleData,
  openSheet,
  setOpenSheet,
}: {
  vehicleData: vehicle
  openSheet: boolean
  setOpenSheet: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const form = useForm<z.infer<typeof tempAccessSchema>>({
    resolver: zodResolver(tempAccessSchema),
    defaultValues: {
      accessStart: undefined,
      accessEnd: undefined,
    },
  })

  async function onSubmit(data: z.infer<typeof tempAccessSchema>) {
    //const state = await reviewAction(data)
    console.log(data)
    const formattedData = {
      ...data,
      accessStart: new Date(data.accessStart),
      accessEnd: new Date(data.accessEnd),
    }
    console.log(formattedData);
   

    try {
      const response = await axios.post<any>(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/tempAccess/${
          vehicleData.vehicleID
        }`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}`,
          },
        }
      )

      console.log(response.data)

      if (response.data?.error) {
        return toast.error(response.data.error)
      }

      toast.success(response.data?.message)
      form.reset()
      setOpenSheet(false)
    } catch (err: any) {
      if (err.response.data.error) {
        return toast.error(err.response.data.error)
      }
      toast.error("An error occured please try again ")
    }
  }

  return (
    <Sheet open={openSheet} onOpenChange={() => setOpenSheet(false)}>
      <SheetTrigger className="hidden">Open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add tempory Access</SheetTitle>
          <SheetDescription>
            You are about to add a temporary access to vehicle with license
            plate {vehicleData.plateNumber}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 text-left px-4 pb-4"
          >
            <div className=" w-full grid grid-cols-1   gap-2  ">
              <FormField
                control={form.control}
                name="accessStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-xs">Access Start</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Choose the Date and time for start access"
                        type="datetime-local"
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
                name="accessEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-xs">
                      AccessEnd Date Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="choose  access End Date Time"
                        type={"datetime-local"}
                        {...field}
                        className=" focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-xs"
                      />
                    </FormControl>
                    <FormMessage className=" font-normal text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-rcsDarkColor hover:bg-rcsDarkColor/70  mb-4"
            >
              {!form.formState.isSubmitting ? (
                "Sace Access Record"
              ) : (
                <span className=" flex  items-center  gap-2">
                  {"Saving Access Record... "}
                  <CircularBars size="micro" speed="average" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
export default AssignTempAccessPage

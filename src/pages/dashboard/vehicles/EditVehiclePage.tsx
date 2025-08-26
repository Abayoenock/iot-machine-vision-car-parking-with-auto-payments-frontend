import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addVehicleShcema } from "@/lib/types"
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import toast from "react-hot-toast"

import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"

import { Input } from "@/components/ui/input"
import CircularBars from "@/components/loaders/spinner/circularBars/CircularBars"
import { useQueryClient } from "react-query"
export interface vehicle {
  vehicleID: string
  plateNumber: string
  model: string
  firstname: string
  lastname: string
  phone: string
  email?: string
  NID: string
}
const EditVehiclePage = ({
  vehicleData,
  openDrawer,
  setOpenDrawer,
}: {
  vehicleData: vehicle
  openDrawer: boolean
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const queryClient = useQueryClient()
  const handleRevalidate = () => {
    // Revalidate the query
    queryClient.invalidateQueries("/api/vehicles")
  }

  const form = useForm<z.infer<typeof addVehicleShcema>>({
    resolver: zodResolver(addVehicleShcema),
    defaultValues: {
      plateNumber: vehicleData.plateNumber,
      model: vehicleData.model,
      firstname: vehicleData.firstname,
      lastname: vehicleData.lastname,
      phone: vehicleData.phone,
      email: vehicleData.email,
      NID: vehicleData.NID,
    },
  })

  async function onSubmit(data: z.infer<typeof addVehicleShcema>) {
    console.log(data)
    try {
      const response = await axios.put<any>(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/vehicles/${
          vehicleData.vehicleID
        }`,
        data,
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
      handleRevalidate()
      toast.success(response.data?.message)
    } catch (err: any) {
      if (err.response.data.error) {
        return toast.error(err.response.data.error)
      }
      toast.error("An error occured please try again ")
    }
  }

  return (
    <Drawer open={openDrawer} onOpenChange={() => setOpenDrawer(false)}>
      <DrawerTrigger className=" hidden">Open</DrawerTrigger>
      <DrawerContent className="px-4 mx-auto lg:w-[60%] md:w-[80%] ">
        <DrawerHeader>
          <DrawerTitle>Edit Vehicle</DrawerTitle>
          <DrawerDescription className=" sr-only">
            Edit vehicle in the system{" "}
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 text-left px-4 pb-4"
          >
            <div className=" w-full grid grid-cols-1 md:grid-cols-2  gap-2  ">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-xs">Vehicle Model</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter vehicle model"
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
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-xs">
                      License Plate Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter  vehicle license plate"
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
                name={"firstname"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-xs">Firstname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter owner firstname "
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
                name={"lastname"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-xs">Lastname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter owner lastname"
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
                    <FormLabel className=" text-xs">NID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter owner natiaonal ID"
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
                name={"email"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-xs">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter owner email address "
                        type="email"
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
            </div>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-rcsDarkColor hover:bg-rcsDarkColor/70  mb-4"
            >
              {!form.formState.isSubmitting ? (
                "update Vehicle"
              ) : (
                <span className=" flex  items-center  gap-2">
                  {"updating Vehicle "}
                  <CircularBars size="micro" speed="average" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
export default EditVehiclePage

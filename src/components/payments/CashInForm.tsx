import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cashInSchema } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { FiInfo } from "react-icons/fi"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/currencyFormatter"

import { useEffect, useState } from "react"
import Spinner from "../loaders/spinner/hugeSpinner/Spinner"
import mqtt from "mqtt"
import { VscError } from "react-icons/vsc"
import { FiCheckCircle } from "react-icons/fi"
import { AccessTransaction } from "@/pages/payment/paymentPage"
import { useParams } from "react-router-dom"
import { useQueryClient } from "react-query"

const CashInForm = ({ data: accessData }: { data: AccessTransaction }) => {
  //@ts-ignore
  const vehicle = JSON.parse(accessData?.vehicle)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<string>("")
  const { id } = useParams()

  useEffect(() => {
    const mqtt_options = {
      username: import.meta.env.VITE_MQTT_USERNAME, // Replace with your MQTT username
      password: import.meta.env.VITE_MQTT_PASSWORD, // Replace with your MQTT password
    }
    let client = mqtt.connect(import.meta.env.VITE_MQTT_SERVER, mqtt_options) // WebSocket URL of the MQTT broker
    client.on("connect", () => {
      console.log("Connected to MQTT broker")
      const topic = `PAY/${id}`
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log("Subscribed to topic: ", topic)
        } else {
          console.error("Subscribe error:", err)
        }
      })
    })

    client.on("message", async (topic, message) => {
      const msg = message.toString()
      if (msg) {
        const jsonMessage = JSON.parse(msg)
        if (jsonMessage) {
          // on message arrival
          setStatus(jsonMessage.status)
          queryClient.invalidateQueries(`/api/report/accessDetails/${id}`)
        }

        // Clear the retained message after processing
        client.publish(topic, "", { retain: true }, (err) => {
          if (err) {
            console.error(`Error clearing retained message: ${err}`)
          } else {
            console.log(`Cleared retained message for topic: ${topic}`)
          }
        })
      }
    })
    return () => {
      client.end()
    }
  }, [])
  const form = useForm<z.infer<typeof cashInSchema>>({
    resolver: zodResolver(cashInSchema),
    defaultValues: {
      amount: accessData.amount_to_pay,
      plateNumber: vehicle.plateNumber,
      telecom: undefined,
      phone: "+250",
    },
  })

  const onSubmit = async (data: z.infer<typeof cashInSchema>) => {
    try {
      const response = await axios.post<any>(
        `${
          import.meta.env.VITE_BACKEND_ENDPOINT
        }/api/transactions/cashIn/${id}`,
        data
      )

      if (response.data?.error) {
        return toast.error(response.data.error)
      }
      console.log(response.data)

      setTransactionPending(true)

      //form.reset()
    } catch (err: any) {
      console.log(err)
      toast.error(
        err.response?.data?.error || "An error occurred, please try again"
      )
    }
  }

  return (
    <>
      {transactionPending && (
        <>
          <div className=" w-full">
            <div className=" text-sm">
              <p>
                A push confirmation pop up has been sent to your phone , follow
                the instructions to complete the transaction
              </p>
              <div className=" flex gap-3 items-center mt-3">
                <span>
                  <FiInfo className=" text-blue-300 text-3xl" />
                </span>
                <p>
                  If a push notification has not been sent , dial{" "}
                  <span className=" font-bold">
                    <a href="tel:*182*7*1#">*182*7*1#</a>
                  </span>{" "}
                </p>
              </div>
            </div>
            <div className=" w-full flex flex-col justify-center items-center p-12">
              {!status && (
                <>
                  <Spinner />
                  <div className=" mt-3">
                    <span>Waiting for you to confirm ...</span>
                  </div>
                </>
              )}
              {status == "failed" && (
                <>
                  <VscError className=" text-[80px] text-destructive" />
                  <div className=" mt-3">
                    <span className=" text-destructive">
                      Transaction has failed
                    </span>
                  </div>
                  {/* <RetryButton
                    initialCountdown={60}
                    buttonText="Retry"
                    retry={() => {
                      setTransactionPending(() => false)
                    }}
                  /> */}
                </>
              )}
              {status == "success" && (
                <>
                  <FiCheckCircle className=" text-[80px] text-green-500" />
                  <div className=" mt-3">
                    <span className=" text-green-500">
                      Transaction has sucessfuly completed
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      {!transactionPending &&
        (accessData.paymentStatus ? (
          <div className=" w-full flex justify-center flex-col items-center p-12">
            <FiCheckCircle className=" text-[80px] text-green-500" />
            <div className=" mt-3">
              <span className=" text-green-500">
                Your payment has been received successfuly, Thank you for using
                our system
              </span>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 text-left px-4 "
            >
              <div className="w-full  ">
                <h1 className=" mt-2">
                  Please provide the following details and proceed{" "}
                </h1>
              </div>
              <div className=" w-full grid grid-cols-1   gap-2  ">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 ">
                  <FormField
                    control={form.control}
                    name={"plateNumber"}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-xs">Plate Number</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            readOnly
                            placeholder="Enter your plate number"
                            {...field}
                            className=" focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-xs "
                          />
                        </FormControl>
                        <FormMessage className=" font-normal text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" text-xs">Amount</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            readOnly
                            placeholder="Enter amount in Rwf"
                            {...field}
                            value={
                              field.value ? formatCurrency(field.value) : ""
                            }
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(
                                /[^\d]/g,
                                ""
                              )
                              field.onChange(rawValue)
                            }}
                            className="focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 text-xs"
                          />
                        </FormControl>
                        <FormMessage className=" font-normal text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" col-span-2 w-full  flex justify-center ">
                  <FormField
                    control={form.control}
                    name={"telecom"}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Choose a payment Mode</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl className=" hidden">
                                <RadioGroupItem value="MTN" />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  "font-normal rounded-md border-4 border-transparent transition-all duration-300",
                                  field.value == "MTN" &&
                                    " border-4  border-rcsDarkColor/50 "
                                )}
                              >
                                <img
                                  src="/momo.svg"
                                  className=" w-[70px] rounded-sm "
                                />
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl className="hidden">
                                <RadioGroupItem value="Airtel" />
                              </FormControl>
                              <FormLabel
                                className={cn(
                                  "font-normal rounded-md border-4 border-transparent  transition-all duration-300",
                                  field.value == "Airtel" &&
                                    " border-4  border-rcsDarkColor/50 "
                                )}
                              >
                                <img
                                  src="/airtel.svg"
                                  className=" w-[70px] rounded-sm "
                                />
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className=" font-normal  text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" col-span-2 w-full">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Phone Number</FormLabel>
                        <FormControl>
                          <PhoneInput
                            placeholder="Enter phone number"
                            countries={["RW"]}
                            defaultCountry="RW"
                            countrySelectProps={{ disabled: true }}
                            international
                            {...field}
                            className=""
                          />
                        </FormControl>

                        <FormMessage className=" font-normal  text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className=" w-full flex justify-end">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className=" bg-rcsDarkColor"
                >
                  {!form.formState.isSubmitting ? (
                    "Send Money"
                  ) : (
                    <span className=" flex  items-center  gap-2">
                      {"Initating Transaction.. "}
                      <CircularBars size="micro" speed="average" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        ))}
    </>
  )
}
export default CashInForm

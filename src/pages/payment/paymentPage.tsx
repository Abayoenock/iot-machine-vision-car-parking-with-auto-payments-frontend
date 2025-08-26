import { useEffect } from "react"
import { CiKeyboard } from "react-icons/ci"
import { IoIosPhonePortrait } from "react-icons/io"
import { MdOutlineSms } from "react-icons/md"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BsInfoCircle } from "react-icons/bs"
import CashInForm from "@/components/payments/CashInForm"
import { useParams } from "react-router-dom"
import useFetch from "@/hooks/useFetch"
import PaymentsTable from "@/components/payments/PaymentsTable"
export type AccessTransaction = {
  AccessID: string
  entryTime: string // ISO date string
  exitTime: string | null // ISO date string or null
  amount_to_pay: string
  paymentStatus: boolean
  accessDurationMinutes: number | null
  vehicle: {
    vehicleID: string
    plateNumber: string
    firstname: string
    lastname: string
    phone: string
    email: string
    model: string
    NID: string
  }
  payments: {
    amount: number
    fee: number
    provider: string
    status: string
    processed_at: string // ISO datetime string
    initiated_at: string // ISO datetime string
    ref: string
    phone: string
  }[]
}

const PaymentPage = () => {
  const accessID = useParams().id

  const { data, loading } = useFetch(
    `/api/report/accessDetails/${accessID}`,
    false
  )
  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <div className=" w-full h-full md:h-[100dvh] ">
      <div className="container w-full px-4 md:px-12 grid gap-6 grid-cols-1  md:grid-cols-6 md:place-items-start  ">
        <Alert className=" mt-12 bg-yellow-100/10 text-yellow-700 col-span-6 ">
          <BsInfoCircle className="h-4 w-4  text-yellow-700" />
          <AlertTitle>Important Notice !</AlertTitle>
          <AlertDescription>
            This is not an offical System. This is a demo application for
            educational purposes only.
          </AlertDescription>
        </Alert>
        <div className=" w-full col-span-6 md:col-span-2  bg-blue-900/5 rounded-2xl border border-blue-900/5 overflow-hidden min-h-[350px]">
          <div className=" w-full p-3 ">
            <h1 className=" font-semibold text-lg text-center">
              Payment Made Easy
            </h1>
          </div>
          <div className=" w-full h-full bg-white rounded-t-2xl p-3">
            <div className=" py-6">
              <ul className=" flex flex-col gap-6 relative before:absolute before:w-[1px] before:h-full before:border-dashed before:border-l-[2px] before:border-rcsSilverColor before:-top-0 before:left-[11px] before:-z-1 ">
                <li className=" flex flex-col gap-3">
                  {" "}
                  <div className=" flex gap-3 items-center">
                    <div className=" w-[25px] h-[25px] rounded-full  bg-blue-900/90 z-[4] text-white flex justify-center items-center text-sm font-bold backdrop-blur-[2px] ">
                      1
                    </div>{" "}
                    <span className="font-semibold"> Fill in the Form</span>{" "}
                  </div>
                  <div className="flex gap-2 ml-[50px] items-center">
                    <div className=" ">
                      <CiKeyboard className=" text-[40px] text-blue-900" />
                    </div>
                    <p className="text-xs  w-[60%]">
                      Fill in the Form with the required details to initiate
                      payment
                    </p>
                  </div>
                </li>
                <li className=" flex flex-col gap-3">
                  {" "}
                  <div className=" flex gap-3 items-center">
                    <div className=" w-[25px] h-[25px] rounded-full bg-blue-900/90 z-[4] text-white flex justify-center items-center text-sm font-bold ">
                      2
                    </div>{" "}
                    <span className="font-semibold">Confirm the Payment</span>{" "}
                  </div>
                  <div className=" flex gap-2 ml-[50px] items-center">
                    <div className=" ">
                      <IoIosPhonePortrait className=" text-[40px] text-blue-900" />
                    </div>
                    <p className="text-xs  w-[60%]">
                      Confirm the push notification to complete the Transaction
                    </p>
                  </div>
                </li>
                <li className=" flex flex-col gap-3">
                  {" "}
                  <div className=" flex gap-3 items-center">
                    <div className=" w-[25px] h-[25px] rounded-full bg-blue-900/90 z-[4] text-white flex justify-center items-center text-sm font-bold ">
                      3
                    </div>{" "}
                    <span className="font-semibold">Get Cofirmation SMS </span>{" "}
                  </div>
                  <div className=" flex gap-2 ml-[50px] items-center">
                    <div className=" ">
                      <MdOutlineSms className=" text-[40px] text-blue-900" />
                    </div>
                    <p className="text-xs  w-[60%] ">
                      A confirmation SMS is sent to your number
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className=" w-full col-span-6  md:col-span-4 bg-blue-900/5 rounded-2xl p-4">
          {data && (
            //@ts-ignore
            <CashInForm data={data} />
          )}
          {loading && <div>Loading...</div>}
          {!data && !loading && (
            <div className=" w-full h-full flex justify-center items-center">
              <p className=" text-gray-500">No Data Available</p>
            </div>
          )}
        </div>
        <div className=" w-full col-span-6 ">
          {
            //@ts-ignore
            data?.payments?.length > 0 && (
              <div className=" w-full mb-6">
                <h1 className=" font-bold pb-6 px-3">
                  Initiated Transactions{" "}
                </h1>
                <PaymentsTable
                  payments={
                    //@ts-ignore
                    JSON.parse(data?.payments)
                  }
                />
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default PaymentPage

import ReportSortSelector from "@/components/dashboardLayOut/ReportSortSelector"
import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"
import { getToday } from "@/lib/filterDateGenerator"
//@ts-ignore
import { CSVLink } from "react-csv"
import { Button } from "@/components/ui/button"
import { PiMicrosoftExcelLogoFill } from "react-icons/pi"
import PrintComponent from "@/components/printableTable/PrintComponent"

import TableSkeleton from "@/components/loaders/TableSkeleton"
import TransactionTable from "@/components/reports/TransactionsReportTable"

export type AccessRecord = {
  AccessID: string
  entryTime: string // ISO date string
  exitTime: string // may be null if not exited yet
  vehicleID: string
  amount_to_pay: number | null
  accessDurationHours: number
  plateNumber: string
  firstname: string
  lastname: string
  phone: string
  email: string
  model: string
  NID: string
  payment_phone: string
  provider: string
  status: "pending" | "paid" | "failed" | string // adjust to known statuses
  processed_at: string
  ref: string
  initiated_at: string
  paid_amount: string | number
  fee: string | number
}

function convertArray(data: AccessRecord[]) {
  // Define the header row
  const newFormat = [
    [
      "#",
      "Access ID",
      "License Plate",
      "Vehicle ID",
      "Vehicle Model",
      "First Name",
      "Last Name",
      "Phone",
      "Email",
      "National ID",
      "Access Start",
      "Access End",
      "Access Duration (hours)",
      "Amount to Pay",
      "Paid Amount",
      "Fee",
      "Payment Phone",
      "Payment Provider",
      "Status",
      "Reference",
      "Initiated At",
      "Processed At",
    ],
  ]

  // Map the AccessRecord data into the new format
  data?.forEach((item: AccessRecord, index: number) => {
    newFormat.push([
      (index + 1).toString(),
      item.AccessID,
      item.plateNumber,
      item.vehicleID,
      item.model,
      item.firstname,
      item.lastname,
      item.phone,
      item.email,
      item.NID,
      item.entryTime,
      item?.exitTime?.toString(),
      item.accessDurationHours.toString(),
      item.amount_to_pay !== null ? item.amount_to_pay.toString() : "",
      item.paid_amount?.toString(),
      item.fee?.toString(),
      item.payment_phone,
      item.provider,
      item.status,
      item.ref,
      item.initiated_at,
      item.processed_at,
    ])
  })

  return newFormat
}

const TransactionsPage = () => {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const initialDate = getToday()
  const { data, loading, refetch } = useFetch<any>(
    `/api/report/transactions?start=${startDate || initialDate.start}&end=${
      endDate || initialDate.end
    }`,
    true,
    false
  )
  useEffect(() => {
    refetch()
  }, [startDate, endDate, refetch])
  const FetchedData = data?.data
  const columnsTable = [
    { key: "AccessID", displayName: "Access ID" },
    { key: "plateNumber", displayName: "License Plate" },
    { key: "vehicleID", displayName: "Vehicle ID" },
    { key: "model", displayName: "Vehicle Model" },
    { key: "firstname", displayName: "First Name" },
    { key: "lastname", displayName: "Last Name" },
    { key: "phone", displayName: "Phone" },
    { key: "email", displayName: "Email" },
    { key: "NID", displayName: "National ID" },
    { key: "entryTime", displayName: "Access Start" },
    { key: "exitTime", displayName: "Access End" },
    { key: "accessDurationHours", displayName: "Access Duration (hours)" },
    { key: "amount_to_pay", displayName: "Amount to Pay" },
    { key: "paid_amount", displayName: "Paid Amount" },
    { key: "fee", displayName: "Fee" },
    { key: "payment_phone", displayName: "Payment Phone" },
    { key: "provider", displayName: "Payment Provider" },
    { key: "status", displayName: "Status" },
    { key: "ref", displayName: "Reference" },
    { key: "initiated_at", displayName: "Initiated At" },
    { key: "processed_at", displayName: "Processed At" },
  ]
  return (
    <div className=" w-full pt-3 px-8">
      <div className=" flex gap-2">
        <ReportSortSelector
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>

      <div className="w-full flex justify-end gap-3  mt-3">
        {FetchedData && FetchedData?.length > 0 && (
          <PrintComponent data={FetchedData} columns={columnsTable} />
        )}
        {FetchedData && FetchedData?.length > 0 && (
          <CSVLink
            data={convertArray(FetchedData)}
            filename={`${import.meta.env.VITE_APPNAME}-report-${
              new Date().toISOString().split("T")[0]
            }.csv`}
          >
            <Button
              size={"sm"}
              variant={"secondary"}
              className=" flex items-center gap-2 text-xs"
            >
              {" "}
              <PiMicrosoftExcelLogoFill />
              CSV Download
            </Button>
          </CSVLink>
        )}
      </div>
      <div className=" w-full grid grid-cols-2 gap-3 mt-8">
        <div className=" col-span-2">
          {loading && <TableSkeleton columns={13} rows={6} />}
          {!loading && <TransactionTable data={FetchedData} />}
        </div>
      </div>
    </div>
  )
}

export default TransactionsPage

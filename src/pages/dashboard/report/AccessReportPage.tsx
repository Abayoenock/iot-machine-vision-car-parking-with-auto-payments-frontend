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

import AccessReportTable from "@/components/reports/AccessReportTable"

export interface AccessRecordType {
  AccessID: string
  entryTime: string // ISO Date string
  exitTime: string // ISO Date string
  paymentStatus: number
  amount: string
  accessDurationHours: number
  vehicleID: string
  plateNumber: string
  firstname: string
  lastname: string
  phone: string
  email: string
  model: string
  NID: string
}

function convertArray(data: AccessRecordType[]) {
  // Define the new format header
  const newFormat = [
    [
      "#",
      "AccessID",
      "Plate Number",
      "Vehicle ID",
      "Owner Firstname",
      "Owner Lastname",
      "Phone",
      "Email",
      "NID",
      "Vehicle Model",
      "Entry Time",
      "Exit Time",
      "Access Duration (hours)",
      "Payment Status",
      "Amount",
    ],
  ]

  // Iterate over the original data array and push the required values to the new format
  data?.forEach((item: AccessRecordType, index: number) => {
    newFormat.push([
      (index + 1).toString(),
      item.AccessID,
      item.plateNumber,
      item.vehicleID,
      item.firstname,
      item.lastname,
      item.phone,
      item.email,
      item.NID,
      item.model,
      item.entryTime,
      item.exitTime,
      item.accessDurationHours?.toString() ?? "---",
      item.paymentStatus.toString(),
      item.amount,
    ])
  })

  return newFormat
}

const AccessReportPage = () => {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const initialDate = getToday()
  const { data, loading, refetch } = useFetch<any>(
    `/api/report/accessReport?start=${startDate || initialDate.start}&end=${
      endDate || initialDate.end
    }`,
    true,
    false
  )
  useEffect(() => {
    refetch()
  }, [startDate, endDate, refetch])

  const FetchedData = data?.data
  console.log(FetchedData)

  const columnsTable = [
    { key: "plateNumber", displayName: "License Plate" },
    { key: "firstname", displayName: "Owner Firstname" },
    { key: "lastname", displayName: "Owner Lastname" },
    { key: "entryTime", displayName: "Entry Time" },
    { key: "exitTime", displayName: "Exit Time" },
    { key: "accessDurationHours", displayName: "Access Duration (hours)" },
    { key: "paymentStatus", displayName: "Payment Status" },
    { key: "amount", displayName: "Amount" },
    { key: "vehicleID", displayName: "Vehicle ID" },
    { key: "AccessID", displayName: "Access ID" },
    { key: "phone", displayName: "Phone" },
    { key: "email", displayName: "Email" },
    { key: "model", displayName: "Vehicle Model" },
    { key: "NID", displayName: "National ID" },
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
          {loading && <TableSkeleton columns={7} rows={6} />}
          {!loading && <AccessReportTable data={FetchedData} />}
        </div>
      </div>
    </div>
  )
}

export default AccessReportPage

import { useEffect, useState } from "react"
import { TableColumn } from "react-data-table-component/dist/DataTable/types"
import DataTable from "react-data-table-component"
import { Badge } from "../ui/badge"
import { customStyles } from "@/lib/tableStyles"

import { formatDateTime, formatDuration } from "@/lib/DateTimeFormatter"

import { AccessRecordType } from "@/pages/dashboard/report/AccessReportPage"
import { formatCurrency } from "@/lib/currencyFormatter"
const AccessReportTable = ({
  data,
}: {
  data: AccessRecordType[] | undefined
}) => {
  const [tableData, setTableData] = useState<AccessRecordType[]>()

  useEffect(() => {
    setTableData(data)
  }, [data])

  const columns = [
    {
      name: "License Plate ",
      selector: (row: any) => row.plateNumber,
      sortable: true,
    },

    {
      name: "Vehicle Owner",
      selector: (row: any) => row.firstname + " " + row.lastname,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row: any) => row.phone,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
      grow: 2,
    },
    {
      name: "Entry Time",
      selector: (row: any) => formatDateTime(row.entryTime),
      sortable: true,
      grow: 2,
    },
    {
      name: "Exit Time",
      selector: (row: any) =>
        row.exitTime ? formatDateTime(row.exitTime) : "------",
      sortable: true,
      grow: 2,
    },
    {
      name: "Access Duration",
      selector: (row: any) =>
        row.accessDurationHours
          ? formatDuration(row.accessDurationHours)
          : "---",
      sortable: true,
      grow: 2,
    },
    {
      name: "Amount",
      selector: (row: any) => (row.amount ? formatCurrency(row.amount) : "---"),
      sortable: true,
      grow: 2,
    },

    {
      name: "Status",
      cell: (row: AccessRecordType) => (
        <div className=" p-1">
          {row.exitTime ? (
            <>
              <Badge className=" bg-red-100 text-red-700 hover:bg-red-100">
                {" "}
                Exited
              </Badge>
            </>
          ) : (
            <Badge className=" bg-yellow-100 text-yellow-700 hover:bg-green-100">
              {" "}
              Still In
            </Badge>
          )}
        </div>
      ),
    },
    {
      name: "Payment Status",
      cell: (row: any) => (
        <div className=" p-1">
          {row.paymentStatus == 0 ? (
            <Badge className=" bg-yellow-100 text-yellow-700 hover:bg-green-100">
              {" "}
              Pending
            </Badge>
          ) : (
            <>
              <Badge className=" bg-green-100 text-green-700 hover:bg-green-100">
                {" "}
                paid
              </Badge>
            </>
          )}
        </div>
      ),
    },
  ] as unknown as TableColumn<any>[]

  return (
    <>
      <DataTable
        columns={columns}
        //@ts-ignore
        data={tableData}
        selectableRows={true}
        keyField={"tAccessID"}
        onSelectedRowsChange={() => console.log("selected")}
        selectableRowsHighlight={true}
        pointerOnHover={false}
        pagination
        customStyles={customStyles}
        striped={true}
        dense={true}
        responsive={true}
        contextMessage={{
          singular: "data",
          plural: "data",
          message: "selected",
        }}
      />
    </>
  )
}

export default AccessReportTable

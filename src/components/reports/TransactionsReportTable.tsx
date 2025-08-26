import { useEffect, useState } from "react"
import { TableColumn } from "react-data-table-component/dist/DataTable/types"
import DataTable from "react-data-table-component"
import { Badge } from "../ui/badge"
import { customStyles } from "@/lib/tableStyles"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AccessRecord } from "@/pages/dashboard/report/TransactionsPage"
import { formatDateTime, formatDuration } from "@/lib/DateTimeFormatter"
import { CiMenuKebab } from "react-icons/ci"
import { Button } from "../ui/button"
import useUpdate from "@/hooks/useUpdate"
import { formatCurrency } from "@/lib/currencyFormatter"
const TransactionsReportTable = ({
  data,
}: {
  data: AccessRecord[] | undefined
}) => {
  const [selectedAccess, setSelectedAccess] = useState<AccessRecord>()
  const [tableData, setTableData] = useState<AccessRecord[]>()
  const [open, setOpen] = useState<boolean>(false)
  const { loading: updateLoading, updateData } = useUpdate(
    `/api/tempAccess/${selectedAccess?.ref}`,
    true
  )
  useEffect(() => {
    console.log(data)
    setTableData(data)
  }, [data])

  const columns = [
    {
      name: "Transaction Ref ",
      selector: (row: any) => row.ref,
      sortable: true,
    },
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
      name: "Access Start",
      selector: (row: any) => formatDateTime(row.entryTime),
      sortable: true,
    },
    {
      name: "Access End",
      selector: (row: any) => formatDateTime(row.exitTime),
      sortable: true,
    },
    {
      name: "Access Duration",
      selector: (row: any) => formatDuration(row.accessDurationHours),
      sortable: true,
    },
    {
      name: "phone Number",
      selector: (row: any) => row.payment_phone,
      sortable: true,
    },
    {
      name: "Provider",
      selector: (row: any) => row.provider,
      sortable: true,
    },

    {
      name: "Amount",
      selector: (row: any) => formatCurrency(row.paid_amount),
      sortable: true,
    },
    {
      name: "fee",
      selector: (row: any) => formatCurrency(row.fee),
      sortable: true,
    },

    {
      name: "Date & Time ",
      selector: (row: any) => formatDateTime(row["initiated_at"]),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: any) => (
        <div className=" p-1">
          {row.status == "failed" ? (
            <>
              <Badge className=" bg-red-100 text-red-700 hover:bg-red-100">
                {" "}
                Failed
              </Badge>
            </>
          ) : row.status == "pending" ? (
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
    {
      name: "Actions",

      cell: (row: any) => (
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className=" outline-none focus:outline-none">
              <CiMenuKebab />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2"
                disabled={new Date(row.accessEnd) < new Date()}
                onClick={() => {
                  setSelectedAccess(() => row)
                  setOpen(true)
                }}
              >
                Check Payment Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
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
      {/* ==================================== revokeModel============= */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you want to revoke access for vehicle with{" "}
              {selectedAccess?.plateNumber}?
            </AlertDialogTitle>
            <AlertDialogDescription className=" text-justify">
              This will revoke the temporary access given to{" "}
              {selectedAccess?.plateNumber}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs p-2 px-4 h-9 ring-0 focus:ring-0">
              Cancel
            </AlertDialogCancel>
            <Button
              size={"sm"}
              variant={"destructive"}
              disabled={updateLoading}
              onClick={() => {
                updateData({})
              }}
            >
              {updateLoading ? "Changing Status..." : "Chnage status"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default TransactionsReportTable

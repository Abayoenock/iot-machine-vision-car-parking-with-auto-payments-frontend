import useFetch from "@/hooks/useFetch"
import DataTable, { TableColumn } from "react-data-table-component"

import { GoTrash } from "react-icons/go"
import { TbLockCancel } from "react-icons/tb"
import { TfiPencil } from "react-icons/tfi"
import { CiMenuKebab } from "react-icons/ci"
import { Badge } from "@/components/ui/badge"
import { TbLockOpen2 } from "react-icons/tb"
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
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import useDelete from "@/hooks/useDelete"
import TableSkeleton from "@/components/loaders/TableSkeleton"
import { cn } from "@/lib/utils"
import useUpdate from "@/hooks/useUpdate"
import AddVehiclePage from "./addVehiclePage"
import EditVehiclePage from "./EditVehiclePage"
import { BsCalendar2Range } from "react-icons/bs"
import AssignTempAccessPage from "./AssignTempAccessPage"

const customStyles = {
  rows: {
    style: {
      minHeight: "40px", // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px", // override the cell padding for head cells
      paddingRight: "8px",
      fontSize: "12px",
    },
  },
  cells: {
    style: {
      paddingLeft: "4px", // override the cell padding for data cells
      paddingRight: "4px",
      fontSize: "12px",
    },
  },
}

const VehiclesPage = () => {
  const { data, loading, error } = useFetch<any>("/api/vehicles", true)
  const [open, setOpen] = useState(false)
  const [openBlock, setOpenBlock] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const {
    loading: deleteLoading,

    success,
    deleteData,
  } = useDelete(`/api/vehicles/${selectedVehicle?.vehicleID}`, true)

  const {
    loading: updateLoading,
    success: updateSuccess,
    updateData,
  } = useUpdate(
    `/api/vehicles/changeStatus/${selectedVehicle?.vehicleID}`,
    true
  )

  // runs when thd delete was sucessful
  useEffect(() => {
    if (success) {
      setOpen(() => false)
      // filter vehicles to remove the deleted vehicle
      const filteredVehicles = vehicles.filter(
        (vehicle: any) => vehicle?.vehicleID != selectedVehicle.vehicleID
      )
      setVehicles(() => filteredVehicles)
    }
  }, [success])

  useEffect(() => {
    if (updateSuccess) {
      setOpenBlock(() => false)
      // filter vehicles to remove the deleted vehicle
      const filteredVehicles = vehicles.map((vehicle: any) => {
        if (vehicle.vehicleID == selectedVehicle.vehicleID) {
          vehicle.isBlocked = !vehicle.isBlocked
        }
        return vehicle
      })
      setVehicles(() => filteredVehicles)
    }
  }, [updateSuccess])

  // runs when the vehicles are fetched from the database
  useEffect(() => {
    setVehicles(() => data?.data)
  }, [data])

  //============= columns for the vehicles table
  const columns = [
    {
      name: "Model",
      selector: (row: any) => row["model"],
      sortable: true,
    },
    {
      name: "license Plate Number",
      selector: (row: any) => row["plateNumber"],
      sortable: true,
    },

    {
      name: "Owner",
      selector: (row: any) => row["firstname"] + " " + row["lastname"],
    },
    {
      name: "NID",
      selector: (row: any) => row["NID"],
    },
    {
      name: "Email",
      selector: (row: any) => row["email"],
    },
    {
      name: "phoneNumber",
      selector: (row: any) => row["phone"],
    },

    {
      name: " status",
      cell: (row: any) => (
        <Badge
          className={
            (cn(" text-[10px] "),
            row["isBlocked"]
              ? " bg-red-200 text-red-700"
              : "bg-green-200 text-green-700")
          }
        >
          {row["isBlocked"] ? "Blocked" : "Active"}
        </Badge>
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
                className=" gap-2 cursor-pointer"
                onClick={() => {
                  setSelectedVehicle(() => row)
                  setOpenDrawer(true)
                }}
              >
                <TfiPencil />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className=" gap-2"
                onClick={() => {
                  setSelectedVehicle(() => row)
                  setOpen(() => true)
                }}
              >
                {" "}
                <GoTrash className=" text-red-500" /> Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2"
                onClick={() => {
                  setSelectedVehicle(() => row)
                  setOpenBlock(true)
                }}
              >
                {" "}
                {row.isBlocked ? <TbLockOpen2 /> : <TbLockCancel />}
                {row.isBlocked ? "Unblock" : "Block"}
              </DropdownMenuItem>
              {row.isTemporary ? (
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => {
                    setSelectedVehicle(() => row)
                    setOpenSheet(true)
                  }}
                >
                  <BsCalendar2Range />
                  Grant Temporary Access
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      ignoreRowClick: true,
      allowoverflow: true,
    },
  ] as unknown as TableColumn<any>[]
  return (
    <div className=" w-full p-2  ">
      <div className="w-full flex justify-end">
        <AddVehiclePage />
        {openDrawer && (
          <EditVehiclePage
            vehicleData={selectedVehicle}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
          />
        )}

        {openSheet && (
          <AssignTempAccessPage
            vehicleData={selectedVehicle}
            openSheet={openSheet}
            setOpenSheet={setOpenSheet}
          />
        )}
      </div>
      {/* =============================Delete vehicle dialog ===================== */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you want to delete vehicle with {selectedVehicle?.plateNumber}
              ?
            </AlertDialogTitle>
            <AlertDialogDescription className=" text-justify">
              This action cannot be undone. This will permanently delete{" "}
              {selectedVehicle?.plateNumber}'s account and remove all vehicle
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs p-2 px-4 h-9 ring-0 focus:ring-0">
              Cancel
            </AlertDialogCancel>
            <Button
              size={"sm"}
              variant={"destructive"}
              disabled={deleteLoading}
              onClick={() => {
                deleteData()
              }}
            >
              {deleteLoading ? "Deleting Vehicle..." : "Delete Vehicle"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* =============================Block  vehicle dialog ===================== */}
      <AlertDialog open={openBlock} onOpenChange={setOpenBlock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to{" "}
              {selectedVehicle?.isBlocked ? "Unblock" : "block"}{" "}
              {selectedVehicle?.plateNumber} from antering or exiting
              insititution?
            </AlertDialogTitle>
            <AlertDialogDescription className=" text-justify">
              {selectedVehicle?.isBlocked
                ? `You are about to unblock
              ${selectedVehicle?.plateNumber} , they can now access the system .`
                : `You are about to block
              ${selectedVehicle?.plateNumber} , and can no longer be able to enter the  system`}
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
              {deleteLoading ? "Updating status..." : "Update status"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading && <TableSkeleton columns={7} rows={5} />}
      {error && <h1>{error}</h1>}
      {data && (
        <div className=" w-full mt-8 ">
          <DataTable
            columns={columns}
            data={vehicles}
            selectableRows={true}
            keyField={"_id"}
            onSelectedRowsChange={() => console.log("selected")}
            selectableRowsHighlight={true}
            pointerOnHover={false}
            pagination
            customStyles={customStyles}
            striped={true}
            dense={true}
            responsive={true}
            contextMessage={{
              singular: "vehicle",
              plural: "vehicles",
              message: "selected",
            }}
          />
        </div>
      )}
    </div>
  )
}

export default VehiclesPage

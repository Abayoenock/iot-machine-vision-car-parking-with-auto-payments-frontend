import useFetch from "@/hooks/useFetch"
import DataTable, { TableColumn } from "react-data-table-component"
import { FiUserPlus } from "react-icons/fi"
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
import { Link } from "react-router-dom"
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

const UsersPage = () => {
  const { data, loading, error } = useFetch<any>("/api/auth/users", true)
  const [open, setOpen] = useState(false)
  const [openBlock, setOpenBlock] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])

  const {
    loading: deleteLoading,

    success,
    deleteData,
  } = useDelete(`/api/auth/delete-user-account/${selectedUser?._id}`, true)

  const {
    loading: updateLoading,

    success: updateSuccess,
    updateData,
  } = useUpdate(`/api/auth/blockUser/${selectedUser?._id}`, true)

  // runs when thd delete was sucessful
  useEffect(() => {
    if (success) {
      setOpen(() => false)
      // filter users to remove the deleted user
      const filteredUsers = users.filter(
        (user: any) => user?._id != selectedUser._id
      )
      setUsers(() => filteredUsers)
    }
  }, [success])

  useEffect(() => {
    if (updateSuccess) {
      setOpenBlock(() => false)
      // filter users to remove the deleted user
      const filteredUsers = users.map((user: any) => {
        if (user._id == selectedUser._id) {
          user.isBlocked = !user.isBlocked
        }
        return user
      })
      setUsers(() => filteredUsers)
    }
  }, [updateSuccess])

  // runs when the users are fetched from the database
  useEffect(() => {
    setUsers(() => data?.data)
  }, [data])

  //============= columns for the users table
  const columns = [
    {
      name: "Firstname",
      selector: (row: any) => row["firstname"],
      sortable: true,
    },
    {
      name: "Lastname",
      selector: (row: any) => row["lastname"],
      sortable: true,
    },

    {
      name: "Phone",
      selector: (row: any) => row["phone"],
    },
    {
      name: "Email",
      selector: (row: any) => row["email"],
      wrap: true,
      grow: 2,
    },
    {
      name: "Privilages",
      selector: (row: any) => (row["role"] == 0 ? "Admin" : "Security Officer"),
    },
    {
      name: "Status",
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
              <Link to={`./${row._id}`} className=" w-full cursor-pointer">
                <DropdownMenuItem className=" gap-2 cursor-pointer">
                  <TfiPencil />
                  Edit
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                className=" gap-2"
                onClick={() => {
                  setSelectedUser(() => row)
                  setOpen(true)
                }}
              >
                {" "}
                <GoTrash className=" text-red-500" /> Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2"
                onClick={() => {
                  setSelectedUser(() => row)
                  setOpenBlock(true)
                }}
              >
                {" "}
                {row.isBlocked ? <TbLockOpen2 /> : <TbLockCancel />}
                {row.isBlocked ? "Unblock" : "Block"}
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
    <div className=" w-full p-2  ">
      <div className="w-full flex justify-end">
        <Link
          to={"./new"}
          className="inline-flex gap-2 items-center justify-center whitespace-nowrap  text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 rounded-md px-3 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <FiUserPlus />
          Create User
        </Link>
      </div>
      {/* =============================Delete user dialog ===================== */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you want to delete {selectedUser?.firstname}'s account?
            </AlertDialogTitle>
            <AlertDialogDescription className=" text-justify">
              This action cannot be undone. This will permanently delete{" "}
              {selectedUser?.firstname}'s account and remove all user data from
              our servers.
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
              {deleteLoading ? "Deleting User..." : "Delete Account"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* =============================Block  user dialog ===================== */}
      <AlertDialog open={openBlock} onOpenChange={setOpenBlock}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you want to {selectedUser?.isBlocked ? "Unblock" : "block"}{" "}
              {selectedUser?.firstname}'s account?
            </AlertDialogTitle>
            <AlertDialogDescription className=" text-justify">
              {selectedUser?.isBlocked
                ? `You are about to unblock
              ${selectedUser?.firstname}'s account , they can now login in the system .`
                : `You are about to block
              ${selectedUser?.firstname}'s account , He/she can no longer be able to login in the system`}
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
            data={users}
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
              singular: "user",
              plural: "users",
              message: "selected",
            }}
          />
        </div>
      )}
    </div>
  )
}

export default UsersPage

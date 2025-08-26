import UpdateProfileForm from "@/components/auth/updateProfileForm"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import useFetch from "@/hooks/useFetch"
import ChangeUserPasswordForm from "@/components/auth/changeUserPasswordForm "

const ProfilePage = () => {
  const { data, loading, error } = useFetch<any>(`/api/auth/user`, true)

  return (
    <div className=" w-full px-2 md:px-12 pt-8 ">
      {loading && <Skeleton className=" w-full min-h-[300px]" />}
      {error && <h2>Error while loading User </h2>}
      {data && (
        <div className=" w-full flex flex-col ga-3">
          <div className=" w-full flex justify-end">
            <Dialog>
              <DialogTrigger>
                {" "}
                <span className=" w-fit duration-300 border-[1px] rounded-md p-2 h-9 text-sm bg-gray-200 hover:-translate-y-1 hover:text-white hover:bg-gray-800 ">
                  Change Password
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <ChangeUserPasswordForm />
              </DialogContent>
            </Dialog>
          </div>
          <UpdateProfileForm userData={data?.data} />
        </div>
      )}
    </div>
  )
}

export default ProfilePage

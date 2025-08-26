import EdituserForm from "@/components/auth/editUserForm"
import { Skeleton } from "@/components/ui/skeleton"
import useFetch from "@/hooks/useFetch"
import { useLocation } from "react-router-dom"

const EditUserPage = () => {
  const location = useLocation()
  const pathName = location.pathname.split("/")
  const userID = pathName[pathName.length - 1]
  const { data, loading, error } = useFetch<any>(
    `/api/auth/user/${userID}`,
    true
  )
  console.log(data)

  return (
    <div className=" w-full px-2 md:px-12 pt-8 ">
      {loading && <Skeleton className=" w-full min-h-[300px]" />}
      {error && <h2>Error while loading User </h2>}
      {data && <EdituserForm userData={data.data} />}
    </div>
  )
}

export default EditUserPage

import DotLarge from "@/components/loaders/dotLoaders/large"

import ParkingSettingsForm from "@/components/settings/SettingsForm"
import useFetch from "@/hooks/useFetch"

const SettingsPage = () => {
  const { data, loading } = useFetch<any>("/api/settings", true)

  return (
    <div>
      {loading && (
        <div className=" w-full h-[500px] flex justify-center items-center">
          <DotLarge />
        </div>
      )}
      {data && <ParkingSettingsForm data={data} />}
    </div>
  )
}

export default SettingsPage

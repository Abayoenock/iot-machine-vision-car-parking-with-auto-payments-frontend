import { useForm, Controller } from "react-hook-form"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarClock, Settings, ParkingCircle } from "lucide-react"
import ParkingFeeSettings from "./SettingsFees"
import axios from "axios"
import toast from "react-hot-toast"

type ParkingSettings = {
  available_spaces: number
  onlyTimeSpent: boolean
  inService: boolean
  serviceStart: string | null
  serviceEnd: string | null
  pricePerHour?: number | null // ✅ added
}

type Props = {
  settings: ParkingSettings
  fees: [any]
}

export default function ParkingSettingsForm({ data }: { data: Props }) {
  const [initialValues, setInitialValues] = useState<ParkingSettings>({
    available_spaces: data.settings.available_spaces,
    onlyTimeSpent: data.settings.onlyTimeSpent,
    inService: data.settings.inService,
    serviceStart: data.settings.serviceStart,
    serviceEnd: data.settings.serviceEnd,
    pricePerHour: data.settings.pricePerHour || 0,
  })

  const { register, handleSubmit, watch, control, reset, setValue } =
    useForm<ParkingSettings>({
      defaultValues: initialValues,
    })

  const values = watch()
  const [isChanged, setIsChanged] = useState(false)

  // detect changes
  useEffect(() => {
    setIsChanged(JSON.stringify(values) !== JSON.stringify(initialValues))
  }, [values, initialValues])

  const onSubmit = async (data: ParkingSettings) => {
    console.log("Updated:", data)
    setInitialValues(data)
    reset(data) // reset change tracker
    try {
      const reponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/settings`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}`,
          },
        }
      )
      toast.success("Settings updated")
      console.log(reponse)
    } catch (err) {
      console.log(err)
      toast.error("Failed to update settings")
    }
  }

  return (
    <div className="w-full flex px-12 py-8">
      <Card className="max-w-lg p-4 shadow-lg rounded-2xl">
        <CardHeader className="flex items-center space-x-2">
          <Settings className="w-12 h-12 text-blue-600" />
          <h2 className="text-xl font-semibold">Parking Settings</h2>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Available Spaces */}
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <ParkingCircle className="w-4 h-4 text-gray-600" />
              Available Spaces
            </Label>
            <Input
              type="number"
              {...register("available_spaces", { valueAsNumber: true })}
            />
            <p className="text-sm text-gray-500">
              Total number of parking slots available.
            </p>
          </div>

          {/* Billing Mode Switch */}
          <div className="space-y-3 p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-gray-600" />
                <div>
                  <Label>Billing Mode</Label>
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold">ON:</span> billing based on
                    time spent (per hour).
                    <span className="font-semibold"> OFF:</span> billing uses
                    interval brackets (e.g. {"<"}1h = 300, 1–2h = 500…).
                  </p>
                </div>
              </div>
              <Controller
                control={control}
                name="onlyTimeSpent"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Show price per hour input when ON */}
            {values.onlyTimeSpent ? (
              <div>
                <Label>Price Per Hour</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter hourly rate"
                  {...register("pricePerHour", { valueAsNumber: true })}
                />
                <p className="text-xs text-gray-500">
                  Set the rate charged per hour of parking.
                </p>
              </div>
            ) : null}
          </div>

          {/* In Service Checkbox */}
          <div className="space-y-2 p-2 border rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                defaultChecked={values.inService}
                className=" text-white"
                onCheckedChange={
                  (checked) => setValue("inService", checked === true) // ✅ use setValue here
                }
              />
              <Label>Service Period</Label>
            </div>
            <p className="text-xs text-gray-500">
              Define service start and end times when active.
            </p>

            {values.inService ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Service Start</Label>
                  <Input type="time" {...register("serviceStart")} />
                </div>
                <div>
                  <Label>Service End</Label>
                  <Input type="time" {...register("serviceEnd")} />
                </div>
              </div>
            ) : null}
          </div>

          {/* Update Button */}
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!isChanged}
            className="w-full"
          >
            Update Settings
          </Button>
        </CardContent>
      </Card>

      {!values.onlyTimeSpent && <ParkingFeeSettings fees={data.fees} />}
    </div>
  )
}

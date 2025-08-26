import { useEffect, useRef, useState } from "react"
import { BsCheck2All } from "react-icons/bs"
import { TbCameraCancel } from "react-icons/tb"
import { Button } from "../ui/button"
import AddVehiclePage from "@/pages/dashboard/vehicles/addVehiclePage"
import { cn } from "@/lib/utils"
import AssignTempAccessPage from "@/pages/dashboard/vehicles/AssignTempAccessPage"
import { GiTemporaryShield } from "react-icons/gi"
import mqtt, { MqttClient } from "mqtt"
import { Badge } from "../ui/badge"

const DetectedVehicles = ({ toggleGate }: { toggleGate: (gateStatus:boolean) => void }) => {
  const [detectedVehicle, SetDetecedVehicle] = useState<any>()
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  useEffect(() => {
    if (detectedVehicle?.registered && !detectedVehicle?.expired && !detectedVehicle?.isBlocked) {
      toggleGate(true)
    }else{
      toggleGate(false)
    }
  }, [detectedVehicle])

  const clientRef = useRef<MqttClient | null>(null)
  useEffect(() => {
    const mqtt_options = {
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
    }
    const client = mqtt.connect(import.meta.env.VITE_MQTT_SERVER, mqtt_options) // WebSocket URL of the MQTT broker
    clientRef.current = client
    client.on("connect", () => {
      console.log("Connected to MQTT broker")
      client.subscribe(import.meta.env.VITE_DETECTED_VEHICLE, (err) => {
        if (!err) {
          console.log(
            "Subscribed to topic: ",
            import.meta.env.VITE_DETECTED_VEHICLE
          )
        } else {
          console.error("Subscribe error:", err)
        }
      })
    })

    client.on("message", async (topic, message) => {
      const msg = message.toString()
      if (msg) {
        const jsonMessage = JSON.parse(msg)
        if (jsonMessage) {
          SetDetecedVehicle(() => jsonMessage)
        }

        // Clear the retained message after processing
        client.publish(topic, "", { retain: true }, (err) => {
          if (err) {
            console.error(`Error clearing retained message: ${err}`)
          } else {
            console.log(`Cleared retained message for topic: ${topic}`)
          }
        })
      }
    })

    return () => {
      client.end()
    }
  }, [])
  return (
    <div className=" w-full border border-blue-100 rounded-md ">
      {openSheet && (
        <AssignTempAccessPage
          vehicleData={detectedVehicle}
          openSheet={openSheet}
          setOpenSheet={setOpenSheet}
        />
      )}
      <div className=" w-full p-2 bg-blue-100 font-bold ">
        {" "}
        <div className=" flex gap-2 items-center">
          <img src="/icon.svg" alt="license plate" className="w-[50px]" />
          Detected License PLate
        </div>
      </div>
      <div className="w-full min-h-[70px]">
        <div className=" w-full flex flex-col justify-center items-center text-gray-600 text-xl p-4 ">
          {detectedVehicle ? (
            <>
              <div
                className={cn(
                  " w-full flex  rounded-md gap-2 items-center justify-between p-2 px-4 border border-dotted",
                  detectedVehicle?.registered
                    ? detectedVehicle?.expired
                      ? " bg-yellow-100"
                      : "bg-green-100"
                    : "bg-red-100"
                )}
              >
                <span
                  className={`text-${
                    detectedVehicle?.registered
                      ? detectedVehicle?.expired
                        ? "yellow"
                        : "green"
                      : "red"
                  }-700`}
                >
                  {detectedVehicle?.plate}
                </span>
                <span
                  className={`text-${
                    detectedVehicle?.registered ? "green" : "red"
                  }-500`}
                >
                  {detectedVehicle?.isBlocked?(<><Badge variant={"destructive"}>Blocked</Badge></>):   detectedVehicle?.registered ? (
                    detectedVehicle?.expired ? (
                      <Button
                        onClick={() => {
                          setOpenSheet(true)
                        }}
                        className=" transition-all duration-300 bg-yellow-900 hover:bg-yellow-950 gap-2"
                      >
                        <GiTemporaryShield />
                        Grant Temporary Access
                      </Button>
                    ) : (
                      <BsCheck2All />
                    )
                  ) : (
                    <AddVehiclePage licensePlate={detectedVehicle?.plate} />
                  )}
                </span>
              </div>

              <div className=""></div>
            </>
          ) : (
            <>
              <div className=" flex justify-center  gap-3 items-center ">
                <span>
                  <TbCameraCancel size={30} />
                </span>
                No vehicles detected
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetectedVehicles

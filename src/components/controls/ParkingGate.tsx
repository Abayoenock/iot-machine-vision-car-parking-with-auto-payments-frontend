import { useEffect, useRef } from "react"
import "./ParkingGate.css"
import { cn } from "@/lib/utils"
import mqtt, { MqttClient } from "mqtt"

const ParkingGate = ({
  isOpen,
  toggleGate,
}: {
  isOpen: boolean
  toggleGate: (gateStatus: boolean) => void
}) => {
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

    return () => {
      client.end()
    }
  }, [])
  const openCloseGate = () => {
    const mesg = { status: isOpen }
    console.log(mesg)

    clientRef?.current?.publish(
      "GATE/CHANGE_STATUS",
      JSON.stringify(mesg),
      (err) => {
        if (err) {
          console.error(`Error PUBLISHING THE MESSAGE: ${err}`)
        } else {
          console.log(`Message suucessfuly published`)
        }
      }
    )
  }
  return (
    <div
      className="gate-container"
      onClick={() => {
        const status = !isOpen
        toggleGate(status)
        openCloseGate()
      }}
    >
      <div className={`barrier ${isOpen ? "open" : "closed"}`}></div>
      <div
        className={cn(
          "post after:transition-all after:duration-1000 after:origin-center ",
          isOpen ? ` after:rotate-0 ` : ` after:rotate-90`
        )}
      ></div>
      <div className="support"></div>
    </div>
  )
}

export default ParkingGate

import { useState } from "react"
import DetectedVehicles from "./DetectedVehicles"
import ParkingGate from "./ParkingGate"

const GateControls = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleGate = (gateStatus: boolean) => {
    setIsOpen(gateStatus)
  }
  return (
    <div className=" w-full h-full relative ">
      <div className=" w-full md:px-4">
        <DetectedVehicles toggleGate={toggleGate} />
      </div>
      <div className=" md:absolute bottom-0 px-12 pt-[200px]">
        <ParkingGate isOpen={isOpen} toggleGate={toggleGate} />
      </div>
    </div>
  )
}

export default GateControls

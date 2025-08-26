import GateControls from "@/components/controls/GateControls"

import VideoStream from "./VideoStream"

const ControlPanelPage = () => {
  return (
    <div className=" w-full  grid grid-cols-1 md:grid-cols-2 min-h-[70vh] gap-2 p-4">
      <div className="w-full bg-gray-400 max-h-[65vh] flex justify-center items-center rounded-md overflow-hidden">
        <VideoStream />
      </div>
      <div className="">
        <GateControls />
      </div>
    </div>
  )
}

export default ControlPanelPage

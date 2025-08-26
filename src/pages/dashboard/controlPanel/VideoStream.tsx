import { VideoIcon } from "lucide-react"
import { useState, useEffect } from "react"

const VideoStream = () => {
  const [isError, setIsError] = useState(false)
  const [retryKey, setRetryKey] = useState(0) // Key to force reloading
  const [retryCountdown, setRetryCountdown] = useState(3) // Countdown seconds
  const [streamStatus, setStreamStatus] = useState("Streaming...") // Stream status message
  const streamUrl = "http://127.0.0.1:4000/video_feed" // Replace with actual backend URL

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout
    let countdownInterval: NodeJS.Timeout

    if (isError) {
      setRetryCountdown(3) // Reset countdown

      countdownInterval = setInterval(() => {
        setRetryCountdown((prev) => (prev > 1 ? prev - 1 : 1)) // Decrease countdown every second
      }, 1000)

      retryTimeout = setTimeout(() => {
        setIsError(false) // Reset error state
        setRetryKey((prevKey) => prevKey + 1) // Force reloading the image
      }, 3000)
    }

    return () => {
      clearTimeout(retryTimeout)
      clearInterval(countdownInterval)
    }
  }, [isError])

  const handleStreamError = () => {
    setIsError(true)
    setStreamStatus("Stream Lost")
  }

  const handleStreamLoad = () => {
    setStreamStatus("Streaming...")
  }

  return (
    <div className="w-full h-full ">
      {!isError ? (
        <img
          key={retryKey} // Changing key forces re-render
          src={streamUrl}
          alt="Live Video Stream"
          onLoad={handleStreamLoad}
          onError={handleStreamError}
          className="w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex flex-col gap-2 items-center max-h-[60vh] justify-center">
          <VideoIcon size={80} className="animate-pulse" />
          <span className="font-bold text-xl animate-pulse">
            {streamStatus}
          </span>
          <span className="text-sm text-gray-500">
            Retrying in {retryCountdown} seconds...
          </span>
        </div>
      )}
    </div>
  )
}

export default VideoStream

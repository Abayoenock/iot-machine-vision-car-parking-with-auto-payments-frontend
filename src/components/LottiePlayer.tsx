import { useEffect, useRef } from "react"
import lottie from "lottie-web"

const LottiePlayer = ({
  src,
  loop = true,
  autoplay = true,
}: {
  src: any
  loop?: boolean
  autoplay?: boolean
}) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg", // You can change the renderer type if needed
      loop,
      autoplay,

      animationData: src,
    })

    return () => {
      anim.destroy()
    }
  }, [src, loop, autoplay])

  return <div ref={containerRef}></div>
}

export default LottiePlayer

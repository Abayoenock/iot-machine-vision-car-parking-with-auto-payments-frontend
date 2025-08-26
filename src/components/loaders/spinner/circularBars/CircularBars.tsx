import React from "react"
import styles from "./circularBars.module.css"

const speedData = {
  verySlow: 1.4,
  slow: 1.2,
  average: 1,
  fast: 0.8,
  veryFast: 0.6,
}
const sizeData = {
  micro: {
    width: "16px",
    height: "16px",
    center1: "1px 100%",
    center2: "100% 1px",
  },
  mini: {
    width: "24px",
    height: "24px",
    center1: "1.9px 100%",
    center2: "100% 1.9px",
  },
  small: {
    width: "40px",
    height: "40px",
    center1: "3.2px 100%",
    center2: "100% 3.2px",
  },
  medium: {
    width: "56px",
    height: "56px",
    center1: "4.5px 100%",
    center2: "100% 4.5px",
  },
  large: {
    width: "72px",
    height: "72px",
    center1: "5.8px 100%",
    center2: "100% 5.8px",
  },
  huge: {
    width: "88px",
    height: "88px",
    center1: "7px 100%",
    center2: "100% 7px",
  },
}

const CircularBars = ({
  size,
  speed,
}: {
  size: "micro" | "mini" | "small" | "medium" | "large" | "huge"
  speed: "verySlow" | "slow" | "average" | "fast" | "veryFast"
}) => {
  return (
    <div
      className={`${styles.spinner}`}
      style={
        {
          "--width": sizeData[size]?.width,
          "--height": sizeData[size]?.height,
          "--speed": speedData[speed],
          "--center1": sizeData[size]?.center1,
          "--center2": sizeData[size]?.center2,
        } as React.CSSProperties
      }
    ></div>
  )
}

export default CircularBars

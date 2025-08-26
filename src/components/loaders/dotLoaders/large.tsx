import styles from "./large.module.css"

const DotLarge = () => {
  return (
    <>
      <div className={`${styles.dots} flex dark:hidden `}></div>
      <div className={`${styles.dotsDark} hidden  dark:flex`}></div>
    </>
  )
}

export default DotLarge

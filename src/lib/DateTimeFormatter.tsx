export function formatDateTime(isoDateString: string): string {
  const date = new Date(isoDateString)

  const day = date.getUTCDate().toString().padStart(2, "0")
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
  const year = date.getUTCFullYear()

  const hours = date.getUTCHours().toString().padStart(2, "0")
  const minutes = date.getUTCMinutes().toString().padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// export function formatDateTime(isoDateString: string): string {
//   const date = new Date(isoDateString)

//   // Add two hours to the date
//   date.setHours(date.getHours() + 2)

//   // Extract parts of the date
//   const day = date.getDate().toString().padStart(2, "0")
//   const month = (date.getMonth() + 1).toString().padStart(2, "0") // Months are 0-indexed
//   const year = date.getFullYear()

//   const hours = date.getHours().toString().padStart(2, "0")
//   const minutes = date.getMinutes().toString().padStart(2, "0")

//   // Return in desired format
//   return `${year}-${month}-${day} ${hours}:${minutes}`
// }

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} Min${minutes !== 1 ? "s" : ""}`
  }

  const totalHours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  const weeks = Math.floor(totalHours / (7 * 24))
  const days = Math.floor((totalHours % (7 * 24)) / 24)
  const hours = totalHours % 24

  const parts = []

  if (weeks > 0) parts.push(`${weeks} Week${weeks !== 1 ? "s" : ""}`)
  if (days > 0) parts.push(`${days} Day${days !== 1 ? "s" : ""}`)
  if (hours > 0) parts.push(`${hours} Hr${hours !== 1 ? "s" : ""}`)
  if (remainingMinutes > 0)
    parts.push(`${remainingMinutes} Min${remainingMinutes !== 1 ? "s" : ""}`)

  return parts.join(", ")
}

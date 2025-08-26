import {
  startOfToday,
  startOfYesterday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  endOfToday,
  endOfYesterday,
 
} from "date-fns"

export const getToday = () => {
  const today = startOfToday()
  const todayEnd = endOfToday()
  return { start: today, end: todayEnd }
}

export const getYesterday = () => {
  const yesterday = startOfYesterday()
  const yesterdayEnd = endOfYesterday()
  return { start: yesterday, end: yesterdayEnd }
}

export const getThisWeek = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 }) // Assuming week starts on Monday
  const end = endOfWeek(new Date(), { weekStartsOn: 1 })
  return { start, end }
}

export const getThisMonth = () => {
  const start = startOfMonth(new Date())
  const end = endOfMonth(new Date())
  return { start, end }
}

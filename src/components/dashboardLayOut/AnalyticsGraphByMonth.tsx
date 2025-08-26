import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"
import { LineChart } from "../charts/LineChart/LineChart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "../ui/skeleton"

const monthNamesShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const AnalyticsGraphMonthly = () => {
  const [year, setYear] = useState(() => new Date().getFullYear().toString())
  const { data, loading, refetch } = useFetch<any>(
    `/api/report/yearlyMonthlyReport?year=${year}`,
    true
  )

  useEffect(() => {
    console.log("Monthly data:", data?.data)
  }, [data])

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let y = 2023; y <= currentYear; y++) {
      years.push(y)
    }
    return years
  }

  useEffect(() => {
    refetch()
  }, [year])

  const datasets = [
    {
      label: "Paid Amount",
      data: data?.data?.map((item: any) => item.amountPaid),
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      fill: true,
    },
    {
      label: "Unpaid Amount",
      data: data?.data?.map((item: any) => item.amountUnpaid),
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: true,
    },
  ]

  return (
    <div className="pt-10 px-4">
      {/* Year Select */}
      <div className="w-full flex gap-2 mb-6">
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Choose year" />
          </SelectTrigger>
          <SelectContent>
            {generateYearOptions().map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="w-full grid grid-cols-10">
        {loading && (!data?.data || data?.data?.length === 0) && (
          <Skeleton className="w-full h-[350px] rounded-md" />
        )}

        {!loading && data?.data?.length !== 0 && (
          <div className="col-span-10 min-h-[350px]">
            <LineChart
              labels={data?.data?.map(
                (item: any) => monthNamesShort[item.month - 1]
              )}
              datasets={datasets}
              chartTitle="Monthly Paid vs Unpaid Amounts"
              yAxisLabel="Amount (Rwf)"
              xAxisLabel="Month"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsGraphMonthly

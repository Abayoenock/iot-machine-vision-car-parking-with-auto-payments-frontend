import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "../ui/skeleton"
import { BarChart } from "../charts/BarChart"

const AnalyticsGraph = () => {
  const [month, setMonth] = useState(() => {
    const currentMonth = new Date().getMonth() + 1 // getMonth() returns 0-11
    return currentMonth.toString()
  })
  const [year, setYear] = useState(() => {
    const currentYear = new Date().getFullYear()
    return currentYear.toString()
  })
  const { data, loading, refetch } = useFetch<any>(
    `/api/report/monthlyAccessReport?year=${year}&month=${month}`,
    true
  )

  useEffect(() => {
    console.log("Fetched Data:", data?.data)
  }, [data])

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = 2023; year <= currentYear; year++) {
      years.push(year)
    }
    return years
  }

  useEffect(() => {
    refetch()
  }, [year, month])

  // Chart datasets: Paid vs Unpaid amounts
  const datasets = [
    {
      label: "Paid Amount",
      data: data?.data?.map((item: any) => item.amountPaid),
      borderColor: "rgba(34, 197, 94, 1)", // green
      backgroundColor: "rgba(34, 197, 94, 0.7)",
      fill: true,
    },
    {
      label: "Unpaid Amount",
      data: data?.data?.map((item: any) => item.amountUnpaid),
      borderColor: "rgba(239, 68, 68, 1)", // red
      backgroundColor: "rgba(239, 68, 68, 0.7)",
      fill: true,
    },
  ]

  return (
    <div className="pt-10 px-4">
      {/* Filters */}
      <div className="w-full flex gap-2">
        <div>
          <Select defaultValue={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Choose month " />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Jan</SelectItem>
              <SelectItem value="2">Feb</SelectItem>
              <SelectItem value="3">Mar</SelectItem>
              <SelectItem value="4">Apr</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">Jun</SelectItem>
              <SelectItem value="7">Jul</SelectItem>
              <SelectItem value="8">Aug</SelectItem>
              <SelectItem value="9">Sep</SelectItem>
              <SelectItem value="10">Oct</SelectItem>
              <SelectItem value="11">Nov</SelectItem>
              <SelectItem value="12">Dec</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Choose year" />
            </SelectTrigger>
            <SelectContent>
              {generateYearOptions().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full grid grid-cols-10">
        {loading && data?.data?.length == 0 && (
          <Skeleton className="w-full h-full rounded-md" />
        )}

        {!loading && data?.data?.length != 0 && (
          <div className="col-span-10 min-h-[350px]">
            <BarChart
              labels={data?.data?.map((item: any) => item.dayOfMonth)}
              datasets={datasets}
              chartTitle="Daily Paid vs Unpaid Amounts"
              yAxisLabel="Amount (RWF)"
              xAxisLabel="Day of the month"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsGraph

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { DatePicker } from "../DatePicker"
import {
  getToday,
  getYesterday,
  getThisWeek,
  getThisMonth,
} from "@/lib/filterDateGenerator"

import { DatePickerWithRange } from "../DatePickerWithRange"
import { DateRange } from "react-day-picker"
import { endOfDay } from "date-fns"
const selectOptions = [
  {
    value: "Today",
    label: "Today",
  },
  {
    value: "Yesterday",
    label: "Yesterday",
  },
  {
    value: "This week",
    label: "This week",
  },
  {
    value: "This month",
    label: "This month",
  },
  {
    value: "Custom Date",
    label: "Custom Date",
  },
  {
    value: "Custom Range",
    label: "Custom Range",
  },
]

const ReportSortSelector = ({
  setStartDate,
  setEndDate,
}: {
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}) => {
  const [selectedOption, setSelectedOption] = useState<string>()
  const [date, setDate] = useState<Date>()

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    if (selectedOption == "Today") {
      const range = getToday()
      console.log(range)
      setStartDate(() => range.start)
      setEndDate(() => range.end)
    }
    if (selectedOption == "Yesterday") {
      const range = getYesterday()
      console.log(range)
      setStartDate(() => range.start)
      setEndDate(() => range.end)
    }
    if (selectedOption == "This week") {
      const range = getThisWeek()
      setStartDate(() => range.start)
      setEndDate(() => range.end)
    }
    if (selectedOption == "This month") {
      const range = getThisMonth()
      setStartDate(() => range.start)
      setEndDate(() => range.end)
    }
  }, [selectedOption])

  // on custom date
  useEffect(() => {
    setStartDate(() => date)
    //@ts-ignore
    setEndDate(() => endOfDay(date))
  }, [date])

  // custom range
  useEffect(() => {
    setStartDate(() => dateRange?.from)
    setEndDate(() => dateRange?.to)
  }, [dateRange])
  return (
    <div className=" w-fit">
      <div className="w-full flex gap-2 ">
        <div className="">
          <Select
            onValueChange={(val) => setSelectedOption(() => val)}
            defaultValue={selectOptions[0].label}
          >
            <SelectTrigger className="w-[180px] text-xs focus:ring-0  focus:ring-offset-0 ">
              <SelectValue placeholder="Sort by .... " />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((selectOption) => (
                <SelectItem value={selectOption.label} key={selectOption.value}>
                  {selectOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="">
          {selectedOption == "Custom Date" && (
            <>
              <DatePicker date={date} setDate={setDate} />
            </>
          )}
          {selectedOption == "Custom Range" && (
            <>
              <DatePickerWithRange
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportSortSelector

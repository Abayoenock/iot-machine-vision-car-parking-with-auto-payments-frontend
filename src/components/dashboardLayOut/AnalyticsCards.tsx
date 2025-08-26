import useFetch from "@/hooks/useFetch"
import { formatCurrency } from "@/lib/currencyFormatter"
import { useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PiUsersFour } from "react-icons/pi"
import { IoCarSportSharp } from "react-icons/io5"
import { GiGate, GiMoneyStack, GiReceiveMoney } from "react-icons/gi"
import { TbCarGarage, TbLayoutBoard } from "react-icons/tb"
import { TfiLayoutGrid2Thumb } from "react-icons/tfi"

const AnalyticsCards = () => {
  const { data, loading } = useFetch<any>(`/api/report/analytics`, true)

  useEffect(() => {
    console.log(data)
  }, [data])

  const items = [
    {
      title: "Users",
      value: data?.totalUsers,
      icon: <PiUsersFour className="text-5xl text-blue-500/30" />,
      bg: "bg-blue-50",
    },
    {
      title: "Vehicles",
      value: data?.totalVehicles,
      icon: <IoCarSportSharp className="text-5xl text-indigo-500/30" />,
      bg: "bg-indigo-50",
    },
    {
      title: "Access Records",
      value: data?.totalAccess,
      icon: <GiGate className="text-5xl text-green-500/30" />,
      bg: "bg-green-50",
    },
    {
      title: "Total Slots",
      value: data?.parkingSettings?.available_spaces,
      icon: <TbLayoutBoard className="text-5xl text-teal-500/30" />,
      bg: "bg-teal-50",
    },
    {
      title: "Currently Parked",
      value: data?.totalInParking,
      icon: <TbCarGarage className="text-5xl text-amber-500/30" />,
      bg: "bg-amber-50",
    },
    {
      title: "Remaining Slots",
      value: data?.parkingSettings?.available_spaces - data?.totalInParking,
      icon: <TfiLayoutGrid2Thumb className="text-5xl text-amber-500/30" />,
      bg: "bg-yellow-50",
    },
    {
      title: "Revenue Collected",
      value: formatCurrency(data?.totalPaid),
      icon: <GiMoneyStack className="text-5xl text-emerald-500/30" />,
      bg: "bg-emerald-50",
    },
    {
      title: "UnPaid Amount",
      value: formatCurrency(data?.totalUnPaid),
      icon: <GiReceiveMoney className="text-5xl text-rose-500/30" />,
      bg: "bg-rose-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {loading &&
        Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
        ))}

      {!loading &&
        data &&
        items.map((item, idx) => (
          <Card
            key={idx}
            className={`relative overflow-hidden shadow-lg hover:shadow-2xl transition  bg-opacity-70`}
          >
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
            </CardContent>
            <span className="absolute bottom-2 right-2 ">{item.icon}</span>
          </Card>
        ))}
      {!loading && (
        <>
          <Card
            className={`relative overflow-hidden shadow-lg hover:shadow-2xl transition  bg-[#ffca06] `}
          >
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium text-[#015b80]">
                MTN Payments
              </CardTitle>
            </CardHeader>
            <span className="absolute -bottom-2 -z-[0] right-2 ">
              <img src="/momo.svg" className=" size-[80px]" alt="" />
            </span>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold text-[#015b80] z-[100]">
                {formatCurrency(data?.totalMomoPayments)}
              </p>
            </CardContent>
          </Card>
          <Card
            className={`relative overflow-hidden shadow-lg hover:shadow-2xl transition  bg-[#e20710] `}
          >
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium text-gray-100">
                Airtel Payments
              </CardTitle>
            </CardHeader>
            <span className="absolute -bottom-2 -z-[0] right-2 ">
              <img src="/airtel.svg" className=" size-[80px]" alt="" />
            </span>
            <CardContent className="p-3 pt-0">
              <p className="text-2xl font-bold text-gray-100 z-[100]">
                {formatCurrency(data?.totalAirtelPayments)}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default AnalyticsCards

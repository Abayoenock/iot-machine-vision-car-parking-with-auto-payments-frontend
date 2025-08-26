import AnalyticsCards from "@/components/dashboardLayOut/AnalyticsCards"
import AnalyticsGraph from "@/components/dashboardLayOut/AnalyticsGraph"
import AnalyticsGraphMonthly from "@/components/dashboardLayOut/AnalyticsGraphByMonth"

const DashboardPage = () => {
  return (
    <div className=" w-full p-2">
      <div className="">
        <AnalyticsCards />
      </div>
      <div className=" w-full grid grid-cols-2 ">
        <AnalyticsGraph />
        <AnalyticsGraphMonthly />
      </div>
    </div>
  )
}

export default DashboardPage

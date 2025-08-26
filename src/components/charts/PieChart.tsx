import React from "react"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js"
import { Pie } from "react-chartjs-2"

// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title)

// Define types for the props
interface PieDataset {
  label: string
  data: number[]
  backgroundColor?: string[]
  borderColor?: string[]
}

interface PieChartProps {
  labels: string[]
  datasets: PieDataset[]
  chartTitle?: string
}

export const PieChart: React.FC<PieChartProps> = ({
  labels,
  datasets,
  chartTitle,
}) => {
  const dataChart = {
    labels,
    datasets: datasets.map((dataset) => ({
      label: dataset.label || "Dataset", // Default dataset label
      data: dataset.data,
      backgroundColor: dataset.backgroundColor || [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
      ], // Default background colors
      borderColor: dataset.borderColor || ["#FF6384", "#36A2EB", "#FFCE56"], // Default border colors
    })),
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const, // Ensure the position is one of the allowed values
      },
      title: {
        display: !!chartTitle, // Display title only if provided
        text: chartTitle || "Chart Title", // Default chart title
      },
    },
  }

  return <Pie options={options} data={dataChart} />
}

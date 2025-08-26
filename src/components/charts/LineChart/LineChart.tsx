import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Define types for the props
interface Dataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string
  tension?: number
  pointRadius?: number
}

interface LineChartProps {
  labels: string[]
  datasets: Dataset[]
  chartTitle?: string
  yAxisLabel?: string
  xAxisLabel?: string
}

export const LineChart: React.FC<LineChartProps> = ({
  labels,
  datasets,
  chartTitle,
  yAxisLabel,
  xAxisLabel,
}) => {
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
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: !!yAxisLabel, // Display label only if provided
          text: yAxisLabel || "Y Axis", // Default Y-axis label
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1,
          precision: 0,
        },
      },
      x: {
        title: {
          display: !!xAxisLabel, // Display label only if provided
          text: xAxisLabel || "X Axis", // Default X-axis label
        },
        ticks: {
          font: {
            size: 8, // Change this value to the desired font size
          },
        },
      },
    },
  }

  const dataChart = {
    labels,
    datasets: datasets.map((dataset) => ({
      label: dataset.label || "Dataset", // Default dataset label
      data: dataset.data,
      borderColor: dataset.borderColor || "rgb(75, 192, 192)", // Default color
      backgroundColor: dataset.backgroundColor || "rgba(75, 192, 192, 0.5)", // Default background color
      tension: dataset.tension || 0.2, // Default line tension
      pointRadius: dataset.pointRadius || 0, // Default point radius
    })),
  }

  return <Line options={options} data={dataChart} />
}

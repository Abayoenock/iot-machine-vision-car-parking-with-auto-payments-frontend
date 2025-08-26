import React from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Define types for the props
interface Dataset {
  label: string
  data: number[]
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

interface BarChartProps {
  labels: string[]
  datasets: Dataset[]
  chartTitle?: string
  yAxisLabel?: string
  xAxisLabel?: string
}

export const BarChart: React.FC<BarChartProps> = ({
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
        position: "top" as const,
      },
      title: {
        display: !!chartTitle,
        text: chartTitle || "Chart Title",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel || "Y Axis",
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1,
          precision: 0,
        },
      },
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel || "X Axis",
        },
        ticks: {
          font: {
            size: 8,
          },
        },
      },
    },
  }

  const dataChart = {
    labels,
    datasets: datasets.map((dataset) => ({
      label: dataset.label || "Dataset",
      data: dataset.data,
      backgroundColor: dataset.backgroundColor || "rgba(75, 192, 192, 0.5)",
      borderColor: dataset.borderColor || "rgb(75, 192, 192)",
      borderWidth: dataset.borderWidth || 1,
    })),
  }

  return <Bar options={options} data={dataChart} />
}

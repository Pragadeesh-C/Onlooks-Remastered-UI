"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function DashboardChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [stats, setStats] = useState({
    dropout_rate: 0,
    continue_rate: 0,
  })

  useEffect(() => {
    // Fetch data from the stats route (replace this with your actual API request)
    const fetchStats = async () => {
      try {
        const response = await fetch("/stats")
        const data = await response.json()
        setStats({
          dropout_rate: data.dropout_rate,
          continue_rate: data.continue_rate,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart with fetched data
    const { dropout_rate, continue_rate } = stats
    const data = [dropout_rate, continue_rate]
    const labels = ["Dropout Rate", "Continue Rate"]

    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.7)", // Dropout Rate
                "rgba(54, 162, 235, 0.7)", // Continue Rate
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
                boxWidth: 6,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.raw}%`,
              },
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [stats])

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function StudentChart({ trendData }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
  
    if (!trendData || !trendData.labels || trendData.labels.length === 0) {
      console.warn("No trend data available for chart.")
      return
    }
  
    if (!chartRef.current) return
  
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
  
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: trendData.labels,
          datasets: [
            {
              label: "Dropout Predictions",
              data: trendData.dropoutData || [],
              borderColor: "#f43f5e",
              backgroundColor: "rgba(244, 63, 94, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
            {
              label: "Continue Predictions",
              data: trendData.continueData || [],
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top", labels: { usePointStyle: true, boxWidth: 6 } },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true, grid: { borderDash: [2], drawBorder: false } },
          },
        },
      })
    }
  
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [trendData])
  

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

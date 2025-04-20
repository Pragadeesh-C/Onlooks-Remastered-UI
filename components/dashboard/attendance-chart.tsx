"use client"

import { useEffect, useRef, useState } from "react"
import { Chart } from "chart.js/auto"
import { PieChart } from "lucide-react"
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';

export function DashboardChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [stats, setStats] = useState({
    dropout_rate: 0,
    continue_rate: 0,
  })
  const { fetchWithAuth } = useApi();
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchWithAuth("/stats");
        if (response === null) {
          return; // Early return if we got a 401 (handled by useApi)
        }

        const data = await response.json();
        setStats({
          dropout_rate: data.dropout_rate,
          continue_rate: data.continue_rate,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart with fetched data
    const { dropout_rate, continue_rate } = stats
    
    // If both rates are 0, don't create the chart
    if (dropout_rate === 0 && continue_rate === 0) {
      return
    }

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

  if (stats.dropout_rate === 0 && stats.continue_rate === 0) {
    return (
      <div className="flex h-[300px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
        <div className="mb-4 rounded-lg bg-gray-100 p-3">
          <PieChart className="h-8 w-8 text-gray-400" />
        </div>
        <p className="mb-2 text-sm font-medium text-gray-600">No overview data available</p>
        <p className="text-xs text-gray-500">Upload student data to see dropout overview</p>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <canvas ref={chartRef} />
    </div>
  )
}

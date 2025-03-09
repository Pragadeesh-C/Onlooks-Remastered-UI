"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  BarChart3,
  Calendar,
  Download,
  FileSpreadsheet,
  MoreVertical,
  PieChart,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Navbar } from "@/components/layout/navbar"
import { StudentChart } from "@/components/dashboard/student-chart"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { PredictionWidget } from "@/components/dashboard/prediction-widget"
import { usePredictions } from "@/context/prediction-context"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("All")
  const { predictions, hasPredictions } = usePredictions()
  const { setPredictions } = usePredictions()
  const [studentPredictions, setStudentPredictions] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5 // Number of students per page
  const [stats, setStats] = useState({
    total_students: 0,
    dropout_rate: 0,
    continue_rate: 0,
    predictions_made: 0
  })
  const [trendData, setTrendData] = useState({ labels: [], dropoutData: [], continueData: [] })

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  
  const filteredStudents = useMemo(() => {
    if (activeTab === "All") return studentPredictions
    return studentPredictions.filter((s) => s.prediction === activeTab)
  }, [activeTab, studentPredictions]) // Recalculates only when activeTab or studentPredictions change
  
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredStudents.slice(startIndex, startIndex + pageSize)
  }, [filteredStudents, currentPage])

  const totalPages = Math.ceil(filteredStudents.length / pageSize)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }
  // Calculate statistics
  const dropoutCount = predictions.filter((s) => s.ML_Prediction === "Will DropOut").length
  const continueCount = predictions.filter((s) => s.ML_Prediction === "Will Continue").length

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token") // Assuming JWT is stored
        console.log(token)
        const response = await fetch("http://127.0.0.1:8000/stats", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (!response.ok) throw new Error("Failed to fetch stats")
  
        const data = await response.json()
        setStats(data)
  
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
        setTrendData({
          labels: data.monthly_trends.map(entry => monthNames[entry.month - 1]), // Extracts month number
          dropoutData: data.monthly_trends.map(entry => entry.dropout_count),
          continueData: data.monthly_trends.map(entry => entry.continue_count),
        }) // Set state safely
  
        if (data.recent_predictions) {
          setPredictions(data.recent_predictions) // ✅ Update predictions state
        }
  
        if (data.student_predictions) {
          setStudentPredictions(data.student_predictions) // ✅ Store student_predictions in state
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }
  
    fetchStats()
  }, [setPredictions, setStudentPredictions]) // ✅ Added `setStudentPredictions` dependency
  // ✅ Ensure useEffect re-runs when `setPredictions` changes



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c9f0ff] via-[#f5e6fb] to-[#ffcef3]">
      <Navbar />
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-500">Monitor student performance and dropout predictions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1 bg-white">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="icon" className="rounded-full bg-white">
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full bg-white">
              <Calendar className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.total_students}</div>
                  <div className="mt-1 text-xs text-green-600">+{stats.total_students} last month</div>
                </div>
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Dropout Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.dropout_rate}%</div>
                  <div className="mt-1 text-xs text-red-600">+{dropoutCount} last month</div>
                </div>
                <div className="rounded-full bg-red-100 p-2 text-red-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Continue Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.continue_rate}%</div>
                  <div className="mt-1 text-xs text-green-600">+{continueCount} last month</div>
                </div>
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Predictions Made</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{stats.predictions_made}</div>
                  <div className="mt-1 text-xs text-blue-600">Last updated today</div>
                </div>
                <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                  <PieChart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="col-span-1 bg-white lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Student Dropout Trends</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Download Data</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <StudentChart trendData={trendData}  />
            </CardContent>
          </Card>

          <PredictionWidget />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="col-span-1 bg-white lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/predictions">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hasPredictions &&
                  predictions.slice(0, 3).map((prediction, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                      <div
                        className={`mt-0.5 rounded-full p-1 ${prediction.ML_Prediction === "Will DropOut" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                      >
                        {prediction.ML_Prediction === "Will DropOut" ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Student #{index + 1} -{" "}
                          <span
                            className={prediction.ML_Prediction === "Will DropOut" ? "text-red-600" : "text-green-600"}
                          >
                            {prediction.ML_Prediction}
                          </span>
                        </p>
                        <p className="line-clamp-2 text-xs text-gray-500">{prediction.Insights.substring(0, 120)}...</p>
                      </div>
                    </div>
                  ))}

                {!hasPredictions && (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <FileSpreadsheet className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="mb-2 text-sm font-medium">No prediction data available</p>
                    <p className="mb-4 text-xs text-gray-500">Upload student data to see predictions and insights</p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/upload">Upload Data</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Attendance Overview</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Download Data</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <AttendanceChart />
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 flex rounded-full bg-gray-100 p-1">
          <Button
            variant={activeTab === "All" ? "default" : "ghost"}
            className={`flex-1 rounded-full ${activeTab === "All" ? "bg-pink-500 text-white" : ""}`}
            onClick={() => handleTabChange("All")}
          >
            All {studentPredictions.length}
          </Button>
          <Button
            variant={activeTab === "Will DropOut" ? "default" : "ghost"}
            className={`flex-1 rounded-full ${activeTab === "Dropout" ? "bg-pink-500 text-white" : ""}`}
            onClick={() => handleTabChange("Will DropOut")}
          >
            Dropout {studentPredictions.filter((s) => s.prediction === "Will DropOut").length}
          </Button>
          <Button
            variant={activeTab === "Will Continue" ? "default" : "ghost"}
            className={`flex-1 rounded-full ${activeTab === "Will Continue" ? "bg-pink-500 text-white" : ""}`}
            onClick={() => handleTabChange("Will Continue")}
          >
            Continue {studentPredictions.filter((s) => s.prediction === "Will Continue").length}
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Predicted Date</th>
                  <th className="px-4 py-3">Prediction</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                { paginatedStudents.map((student) => (
                  <tr key={student.id} className="border-b text-sm">
                    <td className="px-4 py-3 text-pink-500">{student.student_id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={student.avatar || "/placeholder.svg"}
                            alt={student.student_name}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{student.student_name}</div>
                          <div className="text-xs text-gray-500">Class {student.class}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {student.predictedDate}
                      <div className="text-xs text-gray-500">{student.predicted_date}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          student.prediction === "Will DropOut" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                        }`}
                      >
                        {student.prediction}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Student</DropdownMenuItem>
                          <DropdownMenuItem>Contact Student</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3">
        <Button variant="ghost" size="icon" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>
          &lt;
        </Button>
        {[...Array(totalPages)].map((_, index) => (
          <Button key={index} variant={currentPage === index + 1 ? "outline" : "ghost"} size="icon" onClick={() => goToPage(index + 1)}>
            {index + 1}
          </Button>
        ))}
        <Button variant="ghost" size="icon" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
          &gt;
        </Button>
      </div>
    </div>
      </div>
    </div>
  )
}


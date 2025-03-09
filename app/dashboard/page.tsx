"use client"

import { useEffect, useState } from "react"
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
  const [stats, setStats] = useState({
    total_students: 0,
    dropout_rate: 0,
    continue_rate: 0,
    predictions_made: 0
  })
  const [trendData, setTrendData] = useState({ labels: [], dropoutData: [], continueData: [] })

  // Sample student data
  const students = [
    {
      id: "#1001",
      name: "Amit Kumar",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "10",
      enrollmentDate: "Sep 12, 2 PM",
      lastAttendance: "Sep 14, 12 PM",
      predictedDate: "Aug 4, 2024",
      predictedTime: "12:24 PM",
      status:
        hasPredictions && predictions.length > 0
          ? predictions[0].ML_Prediction === "Will DropOut"
            ? "Dropout"
            : "Continue"
          : "Dropout",
    },
    {
      id: "#1002",
      name: "Sita Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "9",
      enrollmentDate: "Sep 15, 4 PM",
      lastAttendance: "Sep 18, 12 PM",
      predictedDate: "Sep 2, 2024",
      predictedTime: "10:14 PM",
      status:
        hasPredictions && predictions.length > 1
          ? predictions[1].ML_Prediction === "Will DropOut"
            ? "Dropout"
            : "Continue"
          : "Continue",
    },
    {
      id: "#1003",
      name: "Rahul Verma",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "11",
      enrollmentDate: "Sep 20, 2 PM",
      lastAttendance: "Sep 24, 12 PM",
      predictedDate: "Sep 18, 2024",
      predictedTime: "01:14 PM",
      status:
        hasPredictions && predictions.length > 2
          ? predictions[2].ML_Prediction === "Will DropOut"
            ? "Dropout"
            : "Continue"
          : "Dropout",
    },
    {
      id: "#1004",
      name: "Priya Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "8",
      enrollmentDate: "Sep 26, 2 PM",
      lastAttendance: "Sep 28, 12 PM",
      predictedDate: "Sep 10, 2024",
      predictedTime: "10:55 PM",
      status:
        hasPredictions && predictions.length > 3
          ? predictions[3].ML_Prediction === "Will DropOut"
            ? "Dropout"
            : "Continue"
          : "Continue",
    },
    {
      id: "#1005",
      name: "Aditya Das",
      avatar: "/placeholder.svg?height=40&width=40",
      class: "10",
      enrollmentDate: "Sep 28, 5 PM",
      lastAttendance: "Sep 30, 7 PM",
      predictedDate: "Sep 20, 2024",
      predictedTime: "1:45 PM",
      status: "Dropout",
    },
  ]

  // Filter students based on active tab
  const filteredStudents = activeTab === "All" ? students : students.filter((student) => student.status === activeTab)

  // Calculate statistics
  const dropoutCount = students.filter((s) => s.status === "Dropout").length
  const continueCount = students.filter((s) => s.status === "Continue").length

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

        setTrendData({labels: data.monthly_trends.map(entry => monthNames[entry.month - 1]), // Extracts month number
        dropoutData: data.monthly_trends.map(entry => entry.dropout_count),
        continueData: data.monthly_trends.map(entry => entry.continue_count), }) // Set state safely

        if (data.recent_predictions) {
          setPredictions(data.recent_predictions) // ✅ Update predictions state
        }
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [setPredictions]) // ✅ Ensure useEffect re-runs when `setPredictions` changes



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
            onClick={() => setActiveTab("All")}
          >
            All {students.length}
          </Button>
          <Button
            variant={activeTab === "Dropout" ? "default" : "ghost"}
            className={`flex-1 rounded-full ${activeTab === "Dropout" ? "bg-pink-500 text-white" : ""}`}
            onClick={() => setActiveTab("Dropout")}
          >
            Dropout {students.filter((s) => s.status === "Dropout").length}
          </Button>
          <Button
            variant={activeTab === "Continue" ? "default" : "ghost"}
            className={`flex-1 rounded-full ${activeTab === "Continue" ? "bg-pink-500 text-white" : ""}`}
            onClick={() => setActiveTab("Continue")}
          >
            Continue {students.filter((s) => s.status === "Continue").length}
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Enrollment</th>
                  <th className="px-4 py-3">Last Attendance</th>
                  <th className="px-4 py-3">Predicted Date</th>
                  <th className="px-4 py-3">Prediction</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b text-sm">
                    <td className="px-4 py-3 text-pink-500">{student.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={student.avatar || "/placeholder.svg"}
                            alt={student.name}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-gray-500">Class {student.class}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{student.enrollmentDate}</td>
                    <td className="px-4 py-3">{student.lastAttendance}</td>
                    <td className="px-4 py-3">
                      {student.predictedDate}
                      <div className="text-xs text-gray-500">{student.predictedTime}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          student.status === "Dropout" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                        }`}
                      >
                        {student.status}
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
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-md bg-gray-900 text-white">
                1
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                2
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                3
              </Button>
              <span>...</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                15
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                &lt;
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


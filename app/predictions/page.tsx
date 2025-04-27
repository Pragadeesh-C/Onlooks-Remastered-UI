"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileSpreadsheet, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/layout/navbar"
import { usePredictions } from "@/context/prediction-context"
import { PredictionCard } from "@/components/predictions/prediction-card"
import { PredictionSummary } from "@/components/predictions/prediction-summary"
import { useToast } from "@/components/ui/use-toast"

export default function PredictionsPage() {
  const { predictions, hasPredictions } = usePredictions()
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const studentCardRef = useRef<HTMLDivElement>(null)

  // Get student name from URL query parameter and scroll to the card
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const studentName = params.get('student')
    if (studentName) {
      setExpandedStudent(studentName)
      
      // Wait for the DOM to update with the expanded card
      setTimeout(() => {
        if (studentCardRef.current) {
          studentCardRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          })
        }
      }, 300) // Small delay to ensure the card is rendered
    }
  }, [])

  // Count predictions by type
  const dropoutCount = predictions.filter((p) => p.ML_Prediction === "Will DropOut").length
  const continueCount = predictions.filter((p) => p.ML_Prediction === "Will Continue").length
  
  // Calculate percentages
  const dropoutPercentage = Math.round((dropoutCount / predictions.length) * 100) || 0
  const continuePercentage = Math.round((continueCount / predictions.length) * 100) || 0

  // Filter predictions based on search term and active tab
  const filteredPredictions = (status: string) => {
    return predictions
      .filter((p) => status === "all" || p.ML_Prediction === status)
      .filter((p) => !searchTerm || (p.Insights && p.Insights.toLowerCase().includes(searchTerm.toLowerCase())))
  }

  const handleExport = () => {
    try {
      // Create CSV headers
      const headers = [
        "Student Name",
        "Prediction",
        "Key Risk Factors",
        "Recommendations",
        "Analysis"
      ]

      // Process predictions data
      const rows = predictions.map(prediction => {
        // Extract key risk factors and recommendations from insights
        const insights = prediction.Insights || ""
        
        // Helper function to extract section content
        const extractSection = (sectionName: string, endSection: string) => {
          const startPattern = new RegExp(`${sectionName}:([\\s\\S]*?)(?=${endSection}|$)`)
          const match = insights.match(startPattern)
          return (match?.[1] || "").trim()
        }

        const analysis = extractSection("Analysis", "Key Risk Factors")
        const keyRiskFactors = extractSection("Key Risk Factors", "Recommendations")
        const recommendations = extractSection("Recommendations", "If Financial Issues")

        return [
          prediction.Student_Name,
          prediction.ML_Prediction,
          keyRiskFactors.replace(/•/g, '').replace(/\n/g, ' ').trim(),
          recommendations.replace(/•/g, '').replace(/\n/g, ' ').trim(),
          analysis.replace(/\n/g, ' ').trim()
        ]
      })

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      ].join('\n')

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `student_predictions_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Report exported successfully",
        description: "Your predictions report has been downloaded as a CSV file.",
        duration: 3000,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the predictions report.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  if (!hasPredictions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#c9f0ff] via-[#f5e6fb] to-[#ffcef3]">
        <Navbar />
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-md">
            <FileSpreadsheet className="mb-4 h-16 w-16 text-gray-400" />
            <h2 className="mb-2 text-2xl font-bold">No Predictions Available</h2>
            <p className="mb-6 text-gray-500">Upload a student data file to generate dropout predictions</p>
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <Link href="/upload">Upload Data</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c9f0ff] via-[#f5e6fb] to-[#ffcef3]">
      <Navbar />
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Student Predictions</h1>
            </div>
            <p className="text-gray-500">Analysis and insights for student dropout predictions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 bg-white hover:bg-gray-50"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <PredictionSummary 
          totalCount={predictions.length} 
          dropoutCount={dropoutCount}
          dropoutPercentage={dropoutPercentage}
          continueCount={continueCount}
          continuePercentage={continuePercentage}
        />

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search insights..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4 grid w-full grid-cols-3 rounded-full bg-gray-100 p-1">
            <TabsTrigger value="all" className="rounded-full">
              All ({predictions.length})
            </TabsTrigger>
            <TabsTrigger value="Will DropOut" className="rounded-full">
              Dropout Risk ({dropoutCount})
            </TabsTrigger>
            <TabsTrigger value="Will Continue" className="rounded-full">
              Likely to Continue ({continueCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredPredictions("all").map((prediction, index) => (
              <div 
                key={index}
                ref={expandedStudent === (prediction.student_name || prediction.Student_Name) ? studentCardRef : null}
              >
                <PredictionCard 
                  prediction={prediction} 
                  index={index}
                  isExpanded={expandedStudent === (prediction.student_name || prediction.Student_Name)}
                  onExpandChange={(expanded) => {
                    if (expanded) {
                      setExpandedStudent(prediction.student_name || prediction.Student_Name)
                    } else {
                      setExpandedStudent(null)
                    }
                  }}
                />
              </div>
            ))}
            {filteredPredictions("all").length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-md">
                <Search className="mb-4 h-12 w-12 text-gray-400" />
                <h2 className="mb-2 text-xl font-bold">No results found</h2>
                <p className="text-gray-500">Try adjusting your search term</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="Will DropOut" className="space-y-4">
            {filteredPredictions("Will DropOut").map((prediction, index) => (
              <div 
                key={index}
                ref={expandedStudent === (prediction.student_name || prediction.Student_Name) ? studentCardRef : null}
              >
                <PredictionCard 
                  prediction={prediction} 
                  index={index}
                  isExpanded={expandedStudent === (prediction.student_name || prediction.Student_Name)}
                  onExpandChange={(expanded) => {
                    if (expanded) {
                      setExpandedStudent(prediction.student_name || prediction.Student_Name)
                    } else {
                      setExpandedStudent(null)
                    }
                  }}
                />
              </div>
            ))}
            {filteredPredictions("Will DropOut").length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-md">
                <Search className="mb-4 h-12 w-12 text-gray-400" />
                <h2 className="mb-2 text-xl font-bold">No results found</h2>
                <p className="text-gray-500">Try adjusting your search term</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="Will Continue" className="space-y-4">
            {filteredPredictions("Will Continue").map((prediction, index) => (
              <div 
                key={index}
                ref={expandedStudent === (prediction.student_name || prediction.Student_Name) ? studentCardRef : null}
              >
                <PredictionCard 
                  prediction={prediction} 
                  index={index}
                  isExpanded={expandedStudent === (prediction.student_name || prediction.Student_Name)}
                  onExpandChange={(expanded) => {
                    if (expanded) {
                      setExpandedStudent(prediction.student_name || prediction.Student_Name)
                    } else {
                      setExpandedStudent(null)
                    }
                  }}
                />
              </div>
            ))}
            {filteredPredictions("Will Continue").length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-md">
                <Search className="mb-4 h-12 w-12 text-gray-400" />
                <h2 className="mb-2 text-xl font-bold">No results found</h2>
                <p className="text-gray-500">Try adjusting your search term</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

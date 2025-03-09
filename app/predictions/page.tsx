"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileSpreadsheet, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/layout/navbar"
import { usePredictions } from "@/context/prediction-context"
import { PredictionCard } from "@/components/predictions/prediction-card"
import { PredictionSummary } from "@/components/predictions/prediction-summary"

export default function PredictionsPage() {
  const { predictions, hasPredictions } = usePredictions()
  const [searchTerm, setSearchTerm] = useState("")

  // Count predictions by type
  const dropoutCount = predictions.filter((p) => p.ML_Prediction === "Will DropOut").length
  const continueCount = predictions.filter((p) => p.ML_Prediction === "Will Continue").length

  // Filter predictions based on search term and active tab
  const filterPredictions = (status: string) => {
    return predictions
      .filter((p) => status === "all" || p.ML_Prediction === status)
      .filter((p) => p.Insights.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <Button variant="outline" size="sm" className="gap-1 bg-white">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <PredictionSummary totalCount={predictions.length} dropoutCount={dropoutCount} continueCount={continueCount} />

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
            {filterPredictions("all").map((prediction, index) => (
              <PredictionCard key={index} prediction={prediction} index={index} />
            ))}
            {filterPredictions("all").length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-md">
                <Search className="mb-4 h-12 w-12 text-gray-400" />
                <h2 className="mb-2 text-xl font-bold">No results found</h2>
                <p className="text-gray-500">Try adjusting your search term</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="Will DropOut" className="space-y-4">
            {filterPredictions("Will DropOut").map((prediction, index) => (
              <PredictionCard key={index} prediction={prediction} index={index} />
            ))}
            {filterPredictions("Will DropOut").length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-md">
                <Search className="mb-4 h-12 w-12 text-gray-400" />
                <h2 className="mb-2 text-xl font-bold">No results found</h2>
                <p className="text-gray-500">Try adjusting your search term</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="Will Continue" className="space-y-4">
            {filterPredictions("Will Continue").map((prediction, index) => (
              <PredictionCard key={index} prediction={prediction} index={index} />
            ))}
            {filterPredictions("Will Continue").length === 0 && (
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


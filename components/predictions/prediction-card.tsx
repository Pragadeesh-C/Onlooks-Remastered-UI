"use client"

import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StudentPrediction } from "@/context/prediction-context"

interface PredictionCardProps {
  prediction: StudentPrediction
  index: number
}

export function PredictionCard({ prediction, index }: PredictionCardProps) {
  const [expanded, setExpanded] = useState(false)

  const isDropout = prediction.ML_Prediction === "Will DropOut"

  // Extract scholarship suggestions from insights
  const scholarships = prediction.Insights.match(/such as ([^.]+)/i)?.[1].split(", ") || []

  // Extract key risk factors (this is a simplified approach)
  const riskFactors =
    prediction.Insights.match(/'([^']+)'/g)
      ?.map((factor) => factor.replace(/'/g, ""))
      .filter(Boolean) || []

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`flex flex-row items-center gap-2 ${isDropout ? "bg-red-50" : "bg-green-50"}`}>
        <div className={`rounded-full p-1.5 ${isDropout ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
          {isDropout ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">Student #{index + 1}</CardTitle>
          <CardDescription>
            Prediction:{" "}
            <Badge variant={isDropout ? "destructive" : "default"} className="ml-1">
              {prediction.ML_Prediction}
            </Badge>
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse details" : "Expand details"}
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </CardHeader>

      <CardContent
        className={`grid transition-all duration-300 ease-in-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            <div className="mb-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-gray-700">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Insights & Recommendations
              </h3>
              <p className="text-gray-600">{prediction.Insights}</p>
            </div>

            {riskFactors.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">Key Risk Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {riskFactors.map((factor, i) => (
                    <Badge key={i} variant="outline" className="bg-gray-100">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {scholarships.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">Recommended Scholarships</h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                  {scholarships.map((scholarship, i) => (
                    <li key={i}>{scholarship.trim()}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


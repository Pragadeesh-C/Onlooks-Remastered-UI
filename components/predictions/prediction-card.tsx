"use client"

import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StudentPrediction } from "@/context/prediction-context"
import Link from "next/link"

interface PredictionCardProps {
  prediction: StudentPrediction
  index: number
}

export function PredictionCard({ prediction, index }: PredictionCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Ensure we have the correct values
  const isDropout = prediction.ML_Prediction === "Will DropOut"
  const studentName = prediction.student_name || prediction.Student_Name || "Unknown Student"
  const mlPrediction = prediction.ML_Prediction || "Unknown"

  // Extract sections from insights
  const extractSections = (insights: string = "") => {
    const sections = {
      analysis: '',
      keyRiskFactors: [] as string[],
      recommendations: ''
    };

    // Extract Analysis
    const parts = insights.split('Key Risk Factors:');
    if (parts.length > 0) {
      sections.analysis = parts[0].trim();
    }

    // Extract Key Risk Factors
    const keyRiskSection = insights.split('Key Risk Factors:')[1];
    if (keyRiskSection) {
      const recommendationsSection = keyRiskSection.split('Recommendations:')[0];
      sections.keyRiskFactors = recommendationsSection
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => line.trim().replace('•', '').trim());
    }

    // Extract Recommendations
    const recommendationsPart = insights.split('Recommendations:')[1];
    if (recommendationsPart) {
      sections.recommendations = recommendationsPart.trim();
    }

    return sections;
  };

  const sections = extractSections(prediction.Insights);

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`flex flex-row items-center gap-2 ${isDropout ? "bg-red-50" : "bg-green-50"}`}>
        <div className={`rounded-full p-1.5 ${isDropout ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
          {isDropout ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{studentName}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            Prediction:{" "}
            <Badge 
              variant={isDropout ? "destructive" : "default"} 
              className={`ml-1 ${isDropout ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
            >
              {mlPrediction}
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
              <div className="space-y-4">
                {/* Analysis Section */}
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-700">Analysis</h4>
                  <p className="text-sm text-gray-600">{sections.analysis}</p>
                </div>

                {/* Key Risk Factors Section */}
                {sections.keyRiskFactors.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700">Key Risk Factors</h4>
                    <ul className="space-y-2">
                      {sections.keyRiskFactors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1 text-red-500">•</span>
                          <span className="text-sm text-gray-600">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations Section */}
                {sections.recommendations && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700">Recommendations</h4>
                    <p className="text-sm text-gray-600">{sections.recommendations}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


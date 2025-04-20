import Link from "next/link"
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { usePredictions } from "@/context/prediction-context"

export function PredictionWidget() {
  const { predictions, hasPredictions } = usePredictions()

  if (!hasPredictions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Predictions</CardTitle>
          <CardDescription>Upload data to see dropout predictions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <p className="mb-4 text-sm text-gray-500">No prediction data available yet</p>
          <Button asChild variant="outline" size="sm">
            <Link href="/upload">Upload Student Data</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const totalCount = predictions.length
  const dropoutCount = predictions.filter((p) => p.ML_Prediction === "Will DropOut").length
  const continueCount = predictions.filter((p) => p.ML_Prediction === "Will Continue").length

  const dropoutRate = Math.round((dropoutCount / totalCount) * 100)
  const continueRate = Math.round((continueCount / totalCount) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Predictions</CardTitle>
        <CardDescription>Current dropout risk assessment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Dropout Risk</span>
            </div>
            <span className="font-medium">{dropoutRate}%</span>
          </div>
          <Progress value={dropoutRate} variant="dropout" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Likely to Continue</span>
            </div>
            <span className="font-medium">{continueRate}%</span>
          </div>
          <Progress value={continueRate} variant="continue" />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/predictions" className="flex items-center justify-center gap-2">
            View All Predictions
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


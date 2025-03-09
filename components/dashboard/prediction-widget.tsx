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
        <CardDescription>Latest dropout prediction analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Dropout Risk</span>
            </div>
            <span className="text-sm text-gray-500">{dropoutCount} students</span>
          </div>
          <Progress value={dropoutRate} className="h-2" indicatorClassName="bg-red-500" />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-medium">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Likely to Continue</span>
            </div>
            <span className="text-sm text-gray-500">{continueCount} students</span>
          </div>
          <Progress value={continueRate} className="h-2" indicatorClassName="bg-green-500" />
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-600">
            {dropoutCount > 0
              ? `${dropoutCount} students need immediate attention to prevent dropout.`
              : "All students are on track to continue their education."}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full" size="sm">
          <Link href="/predictions" className="flex items-center gap-1">
            <span>View Detailed Analysis</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


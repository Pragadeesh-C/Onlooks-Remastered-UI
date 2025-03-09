import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PredictionSummaryProps {
  totalCount: number
  dropoutCount: number
  continueCount: number
}

export function PredictionSummary({ totalCount, dropoutCount, continueCount }: PredictionSummaryProps) {
  const dropoutRate = Math.round((dropoutCount / totalCount) * 100) || 0
  const continueRate = Math.round((continueCount / totalCount) * 100) || 0

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="bg-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-gray-500">Total Predictions</p>
            <p className="text-3xl font-bold">{totalCount}</p>
            <p className="text-xs text-blue-600">Analysis complete</p>
          </div>
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <TrendingUp className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-gray-500">Dropout Risk</p>
            <p className="text-3xl font-bold">{dropoutRate}%</p>
            <p className="flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle className="h-3 w-3" />
              {dropoutCount} students at risk
            </p>
          </div>
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <TrendingDown className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-gray-500">Likely to Continue</p>
            <p className="text-3xl font-bold">{continueRate}%</p>
            <p className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle className="h-3 w-3" />
              {continueCount} students on track
            </p>
          </div>
          <div className="rounded-full bg-green-100 p-3 text-green-600">
            <TrendingUp className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


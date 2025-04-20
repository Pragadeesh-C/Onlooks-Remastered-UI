import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PredictionSummaryProps {
  totalCount: number
  dropoutCount: number
  dropoutPercentage: number
  continueCount: number
  continuePercentage: number
}

export function PredictionSummary({
  totalCount,
  dropoutCount,
  dropoutPercentage,
  continueCount,
  continuePercentage,
}: PredictionSummaryProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Predictions</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
          <p className="text-xs text-blue-500">Analysis complete</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dropout Risk</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dropoutPercentage}%</div>
          <p className="text-xs text-red-500">△ {dropoutCount} students at risk</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Likely to Continue</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{continuePercentage}%</div>
          <p className="text-xs text-green-500">✓ {continueCount} students on track</p>
        </CardContent>
      </Card>
    </div>
  )
}


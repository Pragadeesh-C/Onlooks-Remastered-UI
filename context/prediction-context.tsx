"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type StudentPrediction = {
  ML_Prediction: string
  Similar_Students: any[]
  Insights: string
}

type PredictionContextType = {
  predictions: StudentPrediction[]
  setPredictions: (predictions: StudentPrediction[]) => void
  hasPredictions: boolean
}

const PredictionContext = createContext<PredictionContextType | undefined>(undefined)

export function PredictionProvider({ children }: { children: ReactNode }) {
  const [predictions, setPredictions] = useState<StudentPrediction[]>([])

  const hasPredictions = predictions.length > 0

  return (
    <PredictionContext.Provider value={{ predictions, setPredictions, hasPredictions }}>
      {children}
    </PredictionContext.Provider>
  )
}

export function usePredictions() {
  const context = useContext(PredictionContext)
  if (context === undefined) {
    throw new Error("usePredictions must be used within a PredictionProvider")
  }
  return context
}


import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PredictionProvider } from "@/context/prediction-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Onlooks - Student Dropout Prediction",
  description: "A dashboard for teachers to predict and prevent student dropouts",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PredictionProvider>{children}</PredictionProvider>
      </body>
    </html>
  )
}



import './globals.css'
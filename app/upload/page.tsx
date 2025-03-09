"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Check, FileSpreadsheet, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/layout/navbar"
import { usePredictions } from "@/context/prediction-context"

export default function UploadPage() {
  const router = useRouter()
  const { setPredictions } = usePredictions()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [apiResponse, setApiResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file: File) => {
    setError(null)

    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    if (!validTypes.includes(file.type)) {
      setError("Please upload a CSV or Excel file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB")
      return
    }

    setFile(file)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setIsLoading(true)
    setUploadProgress(0)
    setApiResponse(null)

    const formData = new FormData()
    formData.append("file", file)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 200)

    try {
      const token = localStorage.getItem("token"); // Get JWT token from storage
    
      const response = await fetch("http://127.0.0.1:8000/upload", {
        headers: {
          "Authorization": `Bearer ${token}`, // Attach Bearer token
        },
        method: "POST",
        body: formData,
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed"); // Throw error for catch block
      }
    
      const resp = await response.json(); // Parse JSON response
    
      const formattedData = resp.map((item: { [x: string]: any }) => ({
        ML_Prediction: item["ML Prediction"],
        Similar_Students: item["Similar Students"],
        Insights: item["Insights"],
      }));
    
      // Store the predictions in context
      setPredictions(formattedData);
      setApiResponse(JSON.stringify(resp, null, 2));
    
      setSuccess(true);
      setUploadProgress(100);
    
      // Redirect to predictions page after successful upload
      setTimeout(() => {
        router.push("/predictions");
      }, 1500);
    } catch (err: any) {
      console.error("Upload Error:", err.message);
      setError(err.message || "Failed to upload file. Please try again.");
    } finally {
      clearInterval(interval);
      setIsUploading(false);
      setIsLoading(false);
    }
    
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c9f0ff] via-[#f5e6fb] to-[#ffcef3]">
      <Navbar />
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Upload Student Data</h1>
          <p className="text-gray-500">Upload CSV or Excel files to predict student dropout rates</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Upload your student data file to analyze dropout predictions</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-green-500 text-green-500">
                  <Check className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>File uploaded successfully! Redirecting to predictions page...</AlertDescription>
                </Alert>
              )}

              <div
                className={`mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                  isDragging
                    ? "border-pink-500 bg-pink-50"
                    : file
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-2 rounded-full bg-green-100 p-2 text-green-600">
                      <FileSpreadsheet className="h-8 w-8" />
                    </div>
                    <p className="mb-1 font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-500 hover:text-red-700"
                      onClick={() => setFile(null)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 rounded-full bg-pink-100 p-3 text-pink-500">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="mb-1 font-medium">Drag and drop your file here</p>
                    <p className="mb-3 text-sm text-gray-500">or click to browse from your computer</p>
                    <Button asChild variant="outline" size="sm">
                      <label className="cursor-pointer">
                        Browse Files
                        <input type="file" className="hidden" accept=".csv,.xls,.xlsx" onChange={handleFileChange} />
                      </label>
                    </Button>
                  </>
                )}
              </div>

              {isUploading && (
                <div className="mb-4">
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleUpload}
                  disabled={!file || isLoading || success}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  {isUploading ? "Uploading..." : "Upload and Analyze"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>How to prepare your data file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 font-medium">Accepted File Formats</h3>
                  <p className="text-sm text-gray-500">CSV (.csv), Excel (.xls, .xlsx)</p>
                </div>

                <div>
                  <h3 className="mb-1 font-medium">Required Columns</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-gray-500">
                    <li>Student ID</li>
                    <li>Student Name</li>
                    <li>Class/Grade</li>
                    <li>Fathers_Occupation</li>
                    <li>Fathers_Education (0 to 12)</li>
                    <li>Mothers_Occupation</li>
                    <li>Mothers_Education (0 to 12)</li>
                    <li>Gender</li>
                    <li>Religion</li>
                    <li>Medium_Of_Instruction</li>
                    <li>Community</li>
                    <li>Disability_Group</li>
                    <li>Attendance(Regular/Not Regular)</li>
                    <li>Long_Absentees(Yes/No)</li>
                    <li>Single_Parent(Yes/No)</li>
                    <li>Smoker</li>
                    <li>Conduct(Bad/Good/Very Good)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-1 font-medium">File Size Limit</h3>
                  <p className="text-sm text-gray-500">Maximum 5MB</p>
                </div>

                <div>
                  <h3 className="mb-1 font-medium">Need Help?</h3>
                  <p className="text-sm text-gray-500">
                    Download our{" "}
                    <a href="#" className="text-pink-500 hover:underline">
                      sample template
                    </a>{" "}
                    or contact{" "}
                    <a href="#" className="text-pink-500 hover:underline">
                      support
                    </a>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


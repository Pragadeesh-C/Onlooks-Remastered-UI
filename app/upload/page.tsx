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
import { useApi } from '@/hooks/useApi'
import { config } from '@/config'

export default function UploadPage() {
  const router = useRouter()
  const { setPredictions } = usePredictions()
  const { fetchWithAuth } = useApi()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [apiResponse, setApiResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState(0)

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

  const simulateAnalysis = () => {
    setIsAnalyzing(true)
    setAnalyzeProgress(0)
    
    const interval = setInterval(() => {
      setAnalyzeProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 10
      })
    }, 600)

    return () => clearInterval(interval)
  }

  const handleUpload = async (formData: FormData) => {
    if (!file) return;

    setIsUploading(true);
    setIsAnalyzing(false);
    setUploadProgress(0);
    setAnalyzeProgress(0);
    setError(null);
    setSuccess(false);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${config.apiUrl}/upload/`, true);

      const token = localStorage.getItem('token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(Math.min(95, progress + Math.random() * 5));
        }
      };

      xhr.onload = async () => {
        try {
          if (xhr.status === 200) {
            setUploadProgress(100);
            setIsUploading(false);
            setIsAnalyzing(true);
            
            const interval = setInterval(() => {
              setAnalyzeProgress((prev) => {
                if (prev >= 95) {
                  clearInterval(interval);
                  return prev;
                }
                return prev + Math.random() * 10;
              });
            }, 600);
            
            const data = JSON.parse(xhr.responseText);
            const predictions = data.map((item: any) => ({
              student_name: item["Student Name"] || item.student_name || item.name,
              Student_Name: item["Student Name"] || item.student_name || item.name,
              ML_Prediction: item["ML Prediction"] || item.ML_Prediction,
              Similar_Students: item["Similar Students"] || item.Similar_Students || [],
              Insights: item.Insights || ""
            }));
            
            setAnalyzeProgress(100);
            clearInterval(interval);
            setPredictions(predictions);
            
            setTimeout(() => {
              setSuccess(true);
              setIsAnalyzing(false);
              router.push('/predictions');
            }, 1000);
          } else {
            const errorData = JSON.parse(xhr.responseText);
            if (xhr.status === 401 && errorData.detail === "Token has expired") {
              // Clear token and redirect to login
              localStorage.removeItem('token');
              router.push('/login');
              setError('Session expired. Please log in again.');
            } else {
              setError(errorData.detail || 'Upload failed. Please try again.');
            }
            setIsUploading(false);
            setIsAnalyzing(false);
          }
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          setError('Invalid response from server');
          setIsAnalyzing(false);
          setIsUploading(false);
        }
      };

      xhr.onerror = () => {
        setError('Network error occurred. Please try again.');
        setIsUploading(false);
        setIsAnalyzing(false);
      };

      xhr.send(formData);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file');
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

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

              {(isUploading || isAnalyzing) && (
                <div className="mb-4">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      {isAnalyzing ? (
                        <>
                          <svg className="h-4 w-4 animate-spin text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing student data...
                        </>
                      ) : (
                        "Uploading..."
                      )}
                    </span>
                    <span>{isAnalyzing ? `${Math.round(analyzeProgress)}%` : `${Math.round(uploadProgress)}%`}</span>
                  </div>
                  <Progress 
                    value={isAnalyzing ? analyzeProgress : uploadProgress} 
                    className={`h-2 transition-all duration-300 ${
                      isAnalyzing ? 'bg-indigo-200' : 'bg-pink-200'
                    }`}
                  />
                  {isAnalyzing && (
                    <div className="mt-4 space-y-2 rounded-lg bg-indigo-50 p-4 text-sm text-indigo-700">
                      <p className="font-medium">Analysis in progress:</p>
                      <ul className="list-inside list-disc space-y-1 pl-4">
                        <li>Processing student data</li>
                        <li>Generating ML predictions</li>
                        <li>Creating personalized insights</li>
                        <li>Identifying risk factors</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    const formData = new FormData();
                    if (file) {
                      formData.append('file', file);
                      handleUpload(formData);
                    }
                  }}
                  disabled={!file || isUploading || isAnalyzing || success}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  {isUploading ? "Uploading..." : isAnalyzing ? "Analyzing..." : "Upload and Analyze"}
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
                    <a 
                      href="/sample_template.csv" 
                      download="student-data-template.csv"
                      className="text-pink-500 hover:underline"
                    >
                      sample template
                    </a>
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


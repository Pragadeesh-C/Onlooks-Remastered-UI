"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, FileSpreadsheet, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApi } from '@/hooks/useApi';
import { config } from '@/config';

export default function LoginPage() {
  const router = useRouter()
  const { fetchWithAuth } = useApi();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
      const token = localStorage.getItem("token");
  
      if (token) {
        // Validate token by checking expiry
        try {
          const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
          const isExpired = payload.exp * 1000 < Date.now();
  
          if (!isExpired) {
            router.push("/dashboard"); // Redirect to dashboard if token is valid
            return;
          }
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
  
    }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${config.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#c9f0ff] via-[#f5e6fb] to-[#ffcef3] p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-2">
              <FileSpreadsheet className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Onlooks</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link href="/forgot-password" className="text-xs text-pink-500 hover:underline">
                    Forgot password?
                  </Link> */}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <LogIn className="h-4 w-4" />
                    Login
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-pink-500 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


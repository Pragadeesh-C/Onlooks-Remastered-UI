"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, FileSpreadsheet, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApi } from '@/hooks/useApi';
import { config } from '@/config';

export default function RegisterPage() {
  const router = useRouter()
  const { fetchWithAuth } = useApi();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    school_name: "",
  })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${config.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          school_name: formData.school_name,
          role: "teacher",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
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
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>Register to start predicting student outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="teacher@school.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School Name</Label>
                <Input
                  id="school_name"
                  name="school_name"
                  placeholder="ABC School"
                  value={formData.school_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-pink-500 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


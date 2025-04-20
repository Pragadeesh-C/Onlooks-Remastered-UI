"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, FileSpreadsheet, Home, LogOut, Menu, Settings, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { jwtDecode } from "jwt-decode"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; role: string; school_name: string } | null>(null)
  const pathname = usePathname()
  const router = useRouter() // for navigation

  const isActive = (path: string) => {
    return pathname === path
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded: any = jwtDecode(token)
        setUser({
          email: decoded.sub, // Extract email (sub) from the token
          role: decoded.role, // Extract role
          school_name: decoded.school_name, // Extract school name
        })
      } catch (error) {
        console.error("Failed to decode token:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token") // Remove token from local storage
    setUser(null) // Clear the user state
    router.push("/login") // Redirect to login page
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto flex h-14 max-w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="rounded-lg bg-pink-500 p-1">
              <FileSpreadsheet className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-pink-500">Onlooks</span>
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/dashboard")
                ? "bg-pink-50 text-pink-500"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/upload"
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/upload")
                ? "bg-pink-50 text-pink-500"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Upload Data
          </Link>
          <Link
            href="/predictions"
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/predictions")
                ? "bg-pink-50 text-pink-500"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Predictions
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.email || "User"} />
                <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">{user?.email || "User"}</span>
              <span className="text-xs text-gray-500">{user?.role || "Admin"}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.email || "User"} />
                  <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.email || "User"}</p>
                  <p className="text-sm text-muted-foreground">{user?.school_name || "No School Name"}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center text-red-500 hover:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-b bg-white p-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isActive("/dashboard")
                  ? "bg-pink-50 text-pink-500"
                  : "text-gray-600 hover:bg-gray-50 hover:text-pink-500"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/upload"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isActive("/upload") ? "bg-pink-50 text-pink-500" : "text-gray-600 hover:bg-gray-50 hover:text-pink-500"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Upload Data
            </Link>
            <Link
              href="/predictions"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isActive("/predictions") ? "bg-pink-50 text-pink-500" : "text-gray-600 hover:bg-gray-50 hover:text-pink-500"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Predictions
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isActive("/settings")
                  ? "bg-pink-50 text-pink-500"
                  : "text-gray-600 hover:bg-gray-50 hover:text-pink-500"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

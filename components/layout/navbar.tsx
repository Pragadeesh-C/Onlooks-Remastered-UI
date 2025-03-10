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
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-1">
              <FileSpreadsheet className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Onlooks</span>
          </Link>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 text-sm font-medium ${
              isActive("/dashboard") ? "text-pink-500" : "text-gray-600 hover:text-pink-500"
            }`}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/upload"
            className={`flex items-center gap-2 text-sm font-medium ${
              isActive("/upload") ? "text-pink-500" : "text-gray-600 hover:text-pink-500"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Upload Data
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-2 text-sm font-medium ${
              isActive("/settings") ? "text-pink-500" : "text-gray-600 hover:text-pink-500"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Teacher" />
                  <AvatarFallback>TC</AvatarFallback>
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
                <Link href="/profile" className="flex w-full cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex w-full cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
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

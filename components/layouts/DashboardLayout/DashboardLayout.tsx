import { Layers } from "lucide-react"
import Link from "next/link"
import React from "react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-900 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">portier sync</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 ml-10">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Integrations
            </Link>
            <Link href="/users" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Users
            </Link>
            <Link href="/doors" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Doors
            </Link>
            <Link href="/keys" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Keys
            </Link>
          </nav>

          <div className="flex items-center gap-4 ml-auto">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">{children}</main>

      <footer className="border-t border-slate-200 py-6 bg-white mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} portier. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

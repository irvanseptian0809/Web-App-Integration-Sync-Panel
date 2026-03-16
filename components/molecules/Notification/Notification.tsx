"use client"

import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react"
import React, { useEffect } from "react"

import { useNotificationsStore } from "@/stores/notifications/notificationsStore"
import { cn } from "@/utils/cn"

import { NotificationProps } from "./interfaces"

export function Notification({ className }: NotificationProps) {
  const { isOpen, type, title, message, code, hideNotification } = useNotificationsStore()

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        hideNotification()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, hideNotification])

  if (!isOpen) return null

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  }

  const bgColors = {
    success: "bg-emerald-50 border-emerald-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
    warning: "bg-amber-50 border-amber-200",
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        role="alert"
        className={cn(
          "flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm w-full",
          bgColors[type],
          className,
        )}
      >
        <div className="shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <p className="mt-1 text-sm text-slate-600 leading-relaxed">{message}</p>
          {code && (
            <div className="mt-2 inline-flex items-center rounded-md bg-white/60 px-2 py-1 text-xs font-mono font-medium text-slate-700 border border-slate-200/50">
              Error Code: {code}
            </div>
          )}
        </div>
        <button
          onClick={hideNotification}
          className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  )
}

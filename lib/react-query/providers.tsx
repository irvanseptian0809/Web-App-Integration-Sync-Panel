"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useEffect, useState } from "react"

import { getQueryClient } from "./queryClient"

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

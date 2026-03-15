"use client"

import { Filter, Plus, Search } from "lucide-react"
import React, { useMemo, useState } from "react"

import { Button } from "@/components/atoms/Button"
import { TypographyH2, TypographyP } from "@/components/atoms/Typography"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { AddIntegrationModal } from "@/components/organisms/AddIntegrationModal"
import { IntegrationsTable } from "@/components/organisms/IntegrationsTable"
import { useIntegrationStore } from "@/stores/integrationStore"

export default function Home() {
  const integrations = useIntegrationStore((state) => state.integrations)
  const pendingChanges = useIntegrationStore((state) => state.pendingChanges)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      const matchesSearch =
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.provider.toLowerCase().includes(searchQuery.toLowerCase())

      const effectiveStatus =
        pendingChanges[integration.id]?.length > 0 ? "conflict" : integration.status
      const matchesStatus = statusFilter === "all" || effectiveStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [integrations, pendingChanges, searchQuery, statusFilter])

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <TypographyH2>Connected Integrations</TypographyH2>
          <TypographyP className="text-slate-500">
            Manage your third-party integrations and monitor synchronization statuses.
          </TypographyP>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white md:w-auto w-full"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Integration
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-auto flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="synced">Synced (Healthy)</option>
            <option value="syncing">Syncing (Active)</option>
            <option value="conflict">Conflict (Review Needed)</option>
            <option value="error">Error (Failed)</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <IntegrationsTable integrations={filteredIntegrations} />

      <AddIntegrationModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </DashboardLayout>
  )
}

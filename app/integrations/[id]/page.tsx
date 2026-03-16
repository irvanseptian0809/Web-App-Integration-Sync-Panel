"use client"

import { useMutation } from "@tanstack/react-query"
import { RefreshCw, Trash2 } from "lucide-react"
import { AlertCircle, CalendarSync, Clock, Database } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { TypographyH3, TypographyMuted } from "@/components/atoms/Typography"
import { DataRow } from "@/components/molecules/DataRow"
import { StatusIndicator } from "@/components/molecules/StatusIndicator"
import { RemoveConfirmModal } from "@/components/organisms/RemoveConfirmModal"
import { ResolutionHistoryTable } from "@/components/organisms/ResolutionHistoryTable"
import { ReviewChangesModal } from "@/components/organisms/ReviewChangesModal"
import { SyncDetailTemplate } from "@/components/templates/SyncDetailTemplate"
import { syncApi } from "@/services/syncApi"
import { useIntegrationStore } from "@/stores/integrations/integrationsStore"
import { useNotificationsStore } from "@/stores/notifications/notificationsStore"

export default function IntegrationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id
  const integrationId = rawId || ""

  const integrations = useIntegrationStore((state) => state.integrations)
  const integration = integrations.find((i) => i.id === integrationId)
  const localData = []

  const pendingChanges = useIntegrationStore((state) => state.pendingChanges[integrationId]) || []
  const conflictHistory = useIntegrationStore((state) => state.conflictHistory[integrationId]) || []

  const setPendingChanges = useIntegrationStore((state) => state.setPendingChanges)
  const setIntegrationStatus = useIntegrationStore((state) => state.setIntegrationStatus)

  const showNotification = useNotificationsStore((state) => state.showNotification)

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const { mutate: handleSync, isPending } = useMutation({
    mutationFn: () => syncApi.fetchSyncData(integration?.provider || ""),
    onMutate: () => {
      if (integrationId) {
        setIntegrationStatus(integrationId, "syncing")
      }
    },
    onSuccess: (response) => {
      // Load changes from API into the Zustand store for preview & conflict resolution
      if (
        response?.data?.sync_approval?.changes &&
        response.data.sync_approval.changes.length > 0
      ) {
        setPendingChanges(integrationId, response.data.sync_approval.changes)
        setIntegrationStatus(integrationId, "conflict")
        setIsReviewOpen(true)
      } else {
        setIntegrationStatus(integrationId, "synced")
      }
    },
    onError: (err: any) => {
      if (integrationId) {
        setIntegrationStatus(integrationId, "error")
      }
      showNotification({
        type: "error",
        title: "Sync Request Failed",
        message: err.message || "Failed to fetch the latest sync data from the provider.",
        code: err.code || "ERR_SYNC_FAIL",
      })
    },
  })
  if (!integration) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500">
        Integration not found.
      </div>
    )
  }

  const hasPendingChanges = pendingChanges.length > 0

  const headerAction = (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={() => setIsRemoveModalOpen(true)}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-transparent hover:border-red-200"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Remove
      </Button>

      {hasPendingChanges ? (
        <Button
          onClick={() => setIsReviewOpen(true)}
          className="shrink-0 bg-amber-500 hover:bg-amber-600 border-amber-500 text-white"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Resolve Conflict
        </Button>
      ) : (
        <Button
          onClick={() => handleSync()}
          disabled={isPending || hasPendingChanges}
          className="shrink-0 bg-slate-900 border-slate-900 hover:bg-slate-800"
        >
          {isPending ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Sync Now
        </Button>
      )}
    </div>
  )

  return (
    <SyncDetailTemplate integration={integration} action={headerAction}>
      {/* 3 Metric Grid Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <TypographyMuted className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4" /> Total Records
          </TypographyMuted>
          <div className="text-3xl font-bold text-slate-900">4,567</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <TypographyMuted className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" /> Last Sync Duration
          </TypographyMuted>
          <div className="text-3xl font-bold text-slate-900">22s</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <TypographyMuted className="flex items-center gap-2 mb-2">
            <CalendarSync className="w-4 h-4" /> Last Synced
          </TypographyMuted>
          <div className="text-3xl font-bold text-slate-900">
            {integration.lastSyncTime
              ? new Date(integration.lastSyncTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : "--:--"}
          </div>
          <TypographyMuted className="text-xs mt-1">
            {integration.lastSyncTime
              ? new Date(integration.lastSyncTime).toLocaleDateString()
              : "Never"}
          </TypographyMuted>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Sync Summary & Local Data */}
        <div className="flex-1 space-y-8">
          {/* Figma Reference: Main Sync Summary Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <TypographyH3 className="text-xl mb-6">Sync Summary</TypographyH3>

            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 mb-8">
              <div className="flex justify-between items-center px-5 py-4 hover:bg-slate-50/50">
                <span className="text-sm font-medium text-slate-500">Integration Name</span>
                <span className="text-sm font-semibold text-slate-900">{integration.name}</span>
              </div>
              <div className="flex justify-between items-center px-5 py-4 hover:bg-slate-50/50">
                <span className="text-sm font-medium text-slate-500">Current Status</span>
                <StatusIndicator status={integration.status} />
              </div>
              <div className="flex justify-between items-center px-5 py-4 hover:bg-slate-50/50">
                <span className="text-sm font-medium text-slate-500">Current Version</span>
                <span className="text-sm font-semibold text-slate-900">v{integration.version}</span>
              </div>
              <div className="flex justify-between items-center px-5 py-4 hover:bg-slate-50/50">
                <span className="text-sm font-medium text-slate-500">Last Sync</span>
                <span className="text-sm font-semibold text-slate-900">
                  {integration.lastSyncTime
                    ? new Date(integration.lastSyncTime).toLocaleString()
                    : "Never"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution History Table */}
      <div className="mt-8">
        <ResolutionHistoryTable entries={conflictHistory} pageSize={5} />
      </div>

      {integration && (
        <RemoveConfirmModal
          integration={integration}
          isOpen={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
          onSuccess={() => router.push("/")}
        />
      )}

      {integration && (
        <ReviewChangesModal
          integration={integration}
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
        />
      )}
    </SyncDetailTemplate>
  )
}

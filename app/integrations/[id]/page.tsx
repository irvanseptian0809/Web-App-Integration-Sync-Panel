"use client"

import { useMutation } from "@tanstack/react-query"
import { RefreshCw, Trash2 } from "lucide-react"
import { AlertCircle, CalendarSync, Database } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { TypographyH3, TypographyMuted } from "@/components/atoms/Typography"
import { StatusIndicator } from "@/components/molecules/StatusIndicator"
import { RemoveConfirmModal } from "@/components/organisms/RemoveConfirmModal"
import { ResolutionHistoryTable } from "@/components/pages/integrations/ResolutionHistoryTable"
import { ReviewChangesModal } from "@/components/organisms/ReviewChangesModal"
import { SyncDetailTemplate } from "@/components/templates/SyncDetailTemplate"
import { syncApi } from "@/services/syncApi"
import { useIntegrationStore } from "@/stores/integrations/integrationsStore"
import { useUserStore } from "@/stores/users/usersStore"
import { useKeyStore } from "@/stores/keys/keysStore"
import { useNotificationsStore } from "@/stores/notifications/notificationsStore"
import { User, Key } from "@/interface/types"

export default function IntegrationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id
  const integrationId = rawId || ""

  const integrations = useIntegrationStore((state) => state.integrations)
  const integration = integrations.find((i) => i.id === integrationId)

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

  const users = useUserStore((state) => state.users)
  const keys = useKeyStore((state) => state.keys)

  const providerUsersCount = users.filter((u: User) => u.provider === integration.provider).length
  const providerKeysCount = keys.filter((k: Key) => k.provider === integration.provider).length

  const totalFieldChanges = conflictHistory.reduce((acc, entry) => acc + (entry.fields?.length || 0), 0)

  return (
    <SyncDetailTemplate integration={integration} action={headerAction}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <TypographyMuted className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4" /> Total Records
          </TypographyMuted>
          <div className="text-3xl font-bold text-slate-900">
            {totalFieldChanges.toLocaleString()}
          </div>
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

      <div className="flex flex-col gap-8">
        {/* Sync Summary Card - Redesigned for Efficiency */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <TypographyH3 className="text-lg">Sync Summary</TypographyH3>
            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 font-medium text-[10px] uppercase tracking-wider">
              Provider: {integration.provider}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
              <div className="flex items-center">
                <StatusIndicator status={integration.status} />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Version</span>
              <div className="text-sm font-semibold text-slate-900">v{integration.version}</div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Associated Users</span>
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                {providerUsersCount} Users
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Associated Keys</span>
              <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                {providerKeysCount} Keys
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

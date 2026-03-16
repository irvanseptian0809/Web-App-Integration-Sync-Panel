"use client"

import { useMutation } from "@tanstack/react-query"
import { Loader2, PlusCircle } from "lucide-react"
import React, { useState } from "react"

import { Button } from "@/components/atoms/Button"
import { TypographyMuted } from "@/components/atoms/Typography"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { Integration } from "@/interface/types"
import { syncApi } from "@/services/syncApi"
import { useIntegrationStore } from "@/stores/integrations/integrationsStore"
import { useNotificationsStore } from "@/stores/notifications/notificationsStore"

import { AddIntegrationModalProps } from "./interfaces"
import { useUserStore } from "@/stores/users/usersStore"
import { useKeyStore } from "@/stores/keys/keysStore"

const SUPPORTED_PROVIDERS = ["salesforce", "hubspot", "stripe", "slack", "zendesk", "intercom"]

export function AddIntegrationModal({ isOpen, onClose }: AddIntegrationModalProps) {
  const [provider, setProvider] = useState("salesforce")
  const [errorLocal, setErrorLocal] = useState("")

  const addIntegration = useIntegrationStore((state) => state.addIntegration)
  const addUsers = useUserStore((state) => state.addUser)
  const addKey = useKeyStore((state) => state.addKey)
  const integrations = useIntegrationStore((state) => state.integrations)
  const showNotification = useNotificationsStore((state) => state.showNotification)

  const { mutate: handleAdd, isPending } = useMutation({
    mutationFn: async () => {
      if (integrations.some((i) => i.provider === provider)) {
        throw new Error(`You already have a ${provider} integration connected.`)
      }

      const res = await syncApi.fetchSyncData(provider)
      return {
        provider: provider,
        data: res?.data?.sync_approval?.changes || [],
      }
    },
    onSuccess: ({ provider, data }) => {
      // Process Sync Data into structured entities (single user and single key)
      const userId = `user_${Date.now()}`
      const usersMap: Record<string, any> = {
        id: userId,
        provider,
        status: "active",
        role: "Member",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const keysMap: Record<string, any> = {
        id: `key_${Date.now()}`,
        user_id: userId,
        status: "active",
        created_at: new Date().toISOString(),
        access_start: new Date().toISOString(),
        access_end: new Date(Date.now() + 86400000 * 30).toISOString(), // Default 30 days
      }

      data.forEach((change: any) => {
        const [entityType, field] = change.field_name.split(".")
        const value = change.new_value || change.current_value

        if (entityType === "user" && field) {
          usersMap[field] = value
          if (field === "id") {
            keysMap.user_id = value
          }
        }

        if (entityType === "key" && field) {
          keysMap[field] = value
        }
      })

      const newIntegration: Integration = {
        id: `int_${Date.now()}`,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Connection`,
        provider,
        status: "synced",
        lastSyncTime: new Date().toISOString(),
        version: 1,
        logo: `https://api.dicebear.com/7.x/icons/svg?seed=${provider}`,
      }

      // Add processed objects to stores
      addUsers(usersMap as any)
      addKey(keysMap as any)
      addIntegration(newIntegration)

      setProvider("salesforce")
      setErrorLocal("")
      onClose()
    },
    onError: (err: any) => {
      setErrorLocal(err.message || "Failed to connect integration.")
      showNotification({
        type: "error",
        title: "Connection Failed",
        message: err.message || "Could not establish a connection to the integration provider.",
        code: err.code || "ERR_CONNECTION_REFUSED",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorLocal("")
    handleAdd()
  }

  const footer = (
    <div className="flex items-center gap-3 w-full justify-end">
      <Button variant="ghost" type="button" onClick={onClose} disabled={isPending}>
        Cancel
      </Button>
      <Button
        type="submit"
        form="add-integration-form"
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4 mr-2" /> Connect Integration
          </>
        )}
      </Button>
    </div>
  )

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Connect New Integration"
      description="Select a supported provider to sync data with Portier."
      footer={footer}
    >
      <form id="add-integration-form" onSubmit={handleSubmit} className="mt-4 space-y-4">
        {errorLocal && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
            {errorLocal}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Application Provider (application_id)
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            disabled={isPending}
            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all capitalize"
          >
            {SUPPORTED_PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <TypographyMuted className="mt-2 text-xs">
            Connecting will immediately fetch structural data from the provider to establish a
            'synced' baseline.
          </TypographyMuted>
        </div>
      </form>
    </ModalWrapper>
  )
}

"use client"

import { Plus, Search } from "lucide-react"
import React, { useMemo, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/atoms/Button"
import { TypographyH2, TypographyP } from "@/components/atoms/Typography"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { EntityDeleteModal } from "@/components/organisms/EntityDeleteModal/EntityDeleteModal"
import { KeyForm } from "@/components/pages/keys/KeyForm/KeyForm"
import { KeysTable } from "@/components/pages/keys/KeysTable/KeysTable"
import { useKeyStore } from "@/stores/keys/keysStore"
import { Key } from "@/interface/types"

export default function KeysPage() {
  const { keys, addKey, updateKey, removeKey } = useKeyStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingKey, setEditingKey] = useState<Key | null>(null)
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null)

  const filteredKeys = useMemo(() => {
    return keys.filter((key) =>
      key?.key_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (key?.id && key.id.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [keys, searchQuery])

  const handleAddKey = (data: Partial<Key>) => {
    const newKey: Key = {
      id: uuidv4(),
      user_id: data.user_id || "",
      door_id: data.door_id || "",
      key_type: data.key_type || "Digital",
      status: (data.status as any) || "active",
      access_start: data.access_start || new Date().toISOString(),
      access_end: data.access_end || new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    addKey(newKey)
    setIsAddModalOpen(false)
  }

  const handleUpdateKey = (data: Partial<Key>) => {
    if (!editingKey) return
    const updatedKey: Key = {
      ...editingKey,
      ...data,
    } as Key
    updateKey(updatedKey)
    setEditingKey(null)
  }

  const handleDeleteKey = () => {
    if (deletingKeyId) {
      removeKey(deletingKeyId)
      setDeletingKeyId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <TypographyH2>Access Keys</TypographyH2>
          <TypographyP className="text-slate-500">
            Issue and manage access permissions for users and doors.
          </TypographyP>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white md:w-auto w-full"
        >
          <Plus className="w-4 h-4 mr-2" /> Issue Key
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div className="relative w-full md:w-auto flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search keys by type or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <KeysTable
        keysList={filteredKeys}
        onEdit={setEditingKey}
        onDelete={setDeletingKeyId}
      />

      {/* Issue Key Modal */}
      <ModalWrapper
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Issue New Key"
        description="Assign a new access key to a user for a specific door."
      >
        <KeyForm onSubmit={handleAddKey} onCancel={() => setIsAddModalOpen(false)} />
      </ModalWrapper>

      {/* Edit Key Modal */}
      <ModalWrapper
        isOpen={!!editingKey}
        onClose={() => setEditingKey(null)}
        title="Modify Key"
        description="Update access period or status for this key."
      >
        {editingKey && (
          <KeyForm
            initialData={editingKey}
            onSubmit={handleUpdateKey}
            onCancel={() => setEditingKey(null)}
          />
        )}
      </ModalWrapper>

      {/* Delete Key Modal */}
      <EntityDeleteModal
        isOpen={!!deletingKeyId}
        onClose={() => setDeletingKeyId(null)}
        onConfirm={handleDeleteKey}
        entityName={`Key ${deletingKeyId ? deletingKeyId.slice(0, 8) : "New"}`}
        entityType="Key"
      />
    </DashboardLayout>
  )
}

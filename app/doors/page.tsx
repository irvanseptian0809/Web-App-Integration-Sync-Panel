"use client"

import { Plus, Search, Filter, Trash2, CheckSquare } from "lucide-react"
import React, { useMemo, useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/atoms/Button"
import { TypographyH2, TypographyP } from "@/components/atoms/Typography"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { EntityDeleteModal } from "@/components/organisms/EntityDeleteModal/EntityDeleteModal"
import { DoorForm } from "@/components/pages/doors/DoorForm/DoorForm"
import { DoorsTable } from "@/components/pages/doors/DoorsTable/DoorsTable"
import { useDoorStore } from "@/stores/doors/doorsStore"
import { Door } from "@/interface/types"
import { useNotificationsStore } from "@/stores/notifications/notificationsStore"

export default function DoorsPage() {
  const { doors, addDoor, updateDoor, removeDoor } = useDoorStore()
  const showNotification = useNotificationsStore((state) => state.showNotification)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingDoor, setEditingDoor] = useState<Door | null>(null)
  const [deletingDoorId, setDeletingDoorId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filteredDoors = useMemo(() => {
    return doors.filter((door) => {
      const matchesSearch =
        !searchQuery ||
        door.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        door.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        door.device_id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || door.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [doors, searchQuery, statusFilter])

  const handleAddDoor = (data: Partial<Door>) => {
    const newDoor: Door = {
      id: uuidv4(),
      name: data.name || "",
      location: data.location || "",
      device_id: data.device_id || "",
      status: (data.status as any) || "online",
      battery_level: data.battery_level || 100,
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
    addDoor(newDoor)
    setIsAddModalOpen(false)
    showNotification({
      type: "success",
      title: "Door Added",
      message: `${newDoor.name} has been successfully provisioned.`,
    })
  }

  const handleUpdateDoor = (data: Partial<Door>) => {
    if (!editingDoor) return
    const updatedDoor: Door = {
      ...editingDoor,
      ...data,
      last_seen: new Date().toISOString(),
    } as Door
    updateDoor(updatedDoor)
    setEditingDoor(null)
    showNotification({
      type: "success",
      title: "Door Updated",
      message: `${updatedDoor.name} details have been updated.`,
    })
  }

  const handleDeleteDoor = () => {
    if (deletingDoorId) {
      removeDoor(deletingDoorId)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(deletingDoorId)
        return next
      })
      setDeletingDoorId(null)
      showNotification({
        type: "success",
        title: "Door Removed",
        message: "The access point has been removed from the system.",
      })
    }
  }

  const handleBulkDelete = () => {
    const count = selectedIds.size
    selectedIds.forEach((id) => removeDoor(id))
    setSelectedIds(new Set())
    showNotification({
      type: "success",
      title: "Access Points Removed",
      message: `Successfully removed ${count} doors from the system.`,
    })
  }

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredDoors.length && filteredDoors.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredDoors.map((d) => d.id || "")))
    }
  }, [selectedIds, filteredDoors])

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const deletingDoorName = doors.find(d => d.id === deletingDoorId)?.name || ""
  const selectedCount = selectedIds.size

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <TypographyH2>Access Points (Doors)</TypographyH2>
          <TypographyP className="text-slate-500">
            Monitor and manage physical access points across your locations.
          </TypographyP>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white md:w-auto w-full"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Door
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search doors or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`w-full md:w-auto ${isFilterOpen ? 'bg-slate-100 border-slate-300' : ''}`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {statusFilter !== "all" && (
              <span className="ml-2 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="flex items-center justify-between gap-4 px-6 py-3 mb-4 rounded-xl border border-blue-200 bg-blue-50/60 animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
            <CheckSquare className="w-4 h-4 text-blue-500" />
            <span>{selectedCount} door{selectedCount > 1 ? "s" : ""} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} className="text-slate-500 hover:text-slate-700">Clear selection</Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700"><Trash2 className="w-4 h-4 mr-2" /> Remove Selected</Button>
          </div>
        </div>
      )}

      <DoorsTable
        doors={filteredDoors}
        onEdit={setEditingDoor}
        onDelete={setDeletingDoorId}
        selectedIds={selectedIds}
        onToggleRow={toggleRow}
        onToggleAll={toggleSelectAll}
      />

      <ModalWrapper
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Door"
        description="Provision a new access point in the system."
      >
        <DoorForm onSubmit={handleAddDoor} onCancel={() => setIsAddModalOpen(false)} />
      </ModalWrapper>

      <ModalWrapper
        isOpen={!!editingDoor}
        onClose={() => setEditingDoor(null)}
        title="Edit Door"
        description="Update door details and status."
      >
        {editingDoor && (
          <DoorForm
            initialData={editingDoor}
            onSubmit={handleUpdateDoor}
            onCancel={() => setEditingDoor(null)}
          />
        )}
      </ModalWrapper>

      <EntityDeleteModal
        isOpen={!!deletingDoorId}
        onClose={() => setDeletingDoorId(null)}
        onConfirm={handleDeleteDoor}
        entityName={deletingDoorName}
        entityType="Door"
      />
    </DashboardLayout>
  )
}

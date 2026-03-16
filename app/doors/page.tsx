"use client"

import { Plus, Search, MapPin } from "lucide-react"
import React, { useMemo, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/atoms/Button"
import { TypographyH2, TypographyP } from "@/components/atoms/Typography"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { EntityDeleteModal } from "@/components/organisms/EntityDeleteModal/EntityDeleteModal"
import { DoorForm } from "@/components/organisms/DoorForm/DoorForm"
import { DoorsTable } from "@/components/organisms/DoorsTable/DoorsTable"
import { useDoorStore } from "@/stores/doorStore"
import { Door } from "@/interface/types"

export default function DoorsPage() {
  const { doors, addDoor, updateDoor, removeDoor } = useDoorStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingDoor, setEditingDoor] = useState<Door | null>(null)
  const [deletingDoorId, setDeletingDoorId] = useState<string | null>(null)

  const filteredDoors = useMemo(() => {
    return doors.filter((door) =>
      door.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      door.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      door.device_id.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [doors, searchQuery])

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
  }

  const handleDeleteDoor = () => {
    if (deletingDoorId) {
      removeDoor(deletingDoorId)
      setDeletingDoorId(null)
    }
  }

  const deletingDoorName = doors.find(d => d.id === deletingDoorId)?.name || ""

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

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div className="relative w-full md:w-auto flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search doors or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <DoorsTable 
        doors={filteredDoors} 
        onEdit={setEditingDoor} 
        onDelete={setDeletingDoorId} 
      />

      {/* Add Door Modal */}
      <ModalWrapper
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Door"
        description="Provision a new access point in the system."
      >
        <DoorForm onSubmit={handleAddDoor} onCancel={() => setIsAddModalOpen(false)} />
      </ModalWrapper>

      {/* Edit Door Modal */}
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

      {/* Delete Door Modal */}
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

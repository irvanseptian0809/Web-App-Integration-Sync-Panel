import React, { useState } from "react"
import { Key, KeyStatus } from "@/interface/types"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { useUserStore } from "@/stores/userStore"
import { useDoorStore } from "@/stores/doorStore"

interface KeyFormProps {
  initialData?: Partial<Key>
  onSubmit: (data: Partial<Key>) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function KeyForm({ initialData, onSubmit, onCancel, isSubmitting }: KeyFormProps) {
  const users = useUserStore((state) => state.users)
  const doors = useDoorStore((state) => state.doors)

  const [formData, setFormData] = useState<Partial<Key>>({
    user_id: initialData?.user_id || users[0]?.id || "",
    door_id: initialData?.door_id || doors[0]?.id || "",
    key_type: initialData?.key_type || "Digital",
    status: initialData?.status || "active",
    access_start: initialData?.access_start || new Date().toISOString().split("T")[0],
    access_end: initialData?.access_end || new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
    ...initialData,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Assign User</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          >
            <option value="" disabled>Select User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Target Door</label>
          <select
            name="door_id"
            value={formData.door_id}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          >
            <option value="" disabled>Select Door</option>
            {doors.map(door => (
              <option key={door.id} value={door.id}>{door.name} ({door.location})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Key Type</label>
          <Input
            name="key_type"
            value={formData.key_type}
            onChange={handleChange}
            placeholder="e.g. Digital, Physical, Guest"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Access Start</label>
            <Input
              type="date"
              name="access_start"
              value={formData.access_start?.split("T")[0]}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Access End</label>
            <Input
              type="date"
              name="access_end"
              value={formData.access_end?.split("T")[0]}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
          {initialData?.id ? "Update Key" : "Issue Key"}
        </Button>
      </div>
    </form>
  )
}

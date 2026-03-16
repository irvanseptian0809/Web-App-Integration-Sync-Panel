import React, { useState } from "react"
import { Door } from "@/interface/types"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"
import { DoorFormProps } from "./interface"

export function DoorForm({ initialData, onSubmit, onCancel, isSubmitting }: DoorFormProps) {
  const [formData, setFormData] = useState<Partial<Door>>({
    name: initialData?.name || "",
    location: initialData?.location || "",
    device_id: initialData?.device_id || "",
    status: initialData?.status || "online",
    battery_level: initialData?.battery_level || 100,
    ...initialData,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "battery_level" ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="door-name" className="block text-sm font-medium text-slate-700 mb-1">Door Name</label>
          <Input
            id="door-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Front Entrance"
            required
          />
        </div>
        <div>
          <label htmlFor="door-location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <Input
            id="door-location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Ground Floor, Wing A"
            required
          />
        </div>
        <div>
          <label htmlFor="door-device-id" className="block text-sm font-medium text-slate-700 mb-1">Device ID</label>
          <Input
            id="door-device-id"
            name="device_id"
            value={formData.device_id}
            onChange={handleChange}
            placeholder="e.g. HW-098-X"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="door-battery" className="block text-sm font-medium text-slate-700 mb-1">Battery Level (%)</label>
            <Input
              id="door-battery"
              type="number"
              name="battery_level"
              min="0"
              max="100"
              value={formData.battery_level}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="door-status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              id="door-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
          {initialData?.id ? "Update Door" : "Create Door"}
        </Button>
      </div>
    </form>
  )
}

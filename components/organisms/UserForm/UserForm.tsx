import React, { useState } from "react"
import { User, UserStatus } from "@/interface/types"
import { Button } from "@/components/atoms/Button"
import { Input } from "@/components/atoms/Input"

interface UserFormProps {
  initialData?: Partial<User>
  onSubmit: (data: Partial<User>) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function UserForm({ initialData, onSubmit, onCancel, isSubmitting }: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    role: initialData?.role || "",
    status: initialData?.status || "active",
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 890"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
          <Input
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Admin, Editor"
            required
          />
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
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
          {initialData?.id ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  )
}

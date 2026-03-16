"use client"

import React, { useMemo, useState, useCallback } from "react"
import { Plus, Search, Filter, Trash2, CheckSquare } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/atoms/Button"
import { TypographyH2, TypographyP } from "@/components/atoms/Typography"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { EntityDeleteModal } from "@/components/organisms/EntityDeleteModal/EntityDeleteModal"
import { UserForm } from "@/components/organisms/UserForm/UserForm"
import { UsersTable } from "@/components/organisms/UsersTable/UsersTable"
import { useUserStore } from "@/stores/users/usersStore"
import { User } from "@/interface/types"
import { useNotificationsStore } from "@/stores/notifications/notificationsStore"

export default function UsersPage() {
  const { users, addUser, updateUser, removeUser } = useUserStore()
  const showNotification = useNotificationsStore((state) => state.showNotification)

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const roles = useMemo(() => {
    const uniqueRoles = new Set(users.map((u) => u.role).filter(Boolean))
    return Array.from(uniqueRoles)
  }, [users])

  const providers = useMemo(() => {
    const uniqueProviders = new Set(users.map((u) => u.provider).filter(Boolean))
    return Array.from(uniqueProviders)
  }, [users])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchQuery ||
        user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.role?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      const matchesProvider = providerFilter === "all" || user.provider === providerFilter

      return matchesSearch && matchesRole && matchesStatus && matchesProvider
    })
  }, [users, searchQuery, roleFilter, statusFilter, providerFilter])

  const handleAddUser = (data: Partial<User>) => {
    const newUser: User = {
      id: uuidv4(),
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      role: data.role || "",
      status: (data.status as any) || "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    addUser(newUser)
    setIsAddModalOpen(false)
    showNotification({
      type: "success",
      title: "User Created",
      message: `${newUser.name} has been added to the system.`,
    })
  }

  const handleUpdateUser = (data: Partial<User>) => {
    if (!editingUser) return
    const updatedUser: User = {
      ...editingUser,
      ...data,
      updated_at: new Date().toISOString(),
    } as User
    updateUser(updatedUser)
    setEditingUser(null)
    showNotification({
      type: "success",
      title: "User Updated",
      message: `${updatedUser.name} information has been updated.`,
    })
  }

  const handleDeleteUser = () => {
    if (deletingUserId) {
      removeUser(deletingUserId)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(deletingUserId)
        return next
      })
      setDeletingUserId(null)
      showNotification({
        type: "success",
        title: "User Removed",
        message: "The user has been successfully removed from the system.",
      })
    }
  }

  const handleBulkDelete = () => {
    const count = selectedIds.size
    selectedIds.forEach((id) => removeUser(id))
    setSelectedIds(new Set())
    showNotification({
      type: "success",
      title: "Users Removed",
      message: `Successfully removed ${count} users from the system.`,
    })
  }

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredUsers.map((u) => u.id || "")))
    }
  }, [selectedIds, filteredUsers])

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const deletingUserName = users.find(u => u.id === deletingUserId)?.name || ""
  const selectedCount = selectedIds.size

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <TypographyH2>Users Management</TypographyH2>
          <TypographyP className="text-slate-500">
            Manage your local users, their roles, and access status.
          </TypographyP>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white md:w-auto w-full"
        >
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
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
            {(roleFilter !== "all" || statusFilter !== "all" || providerFilter !== "all") && (
              <span className="ml-2 w-2 h-2 rounded-full bg-blue-500" />
            )}
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Integration</label>
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Providers</option>
              {providers.map(provider => <option key={provider} value={provider}>{provider}</option>)}
            </select>
          </div>
        </div>
      )}

      {selectedCount > 0 && (
        <div className="flex items-center justify-between gap-4 px-6 py-3 mb-4 rounded-xl border border-blue-200 bg-blue-50/60 animate-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
            <CheckSquare className="w-4 h-4 text-blue-500" />
            <span>{selectedCount} user{selectedCount > 1 ? "s" : ""} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} className="text-slate-500 hover:text-slate-700">Clear selection</Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700"><Trash2 className="w-4 h-4 mr-2" /> Remove Selected</Button>
          </div>
        </div>
      )}

      <UsersTable
        users={filteredUsers}
        onEdit={setEditingUser}
        onDelete={setDeletingUserId}
        selectedIds={selectedIds}
        onToggleRow={toggleRow}
        onToggleAll={toggleSelectAll}
      />

      {/* Add User Modal */}
      <ModalWrapper
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        description="Fill in the details to create a new user."
      >
        <UserForm onSubmit={handleAddUser} onCancel={() => setIsAddModalOpen(false)} />
      </ModalWrapper>

      {/* Edit User Modal */}
      <ModalWrapper
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
        description="Update user information and status."
      >
        {editingUser && (
          <UserForm
            initialData={editingUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setEditingUser(null)}
          />
        )}
      </ModalWrapper>

      {/* Delete User Modal */}
      <EntityDeleteModal
        isOpen={!!deletingUserId}
        onClose={() => setDeletingUserId(null)}
        onConfirm={handleDeleteUser}
        entityName={deletingUserName}
        entityType="User"
      />
    </DashboardLayout>
  )
}

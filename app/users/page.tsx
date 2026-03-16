"use client"

import { Plus, Search, Filter } from "lucide-react"
import React, { useMemo, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/atoms/Button"
import { TypographyH2, TypographyP } from "@/components/atoms/Typography"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ModalWrapper } from "@/components/molecules/ModalWrapper"
import { EntityDeleteModal } from "@/components/organisms/EntityDeleteModal/EntityDeleteModal"
import { UserForm } from "@/components/organisms/UserForm/UserForm"
import { UsersTable } from "@/components/organisms/UsersTable/UsersTable"
import { useUserStore } from "@/stores/userStore"
import { User } from "@/interface/types"

export default function UsersPage() {
  const { users, addUser, updateUser, removeUser } = useUserStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [users, searchQuery])

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
  }

  const handleDeleteUser = () => {
    if (deletingUserId) {
      removeUser(deletingUserId)
      setDeletingUserId(null)
    }
  }

  const deletingUserName = users.find(u => u.id === deletingUserId)?.name || ""

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

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div className="relative w-full md:w-auto flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <UsersTable 
        users={filteredUsers} 
        onEdit={setEditingUser} 
        onDelete={setDeletingUserId} 
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

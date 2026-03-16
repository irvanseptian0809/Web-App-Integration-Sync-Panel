"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, Calendar, User as UserIcon, Shield } from "lucide-react"
import React from "react"

import { Badge } from "@/components/atoms/Badge"
import { Button } from "@/components/atoms/Button"
import { TypographyH2, TypographyH3, TypographyMuted, TypographyP } from "@/components/atoms/Typography"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { useUserStore } from "@/stores/userStore"
import { DataRow } from "@/components/molecules/DataRow"

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const user = useUserStore((state) => state.users.find((u) => u.id === userId))

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <TypographyP className="text-slate-500 mb-4">User not found.</TypographyP>
          <Button onClick={() => router.push("/users")}>Back to Users</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/users")}
          className="pl-0 text-slate-500 hover:text-blue-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Users
        </Button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <TypographyH2>{user.name}</TypographyH2>
                <Badge variant={user.status === "active" ? "success" : "warning"}>
                  {user.status}
                </Badge>
              </div>
              <TypographyMuted className="flex items-center gap-2">
                <Shield className="w-4 h-4" /> {user.role}
              </TypographyMuted>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <TypographyH3 className="mb-6">Personal Information</TypographyH3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block uppercase font-semibold">Email Address</span>
                      <span className="text-slate-900 font-medium">{user.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block uppercase font-semibold">Phone Number</span>
                      <span className="text-slate-900 font-medium">{user.phone || "—"}</span>
                    </div>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block uppercase font-semibold">Created At</span>
                      <span className="text-slate-900 font-medium">{new Date(user.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block uppercase font-semibold">Last Updated</span>
                      <span className="text-slate-900 font-medium">{new Date(user.updated_at).toLocaleString()}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             <TypographyH3 className="text-lg mb-4">Quick Stats</TypographyH3>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                   <span className="text-sm text-slate-500">Total Keys Issued</span>
                   <span className="text-lg font-bold text-slate-900">0</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                   <span className="text-sm text-slate-500">Active Sessions</span>
                   <span className="text-lg font-bold text-slate-900">0</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

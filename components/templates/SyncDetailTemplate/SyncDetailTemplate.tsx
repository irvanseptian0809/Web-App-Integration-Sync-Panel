import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { TypographyH2, TypographyMuted } from "@/components/atoms/Typography"
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { StatusIndicator } from "@/components/molecules/StatusIndicator"

import { SyncDetailTemplateProps } from "./interfaces"

export function SyncDetailTemplate({ integration, children, action }: SyncDetailTemplateProps) {
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Integrations
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl border border-slate-100 bg-white p-2 shadow-sm flex items-center justify-center">
            <img
              src={integration.logo}
              alt={integration.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <TypographyH2 className="!border-0 !pb-0 !text-2xl">{integration.name}</TypographyH2>
              <StatusIndicator status={integration.status} />
            </div>
            <TypographyMuted>Version {integration.version}</TypographyMuted>
          </div>
        </div>
        {action && <div className="flex items-center gap-3">{action}</div>}
      </div>

      {children}
    </DashboardLayout>
  )
}

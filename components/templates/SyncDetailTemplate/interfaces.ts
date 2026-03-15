import React from "react"

import { Integration } from "@/interface/types"

export interface SyncDetailTemplateProps {
  integration: Integration
  children: React.ReactNode
  action?: React.ReactNode
}

import { Integration } from "@/modules/integrations/types";
import React from "react";

export interface SyncDetailTemplateProps {
    integration: Integration;
    children: React.ReactNode;
    action?: React.ReactNode;
}

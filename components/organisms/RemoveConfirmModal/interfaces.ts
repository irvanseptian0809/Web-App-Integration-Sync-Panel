import { Integration } from "@/modules/integrations/types";

export interface RemoveConfirmModalProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

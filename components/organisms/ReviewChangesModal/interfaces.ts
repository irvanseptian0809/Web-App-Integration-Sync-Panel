import { Integration } from "@/modules/integrations/types";

export interface ReviewChangesModalProps {
    integration: Integration;
    isOpen: boolean;
    onClose: () => void;
}

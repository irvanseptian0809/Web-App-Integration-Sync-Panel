import React from "react";

export interface DataRowProps {
    label: string;
    value: React.ReactNode;
    subValue?: string;
    className?: string;
}

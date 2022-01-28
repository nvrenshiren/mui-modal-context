import React from 'react';
import { DialogProps } from '@mui/material';
export interface HookModalProps {
    config: Omit<DialogProps, 'open'>;
    afterClose: () => void;
}
export interface HookModalRef {
    destroy: () => void;
    update: (config: Omit<DialogProps, 'open'>) => void;
}
declare const _default: React.ForwardRefExoticComponent<HookModalProps & React.RefAttributes<HookModalRef>>;
export default _default;

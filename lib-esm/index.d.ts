import { ReactElement } from 'react';
import { DialogProps } from '@mui/material';
export declare type modalContentType = (config: Omit<DialogProps, 'open'>) => {
    destroy: () => void;
    update: (newConfig: DialogProps) => void;
};
export declare function useModal(): [modalContentType, ReactElement];

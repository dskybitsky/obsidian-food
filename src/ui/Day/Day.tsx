import React from 'react';
import { Page } from './Page';

export interface DayProps {
    onScan: () => void
}

export const Day = ({ onScan }: DayProps) => {
    return (
        <Page onScanButtonClick={onScan} />
    );
};

import React, {useState} from 'react';
import { Page } from './Page';

export interface DayProps {
    onScan: (setCode: (value: string) => void) => void
}

export const Day = ({ onScan }: DayProps) => {
    const [code, setCode] = useState('');

    return (
        <Page onScanButtonClick={() => onScan(setCode)} code={code} />
    );
};

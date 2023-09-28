import React from 'react';

export interface PageProps {
    code: string,
    onScanButtonClick: () => void
}

export const Page = ({ code, onScanButtonClick }: PageProps) => {
    return (
        <div className="day">
            <p>{code}</p>
            <button onClick={onScanButtonClick}>Scan</button>
        </div>
    );
}


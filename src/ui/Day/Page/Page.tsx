import React from 'react';

export interface PageProps {
    onScanButtonClick: () => void
}

export const Page = ({ onScanButtonClick }: PageProps) => {
    return (
        <div className="day">
            <button onClick={onScanButtonClick}>Scan</button>
        </div>
    );
}


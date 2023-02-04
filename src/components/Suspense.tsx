import React, { FC } from 'react';
import ErrorBoundary from "./ErrorBoundary";

const Suspense: FC<{
    fallback: React.ReactNode;
    children: React.ReactNode;
    name?: string;
    shouldRetry?: boolean;
}> = ({children, fallback, name}) => {
    return (
        <ErrorBoundary name={name}>
            <React.Suspense fallback={fallback}>
                {children}
            </React.Suspense>
        </ErrorBoundary>
    );
}


export default Suspense;
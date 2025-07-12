import { useEffect, useState } from 'react';

/**
 * Updates every second.
 */
export function useSecondRerender(): number {
    const [now, setNow] = useState(() => new Date().getTime());
    // console.log('useSecondRerender', now);

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return now;
}
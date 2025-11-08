import { useEffect, useState } from 'react';

/**
 * Updates every minute, aligned to the `started.getSeconds()`.
 */
export function useMinuteRerender(started: Date): Date {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        let timeout: number;

        const scheduleNextTick = () => {
            const current = new Date();
            setNow(current);

            const startedSecond = started.getSeconds();
            const currentSecond = current.getSeconds();
            const currentMs = currentSecond * 1000 + current.getMilliseconds();
            const targetMs = startedSecond * 1000;

            const delay =
                targetMs >= currentMs
                    ? targetMs - currentMs
                    : 60000 - (currentMs - targetMs);

            timeout = setTimeout(scheduleNextTick, delay);
        };

        scheduleNextTick();

        return () => clearTimeout(timeout);
    }, [started]);

    return now;
}

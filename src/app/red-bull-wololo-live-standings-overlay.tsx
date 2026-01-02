import { PlayerList } from '@app/components/red-bull-wololo-live-standings/_components/player-list';
import { useEffect } from 'react';

export default function RedBullWololoLiveStandingsOverlay() {
    useEffect(() => {
        // Store the original style to restore it later
        const originalBackgroundColor = document.body.style.backgroundColor;

        // Apply the new style
        document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';

        // Cleanup function: runs when the component unmounts
        return () => {
            document.body.style.backgroundColor = originalBackgroundColor;
        };
    }, []);

    return (
        <main
            className="p-6 gap-12 text-white relative selection:bg-blue-600/90 select-none"
            style={{ colorScheme: 'dark' }}
        >
            <PlayerList isPastDeadline={false} limit={10} hideHeader />
        </main>
    );
}

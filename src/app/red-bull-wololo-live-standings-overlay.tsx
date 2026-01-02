import { PlayerList } from "@app/components/red-bull-wololo-live-standings/_components/player-list";
import { useEffect } from "react";

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
        <div className="p-4">
            <PlayerList isPastDeadline={false} limit={10} hideHeader />
        </div>
    );
}
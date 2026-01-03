import { PlayerList } from '@app/components/red-bull-wololo-live-standings/_components/player-list';

export default function RedBullWololoLiveStandingsOverlay() {
    return (
        <main className="gap-12 text-white relative selection:bg-blue-600/90 select-none max-w-[1000px]" style={{ colorScheme: 'dark' }}>
            <PlayerList isPastDeadline={false} limit={12} hideHeader hideCols={['winrates', 'games']} />
        </main>
    );
}

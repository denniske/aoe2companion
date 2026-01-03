import { PlayerList } from '@app/components/red-bull-wololo-live-standings/_components/player-list';
import { useToolbarStyles } from '@app/components/red-bull-wololo-live-standings/_providers/overlay-toolbar-context';
import { OverlayToolbarProvider } from '@app/components/red-bull-wololo-live-standings/_providers/overlay-toolbar-provider';

function RedBullWololoLiveStandingsOverlay() {
    const { container, content } = useToolbarStyles();

    return (
        <main
            className="gap-12 text-white relative selection:bg-blue-600/90 select-none max-w-[1000px]" style={{...container, colorScheme: 'dark'}}
        >
            <div style={content}>
                <PlayerList isPastDeadline={false} limit={12} hideHeader hideCols={['winrates', 'games']} />
            </div>
        </main>
    );
}

export default function Page() {
    return (
        <OverlayToolbarProvider>
            <RedBullWololoLiveStandingsOverlay />
        </OverlayToolbarProvider>
    );
}

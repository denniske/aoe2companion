import { PlayerList } from '@app/components/red-bull-wololo-live-standings/_components/player-list';
import { useToolbarStyles } from '@app/components/red-bull-wololo-live-standings/_providers/overlay-toolbar-context';
import { OverlayToolbarProvider } from '@app/components/red-bull-wololo-live-standings/_providers/overlay-toolbar-provider';
import { END_DATE } from '@app/components/red-bull-wololo-live-standings/dates';
import { isPast } from 'date-fns';

function RedBullWololoLiveStandingsBarOverlay() {
    const { container, content, count, speed } = useToolbarStyles();

    return (
        <main
            className="gap-12 text-white relative selection:bg-blue-600/90 select-none flex min-h-full"
            style={{ ...container, colorScheme: 'dark' }}
        >
            <div style={content} className="w-[1600px]">
                <PlayerList
                    rotatingBar
                    isPastDeadline={isPast(END_DATE)}
                    limit={count}
                    hideHeader
                    hideCols={['winrates', 'games']}
                    animationSpeed={Math.abs(5 - speed)}
                />
            </div>
        </main>
    );
}

export default function Page() {
    return (
        <OverlayToolbarProvider options={['count', 'horizontal', 'padding', 'scale', 'vertical', 'speed']}>
            <RedBullWololoLiveStandingsBarOverlay />
        </OverlayToolbarProvider>
    );
}

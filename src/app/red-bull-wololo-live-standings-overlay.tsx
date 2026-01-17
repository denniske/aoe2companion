import { PlayerList } from '@app/components/red-bull-wololo-live-standings/_components/player-list';
import { useToolbarStyles } from '@app/components/red-bull-wololo-live-standings/_providers/overlay-toolbar-context';
import { OverlayToolbarProvider } from '@app/components/red-bull-wololo-live-standings/_providers/overlay-toolbar-provider';
import { END_DATE } from '@app/components/red-bull-wololo-live-standings/dates';
import { isPast } from 'date-fns';

function RedBullWololoLiveStandingsOverlay() {
    const { container, content, count } = useToolbarStyles();

    return (
        <main
            className="gap-12 text-white relative selection:bg-blue-600/90 select-none flex min-h-full"
            style={{ ...container, colorScheme: 'dark' }}
        >
            <div style={content} className="w-[1075px]">
                <PlayerList isPastDeadline={isPast(END_DATE)} limit={count} hideHeader hideCols={['winrates', 'games']} />
            </div>
        </main>
    );
}

export default function Page() {
    return (
        <OverlayToolbarProvider options={['count', 'horizontal', 'padding', 'scale', 'vertical']}>
            <RedBullWololoLiveStandingsOverlay />
        </OverlayToolbarProvider>
    );
}

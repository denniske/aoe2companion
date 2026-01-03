import { EndDateCountdown } from '@app/components/red-bull-wololo-live-standings/_components/end-date-countdown';
import { OverlayToolbarProvider } from '@app/components/red-bull-wololo-live-standings/_providers/overlay-toolbar-provider';
import { useToolbarStyles } from '../components/red-bull-wololo-live-standings/_providers/overlay-toolbar-context';

const END_DATE = new Date(1768755600000);

function RedBullWololoLiveCountdownOverlay() {
    const { container, content } = useToolbarStyles();

    return (
        <div className="flex h-full" style={container}>
            <div
                style={content}
            >
                <EndDateCountdown endDate={END_DATE} className="flex flex-col items-center" />
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <OverlayToolbarProvider>
            <RedBullWololoLiveCountdownOverlay />
        </OverlayToolbarProvider>
    );
}

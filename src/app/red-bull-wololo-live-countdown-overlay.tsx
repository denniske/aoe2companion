import { EndDateCountdown } from '@app/components/red-bull-wololo-live-standings/_components/end-date-countdown';

const END_DATE = new Date(1768755600000);

export default function RedBullWololoLiveCountdownOverlay() {
    return (
        <div className="flex flex-col items-start">
            <EndDateCountdown endDate={END_DATE} className="flex flex-col items-center" />
        </div>
    );
}

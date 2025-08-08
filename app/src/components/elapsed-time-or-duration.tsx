import { IMatchNew } from '@app/api/helper/api.types';
import { useSecondRerender } from '@app/hooks/use-second-rerender';
import { differenceInMilliseconds, differenceInSeconds } from 'date-fns';
import { useMinuteRerender } from '@app/hooks/use-minute-rerender';
import { Text } from '@app/components/text';
import { formatAgo } from '@nex/data';
import { appConfig } from '@nex/dataset';

export function matchIsFinishedOrTimedOut(match: IMatchNew) {
    if (match.finished) {
        return true;
    }
    if (match.started) {
        const finished = match.finished || new Date();
        const duration = differenceInSeconds(finished, match.started) * match.speedFactor;
        return duration > 60 * 60 * 24; // 24 hours
    }
    return false;
}

export function matchTimedOut(match: IMatchNew) {
    if (match.finished) {
        return false;
    }
    if (match.started) {
        const finished = match.finished || new Date();
        const duration = differenceInSeconds(finished, match.started) * match.speedFactor;
        return duration > 60 * 60 * 24; // 24 hours
    }
    return false;
}

const formatDuration = (durationInSeconds: number) => {
    if (!durationInSeconds) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(durationInSeconds / 60) % 60).toString();
    const hours = Math.abs(Math.floor(durationInSeconds / 60 / 60)).toString();
    return `${hours.length < 2 ? hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} h`;
};

// const formatDuration = (durationInSeconds: number) => {
//     if (!durationInSeconds) return '00:00:00 h'; // divide-by-0 protection
//
//     const totalSeconds = Math.abs(durationInSeconds);
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = Math.floor(totalSeconds % 60);
//
//     const pad = (n: number) => n.toString().padStart(2, '0');
//
//     return `${pad(hours)}:${pad(minutes)}:${pad(seconds)} h`;
// };

interface ElapsedTimeOrDurationProps {
    match: IMatchNew;
}

export const ElapsedTimeOrDuration: React.FC<ElapsedTimeOrDurationProps> = ({ match }) => {
    useSecondRerender();

    let duration: string = '';
    if (match.started) {
        const finished = match.finished || new Date();
        // It seems the game speed is not exactly 1.7 for normal speed in AoE2:DE, so we need to correct it
        const CORRECTION_FACTOR = appConfig.game === 'aoe2de' ? 1.05416666667 : 1;
        duration = formatDuration(((differenceInMilliseconds(finished, match.started) / 1000) * match.speedFactor) / CORRECTION_FACTOR);
    }
    if (appConfig.game !== 'aoe2de') duration = '';

    return (
        <Text numberOfLines={1}>
            {!matchIsFinishedOrTimedOut(match) && duration}
            {matchIsFinishedOrTimedOut(match) ? (match.started ? formatAgo(match.started) : 'none') : null}
        </Text>
    );
};

// interface SecondRerenderProps {
//     children: ReactNode;
// }
// const SecondRerender: React.FC<SecondRerenderProps> = ({ children }) => {
//     useSecondRerender();
//     return <>{children}</>;
// };

export const FormatAgoLive: React.FC<{ started: Date }> = ({ started }) => {
    useMinuteRerender(started); // forces re-render on aligned minute
    return <Text>{formatAgo(started)}</Text>;
};

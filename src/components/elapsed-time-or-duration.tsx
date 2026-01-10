import { IMatchNew } from '@app/api/helper/api.types';
import { differenceInMilliseconds, differenceInSeconds, intervalToDuration } from 'date-fns';
import { useMinuteRerender } from '@app/hooks/use-minute-rerender';
import { Text } from '@app/components/text';
import { formatAgo, getDuration } from '@nex/data';
import { appConfig } from '@nex/dataset';
import Countdown from 'react-countdown';

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

interface ElapsedTimeOrDurationProps {
    match: IMatchNew;
}

export const ElapsedTimeOrDuration: React.FC<ElapsedTimeOrDurationProps> = ({ match }) => {
    const finished = match.finished || new Date();
    let duration: string = '';
    if (match.started) {
        duration = getDuration(differenceInMilliseconds(finished, match.started), match.speedFactor);
    }
    if (appConfig.game !== 'aoe2') duration = '';

    return (
        <Text numberOfLines={1}>
            {!matchIsFinishedOrTimedOut(match) && match.started && (
                <Countdown date={match.started} renderer={({ total }) => getDuration(total, match.speedFactor)} overtime />
            )}
            {matchIsFinishedOrTimedOut(match) ? `${match.started ? formatAgo(match.started) : 'none'} - ${duration}` : null}
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

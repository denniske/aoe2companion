import { IMatchNew } from '@app/api/helper/api.types';
import { differenceInMilliseconds, differenceInSeconds, intervalToDuration } from 'date-fns';
import { useMinuteRerender } from '@app/hooks/use-minute-rerender';
import { Text } from '@app/components/text';
import { formatAgo, getDuration } from '@nex/data';
import { appConfig } from '@nex/dataset';
import Countdown from 'react-countdown';


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

    let matchState = 'none';
    if (match.started) {
        matchState = 'running';
    }
    if (match.finished) {
        matchState = 'finished';
    }
    if (match.abandoned) {
        matchState = 'abandoned';
    }
    if (matchTimedOut(match)) {
        matchState = 'timedout';
    }

    console.log('matchState', match.matchId, matchState);

    return (
        <Text numberOfLines={1}>
            {
                matchState === 'running' ? (
                    <Countdown date={match.started} renderer={({ total }) => getDuration(total, match.speedFactor)} overtime />
                ) : null
            }
            {matchState === 'finished' ? `${match.started ? formatAgo(match.started) : 'none'} - ${duration}` : null}
            {matchState === 'abandoned' ? `${match.started ? formatAgo(match.started) : 'none'} - Abandoned` : null}
            {matchState === 'timedout' ? `${match.started ? formatAgo(match.started) : 'none'} - Timed Out` : null}
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

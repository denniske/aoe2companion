import { ILobbiesMatch } from '@app/api/helper/api.types';
import { formatISO, intervalToDuration } from 'date-fns';
import { RatingDiff } from './rating-diff';
import Countdown from 'react-countdown';
import { formatAgo } from '@nex/data';
import { Icon } from '@app/components/icon';

const formatDuration = (durationInSeconds: number) => {
    const duration = intervalToDuration({
        start: 0,
        end: durationInSeconds * 1000,
    });

    const { hours = 0, minutes = 0, seconds = 0 } = duration;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
};

export const MatchCard = ({
    match,
    playerNames,
    userId,
    index = 0
}: {
    userId?: number;
    match: ILobbiesMatch;
    playerNames: Record<string, { name: string; icon?: string }>;
    index?: number
}) => {
    return (
        <div className="relative flex flex-row gap-3 items-center text-sm w-full">
            {match.players.some((p) => p.profileId === userId && p.won === true) && (
                <Icon icon="crown" color="accent-[#f9b806]" className="absolute top-1" />
            )}

            {match.players.some((p) => p.profileId === userId && p.won === false) && <Icon icon="skull" className="absolute top-1" color="white" />}

            {!match.finished &&
                (index === 0 ? (
                    <a href={`aoe2de://1/${match.matchId}`} target="_blank" className="absolute top-0" rel="noreferrer">
                        <Icon icon="eye" color="accent-[#EAC65E]" />
                    </a>
                ) : (
                    <Icon icon="signal-alt-slash" color="white" className="absolute top-1" />
                ))}

            <img src={match.mapImageUrl} className="w-16 h-16" />
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between">
                    <b className="text-base font-semibold">{match.mapName}</b>
                    {match.started && (
                        <time dateTime={formatISO(match.started)} className="flex gap-2 items-center">
                            {match.finished ? (
                                formatAgo(match.finished)
                            ) : index > 0 ? (
                                formatAgo(match.started)
                            ) : (
                                <Countdown
                                    date={match.started}
                                    overtime
                                    renderer={({ total }) => {
                                        return formatDuration((Math.abs(total) / 1000) * match.speedFactor);
                                    }}
                                />
                            )}
                        </time>
                    )}
                </div>
                {match.players.map((p) => (
                    <div className="flex justify-between" key={p.profileId}>
                        <div className="flex gap-1.5">
                            <img src={p.civImageUrl} className="w-5 h-5" />
                            <span className={p.won ? 'font-bold' : ''}>{playerNames[p.profileId]?.name ?? p.name}</span>
                        </div>

                        <span className="flex gap-2">
                            {p.ratingDiff ? <RatingDiff ratingDiff={p.ratingDiff} /> : null}
                            {p.rating}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

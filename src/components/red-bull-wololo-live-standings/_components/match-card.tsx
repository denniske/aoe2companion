import { ILobbiesMatch } from '@app/api/helper/api.types';
import { differenceInMilliseconds, differenceInSeconds, formatISO, intervalToDuration } from 'date-fns';
import { RatingDiff } from './rating-diff';
import Countdown from 'react-countdown';
import { formatAgo, getDuration } from '@nex/data';
import { Icon } from '@app/components/icon';
import cn from 'classnames';
import { sortTeamByCurrentPlayer } from '../../../utils/match';

export const MatchCard = ({
    match,
    playerNames,
    userId,
    index = 0,
    selectPlayer,
}: {
    userId?: number;
    match: ILobbiesMatch;
    playerNames: Record<string, { name: string; icon?: string }>;
    index?: number;
    selectPlayer?: (player: { name: string; profileId: number }) => void;
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
            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                <div className="flex justify-between">
                    <b className="text-base font-semibold">{match.mapName}</b>
                    {match.started && (
                        <time
                            dateTime={formatISO(match.started)}
                            className={cn(
                                'flex gap-2 items-center relative group/time',
                                match.started && match.finished && selectPlayer && 'cursor-pointer'
                            )}
                        >
                            <Countdown
                                date={match.started}
                                overtime
                                renderer={({ total }) => {
                                    if (!match.started) return '';

                                    if (match.finished) {
                                        return formatAgo(match.finished);
                                    } else if (index > 0) {
                                        return formatAgo(match.started);
                                    }

                                    return getDuration(total, match.speedFactor);
                                }}
                            />

                            {match.started && match.finished && selectPlayer && (
                                <div className="absolute top-8 right-0 mx-auto scale-0 bg-black border-gray-800 px-3 py-2 group-hover/time:scale-100 z-10 text-sm shadow-2xl transition-transform text-center whitespace-nowrap invisible group-hover/time:visible">
                                    <div className="h-0 w-0 border-x-8 border-x-transparent border-b-8 border-b-black absolute -top-2 mx-auto left-0 right-0"></div>
                                    Lasted {getDuration(differenceInMilliseconds(match.finished, match.started), match.speedFactor)}
                                </div>
                            )}
                        </time>
                    )}
                </div>
                {sortTeamByCurrentPlayer(match.players, userId).map((p) => (
                    <div className="flex overflow-hidden gap-1" key={p.profileId}>
                        <div className="flex gap-1.5 flex-1 overflow-hidden">
                            <img src={p.civImageUrl} className="w-5 h-5" />
                            <span
                                className={cn(
                                    'whitespace-nowrap overflow-hidden text-ellipsis flex-1',
                                    userId !== p.profileId && selectPlayer ? 'cursor-pointer hover:underline' : 'cursor-default'
                                )}
                                onClick={
                                    userId !== p.profileId && selectPlayer
                                        ? (e) => {
                                              e.preventDefault();
                                              selectPlayer({
                                                  profileId: p.profileId,
                                                  name: p.name ?? '',
                                              });
                                          }
                                        : (e) => e.preventDefault()
                                }
                            >
                                {playerNames[p.profileId]?.name ?? p.name}
                            </span>
                        </div>

                        <span className="flex gap-2 whitespace-nowrap shrink-0">
                            {p.ratingDiff ? <RatingDiff ratingDiff={p.ratingDiff} /> : null}
                            {p.rating || 'Unranked'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

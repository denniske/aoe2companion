import { ILeaderboardPlayer, ILobbiesMatch } from '@app/api/helper/api.types';
import { Status, statuses } from '../statuses';
import { SpringValue, animated } from 'react-spring';
import { isAfter, subMinutes } from 'date-fns';
import { formatStreak, LastFiveMatches } from './last-five-matches';
import { Cell } from './table';
import { RatingDiff } from './rating-diff';
import { MatchCard } from './match-card';
import { formatAgo } from '@nex/data';
import { Icon } from '@app/components/icon';
import Countdown from 'react-countdown';

export const PlayerRow = ({
    player,
    match,
    playerNames,
    initialRank,
    minRatingToQualify,
    rank,
    hasDuplicateRank,
    status = 'none',
    style,
    isPastDeadline,
    hideCols,
    selectPlayer,
    showCurrentRank,
}: {
    player: ILeaderboardPlayer & { winrates: number };
    playerNames: Record<string, { name: string; icon?: string }>;
    initialRank?: number;
    minRatingToQualify: number;
    rank: number;
    match?: ILobbiesMatch;
    status?: Status;
    hasDuplicateRank?: boolean;
    isPastDeadline: boolean;
    style?: {
        position: SpringValue<React.CSSProperties['position']>;
        opacity: SpringValue<number>;
    } & Omit<React.CSSProperties, 'position' | 'opacity'>;
    hideCols: Array<keyof ILeaderboardPlayer | 'winrates'>;
    selectPlayer: (player: ILeaderboardPlayer) => void;
    showCurrentRank: boolean;
}) => {
    const opponent = match?.players.find((p) => p.profileId !== player.profileId);
    const opponentName = playerNames[opponent?.profileId ?? '']?.name ?? opponent?.name;
    const { ratingDiff } = match?.players.find((p) => p.profileId === player.profileId) ?? {};

    return (
        <animated.tr
            key={player.profileId}
            className="flex w-full"
            style={{ ...style, position: style?.position as SpringValue }}
            data-id={player.profileId}
        >
            {hideCols.includes('maxRating') ? null : (
                <Cell
                    className={`w-20 border-l-4 hidden md:flex group flex-col py-0! justify-center ${hasDuplicateRank ? 'cursor-pointer' : ''}`}
                    style={{ borderColor: statuses[status].color }}
                >
                    {rank && (
                        <div className="flex gap-2 items-center relative">
                            <span>
                                #{rank}
                                {hasDuplicateRank && (
                                    <a className="hover:text-[#EAC65E] transition-colors" href="#rankdisclaimer">
                                        *
                                    </a>
                                )}
                            </span>

                            {initialRank && initialRank !== rank && (
                                <Icon
                                    icon={initialRank > rank ? 'caret-up' : 'caret-down'}
                                    color={initialRank > rank ? 'accent-[#22C55E]' : 'accent-[#EF4444]'}
                                    className={initialRank > rank ? 'inline-block -mt-0.5' : 'inline-block -mt-1.5'}
                                    size={16}
                                />
                            )}
                            {hasDuplicateRank && (
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 mx-auto scale-0 bg-blue-800 rounded-lg border-gray-800 px-1.5 py-1.5 group-hover:scale-100 z-10 flex flex-row text-xs shadow-2xl transition-transform text-center italic w-36 whitespace-normal">
                                    In case of a tie between players, the player with the highest current rating will take precedence. <br />
                                    <br />
                                    In the rare case that there&apos;s still a tie, Red Bull will organise an additional matchup between these
                                    players.
                                </div>
                            )}
                        </div>
                    )}

                    {showCurrentRank && (
                        <span className="text-xs text-gray-300 -mt-1">
                            Now <span className="text-sm">#{player.rank}</span>
                        </span>
                    )}
                </Cell>
            )}
            <Cell className="font-bold w-36 flex-1 border-l-4 md:border-l-0" style={{ borderColor: statuses[status].color }}>
                <span className="text-2xl mr-2 align-middle font-flag">{player.countryIcon}</span>
                <span
                    className="text-ellipsis overflow-hidden cursor-pointer hover:text-[#EAC65E] transition-colors"
                    onClick={() => selectPlayer(player)}
                >
                    {player.name}
                </span>
            </Cell>
            {hideCols.includes('maxRating') ? null : <Cell className="font-bold w-24 md:w-44 py-0! px-2! md:py-3! md:px-6!">{player.maxRating}</Cell>}
            {hideCols.includes('rating') ? null : (
                <Cell
                    className={`w-24 md:w-44 group py-0! px-2! md:py-3! md:px-6! ${
                        player.rating === player.maxRating || (status !== 'qualified' && !isPastDeadline) ? 'cursor-pointer' : ''
                    }`}
                >
                    <div className="relative hidden md:flex items-center gap-2">
                        {player.rating}
                        {player.rating === player.maxRating && <Icon icon="chart-line" color="white" size={14} />}
                        {(player.rating === player.maxRating || (status !== 'qualified' && !isPastDeadline)) && (
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 mx-auto scale-0 bg-blue-800 rounded-lg border-gray-800 px-3 py-2 group-hover:scale-100 z-10 text-sm shadow-2xl transition-transform text-center">
                                <div className="h-0 w-0 border-x-8 border-x-transparent border-b-8 border-b-blue-800 absolute -top-2 mx-auto left-0 right-0"></div>
                                {player.rating === player.maxRating && <p className="text-xs">At Highest Rating</p>}
                                {status !== 'qualified' && !isPastDeadline && (
                                    <p className="text-xs">
                                        <b>{minRatingToQualify - player.rating}</b> Points To Be in Qualified Position
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex md:hidden">{player.rating}</div>
                </Cell>
            )}
            {hideCols.includes('lastMatchTime') ? null : (
                <Cell className="w-64 group py-2 hidden lg:flex">
                    {match && (!match.finished || isAfter(match.finished, subMinutes(new Date(), 30))) ? (
                        <div className="relative cursor-pointer max-w-full">
                            {match.finished ? (
                                <div className="text-base">
                                    <Countdown
                                        date={match.finished}
                                        overtime
                                        renderer={() => {
                                            return match.finished ? formatAgo(match.finished) : '';
                                        }}
                                    />
                                    <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                        {ratingDiff ? (
                                            <span>
                                                {ratingDiff > 0 ? 'Gained' : 'Lost'} <RatingDiff ratingDiff={ratingDiff} suffix="points" />{' '}
                                                {ratingDiff > 0 ? 'from' : 'to'}{' '}
                                            </span>
                                        ) : (
                                            'vs '
                                        )}
                                        {opponentName}
                                        {!ratingDiff ? <span className="text-xs italic text-gray-200"> - fetching match result...</span> : ''}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-base">
                                    <a
                                        href={`aoe2de://1/${match.matchId}`}
                                        target="_blank"
                                        className="text-[#EAC65E] font-bold align-middle hover:underline"
                                        rel="noreferrer"
                                    >
                                        LIVE <Icon icon="eye" color="accent-[#EAC65E]" className="inline-block -mt-1" />
                                    </a>{' '}
                                    on {match.mapName}
                                    <br />
                                    <p className="text-sm">vs {opponentName}</p>
                                </div>
                            )}
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 mx-auto scale-0 bg-blue-800 rounded-lg border-gray-800 px-3 py-2 group-hover:scale-100 z-10 flex flex-row w-96 gap-3 items-center text-sm shadow-2xl transition-transform">
                                <div className="h-0 w-0 border-x-8 border-x-transparent border-b-8 border-b-blue-800 absolute -top-2 mx-auto left-0 right-0"></div>
                                <MatchCard userId={player.profileId} match={match} playerNames={playerNames} />
                            </div>
                        </div>
                    ) : (
                        formatAgo(player.lastMatchTime)
                    )}
                </Cell>
            )}
            {hideCols.includes('streak') ? null : (
                <Cell className="w-36 hidden md:flex flex-col gap-1.5 items-start pb-0 pt-1 justify-center">
                    <LastFiveMatches player={player} match={match} playerNames={playerNames} />
                    <p className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${player.streak >= 5 ? 'font-bold' : ''}`}>
                        {formatStreak(player.streak)}{' '}
                        {player.streak >= 5 ? <Icon icon="fire-alt" size={20} color="accent-orange-500" className="inline-block" /> : null}
                    </p>
                </Cell>
            )}
            {hideCols.includes('winrates') ? null : <Cell className="w-24 hidden lg:flex">{player.winrates.toFixed(0)}%</Cell>}
            {hideCols.includes('games') ? null : <Cell className="w-24 hidden 2xl:flex">{player.games}</Cell>}
        </animated.tr>
    );
};

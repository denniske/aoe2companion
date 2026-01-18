import { ILeaderboard, ILeaderboardPlayer, ILobbiesMatch, IMatchNew } from '@app/api/helper/api.types';
import { useQuery } from '@tanstack/react-query';
import { isEmpty, orderBy } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import { w3cwebsocket } from 'websocket';
import { Status, statuses } from '../statuses';
import { SpringValue, useTransition } from 'react-spring';
import { format, formatISO } from 'date-fns';
import { HeadCell } from './table';
import { PlayerRow } from './player-row';
import { reformatTeamMatch } from '../util';
import { initMatchSubscription } from '@app/api/socket/ongoing';
import { dateReviver } from '@nex/data';
import { Icon } from '@app/components/icon';
import { InlinePlayerSearch } from '@app/components/inline-player-search';
import { PlayerModal } from './player-modal';
import { StatsModal } from './stats-modal';
import { Button } from '@app/components/button';
import { END_DATE } from '../dates';

const leaderboardId = 'ew_1v1_redbullwololo';
const maxRatingOverrides: Record<number, number> = {
    197964: 1769,
};

export function PlayerList({
    isPastDeadline,
    limit = 50,
    hideHeader,
    hideCols = [],
    rotatingBar = false,
    animationSpeed = 1,
}: {
    isPastDeadline: boolean;
    limit?: number;
    hideHeader?: boolean;
    hideCols?: Array<keyof ILeaderboardPlayer | 'winrates'>;
    rotatingBar?: boolean;
    animationSpeed?: number;
}) {
    const [connectionsCount, setConnectionsCount] = useState(0);
    const [refetchInterval, setRefetchInterval] = useState(60 * 1000);
    const [time, setTime] = useState<Date>();
    const [initialRankings, setInitialRankings] = useState<Record<string, number>>({});
    const [sort, setSort] = useState(['maxRating', 'desc'] as [keyof ILeaderboardPlayer | 'winrates' | 'rankMaxRating', 'desc' | 'asc']);
    const [matches, setMatches] = useState<ILobbiesMatch[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<ILeaderboardPlayer | null>(null);
    const ref = useRef(null);

    useEffect(() => {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
        });
    }, []);

    const updateMatches = (newMatches: ILobbiesMatch[], clearMatches = false) => {
        setMatches((prev) => {
            const newMatchesFiltered = newMatches
                .filter((match) => match.leaderboardId === leaderboardId)
                .map((match) => {
                    const oldMatch = prev.find((m) => m.matchId === match.matchId);

                    if (oldMatch?.finished && !match.finished) {
                        return oldMatch;
                    } else {
                        return match;
                    }
                });
            const newMatchIds = newMatchesFiltered.map((g) => g.matchId);
            const oldMatches = prev.filter((g) => !newMatchIds.includes(g.matchId));

            return orderBy([...(clearMatches ? [] : oldMatches), ...newMatchesFiltered], 'started', 'desc');
        });
    };

    const connect = async (profileIds?: number[]) => {
        setIsConnecting(true);
        return await initMatchSubscription(
            {
                onOpen: () => {
                    setIsConnecting(false);
                    setConnected(true);
                },
                onClose: () => {
                    setIsConnecting(false);
                    setConnected(false);
                },
                onMatches: (games: ILobbiesMatch[]) => {
                    updateMatches(games);
                },
                onMatchRemoved: (match: ILobbiesMatch) => {
                    console.log('on match removed', match);
                    if (match && match.leaderboardId === leaderboardId) {
                        updateMatches([match]);
                    }
                },
                onMessage: (events: Array<{ type: 'connections'; data: { count: number } }>) => {
                    const connectionsEvent = events.find((event) => event.type === 'connections');

                    if (connectionsEvent) {
                        setConnectionsCount(connectionsEvent.data.count);
                    }
                },
            },
            profileIds
        );
    };

    const { data, isFetching, refetch, isLoading, isError, isSuccess } = useQuery<ILeaderboard, Error, ILeaderboard>({
        queryKey: ['leaderboard-players', leaderboardId],
        queryFn: async () => {
            const response = await fetch(`https://aoe2frontend.vercel.app/api/leaderboard/${leaderboardId}`);
            const text = await response.text();
            const leaderboardData = JSON.parse(text, dateReviver) as {
                leaderboard: ILeaderboard;
                matches: IMatchNew[];
                isCached: boolean;
            };

            closeSocket();

            if (!leaderboardData?.leaderboard?.players?.length) {
                throw Error('Leaderboard bug');
            }

            if (!leaderboardData?.matches) {
                throw Error('Matches bug');
            }

            if (leaderboardData.isCached) {
                await new Promise<void>((resolve) => setTimeout(resolve, 500));
            }

            updateMatches(leaderboardData.matches.map(reformatTeamMatch), true);

            setTime(new Date(END_DATE));

            return leaderboardData.leaderboard;
        },
        staleTime: 10 * 60 * 1000,
        gcTime: Infinity,
        refetchInterval,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (isSuccess) {
            const pids = data?.players?.map((p) => p.profileId);

            if (pids && pids.length > 0) {
                openSocket(pids);
            }
        }
    }, [data, isSuccess]);

    const playerNames = Object.fromEntries(data?.players.map((p) => [p.profileId, { name: p.name, icon: p.countryIcon }]) ?? []);
    const socket = useRef<w3cwebsocket>(null);

    const openSocket = (profileIds: number[]) => {
        if (profileIds && profileIds.length > 0 && !isPastDeadline) {
            connect(profileIds).then((s) => (socket.current = s));
        }
    };

    const closeSocket = () => {
        socket.current?.close();
    };

    const mappedPlayers = useMemo(
        () =>
            data?.players.map((player) => {
                const finishedMatch = matches.find((m) => m.players.some((p) => p.profileId === player.profileId) && m.finished);
                const mostRecentMatch = isPastDeadline ? finishedMatch : matches.find((m) => m.players.some((p) => p.profileId === player.profileId));

                const matchPlayer = finishedMatch?.players.find((p) => p.profileId === player.profileId);
                const rating = matchPlayer?.rating && matchPlayer?.ratingDiff ? matchPlayer.rating + matchPlayer.ratingDiff : player.rating;
                let maxRating = rating > player.maxRating ? rating : player.maxRating;

                for (const profileId in maxRatingOverrides) {
                    if (player.profileId === Number(profileId)) {
                        maxRating = maxRatingOverrides[profileId];
                    }
                }

                if (player.last10MatchesWon) {
                    player.last10MatchesWon = player.last10MatchesWon.filter((m, index) => m !== null || index === 0);
                }

                if (player.last10MatchesWon?.[0] !== null && mostRecentMatch?.started && !mostRecentMatch.finished) {
                    player.last10MatchesWon = [null, ...player.last10MatchesWon!.slice(0, 9)];
                }

                if (player.last10MatchesWon?.[0] === null && mostRecentMatch?.finished) {
                    const matchResult = mostRecentMatch.players.find((p) => p.profileId === player.profileId)?.won ?? null;
                    player.last10MatchesWon = [matchResult, ...player.last10MatchesWon!.slice(1)];
                }

                const last10FinishedMatches = player.last10MatchesWon?.filter((m) => m !== null) ?? [];

                let detectedStreak = 0;
                if (last10FinishedMatches[0] === true) {
                    for (const match of last10FinishedMatches) {
                        if (match === true) {
                            detectedStreak++;
                        } else {
                            break;
                        }
                    }
                } else {
                    for (const match of last10FinishedMatches) {
                        if (match === false) {
                            detectedStreak--;
                        } else {
                            break;
                        }
                    }
                }

                if (last10FinishedMatches[0] === false && player.streak > detectedStreak) {
                    player.streak = detectedStreak;
                } else if (last10FinishedMatches[0] === true && player.streak < detectedStreak) {
                    player.streak = detectedStreak;
                }

                return {
                    ...player,
                    winrates: (player.wins / player.games) * 100,
                    lastMatchTime: mostRecentMatch?.started ?? mostRecentMatch?.finished ?? player.lastMatchTime,
                    rating,
                    maxRating,
                    rankMaxRating: maxRating,
                    hasLatestRating: !finishedMatch || !!finishedMatch.players.find((p) => p.profileId === player.profileId)?.ratingDiff,
                };
            }),
        [data?.players, isPastDeadline, matches]
    );

    const allPlayersHaveLatestRating = mappedPlayers?.map((p) => p.hasLatestRating).every((hasLatestRating) => hasLatestRating);

    useEffect(() => {
        if (allPlayersHaveLatestRating) {
            setRefetchInterval(60 * 1000);
        } else {
            setRefetchInterval(5 * 1000);
            refetch();
        }
    }, [allPlayersHaveLatestRating]);

    const sortedPlayerIds = orderBy(mappedPlayers, ['maxRating', 'rating'], ['desc', 'desc'])
        ?.slice(0, limit)
        .map((p) => p.profileId);
    const qualifiedPlayers = sortedPlayerIds?.slice(statuses.qualified.minPlace - 1, statuses.qualified.maxPlace);
    const players = orderBy(
        orderBy(mappedPlayers, ['maxRating', 'rating'], ['desc', 'desc'])?.slice(0, limit),
        [sort[0], 'rating'],
        [sort[1], 'desc']
    )?.slice(0, limit);

    const minRatingToQualify = Math.min(...players.filter((p) => qualifiedPlayers.includes(p.profileId)).map((p) => p.maxRating));

    const transitions = useTransition(
        players.map((data, i) => ({ ...data, y: i * 64 })),
        {
            from: { position: 'absolute', opacity: 0 } as {
                opacity: number;
                position: React.CSSProperties['position'];
            },
            leave: { height: 0, opacity: 0 },
            enter: ({ y }) => ({ y, opacity: 1 }),
            update: ({ y }) => ({ y }),
            key: (item: any) => item?.profileId,
        }
    );

    useEffect(() => {
        if (!isLoading && isEmpty(initialRankings) && sortedPlayerIds) {
            setInitialRankings(Object.fromEntries(sortedPlayerIds.map((pid, index) => [pid, index + 1])));
        }
    }, [isLoading]);

    useEffect(() => {
        if (isPastDeadline) {
            closeSocket();
        }
    }, [isPastDeadline]);

    const selectPlayer = (player: { name: string; profileId: number }) => {
        const topPlayer = players.find((p) => p.profileId === player.profileId);
        setSelectedPlayer(
            topPlayer
                ? { ...topPlayer, rank: sortedPlayerIds.findIndex((pid) => topPlayer.profileId === pid) + 1 }
                : ({ name: player.name, profileId: player.profileId } as ILeaderboardPlayer)
        );
        setShowPlayerModal(true);
    };

    if (rotatingBar) {
        return (
            <div className="overflow-hidden relative">
                <div className="overflow-hidden w-full box-border flex">
                    <div
                        className="animate-ticker will-change-transform animate flex"
                        style={{ animationDuration: `${limit * 2 * animationSpeed}s`, animationDelay: '1.5s' }}
                    >
                        {[...players, ...players].map((player, index) => {
                            const rank = sortedPlayerIds.findIndex((pid) => player.profileId === pid) + 1;
                            const match = matches.find((m) => m.players.some((p) => p.profileId === player.profileId));

                            return (
                                <div key={`${player.profileId}-${index}`} className="flex flex-col border-r border-white/50 whitespace-nowrap">
                                    <div className="flex flex-row items-center gap-1.5 bg-white/5 justify-center px-3 h-7">
                                        {match && !match?.finished && !isPastDeadline && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
                                        <div className="text-lg font-bold">#{rank}</div>
                                        <div className="font-flag text-2xl">{player.countryIcon}</div>
                                        <div className="text-lg font-medium">{player.name}</div>
                                    </div>
                                    <div className="h-px bg-linear-to-r from-white/0 via-white/50 to-white/0 from-10% to-90%" />
                                    <div className="flex flex-row gap-1.5 justify-center px-3">
                                        <div className="text-sm font-bold">Max {player.maxRating}</div>
                                        <div className="w-px bg-white/50" />
                                        <div className="text-sm text-gray-50">Current {player.rating}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {selectedPlayer && (
                <PlayerModal
                    leaderboardId={leaderboardId}
                    playerNames={playerNames}
                    player={selectedPlayer}
                    onClose={() => setShowPlayerModal(false)}
                    isVisible={showPlayerModal}
                    minRatingToQualify={minRatingToQualify}
                    selectPlayer={selectPlayer}
                    onViewStats={() => setShowStats(true)}
                />
            )}

            {hideHeader ? null : (
                <div className="pb-2 mb-8 border-b-2 border-[#EAC65E] flex flex-col md:flex-row justify-between items-center select-text relative z-50">
                    <h2 className="text-xl md:text-5xl uppercase font-bold">{isPastDeadline ? '' : 'Current '}Top Players</h2>

                    <div className="flex gap-4">
                        {time && !isFetching ? (
                            <div className="flex flex-col">
                                <time dateTime={formatISO(time)} className="text-center md:text-right">
                                    Last updated {format(time, 'pp')}
                                </time>

                                {!isPastDeadline && (
                                    <div className="flex flex-row items-center gap-2 justify-end h-5">
                                        {!isConnecting && connected && connectionsCount ? (
                                            <div className="flex items-center gap-1 rounded px-2 py-0.5 text-xs group relative cursor-pointer">
                                                <div className="bg-red-500 w-3 h-3 rounded-full mt-0.5"></div>
                                                <p>Live Updates Enabled</p>
                                                <div className="absolute top-8 left-1/2 -translate-x-1/2 mx-auto scale-0 bg-blue-800 rounded-lg border-gray-800 px-3 py-2 group-hover:scale-100 z-10 text-sm shadow-2xl transition-transform text-center 2xl:whitespace-nowrap w-56 2xl:w-auto  invisible group-hover:visible">
                                                    <div className="h-0 w-0 border-x-8 border-x-transparent border-b-8 border-b-blue-800 absolute -top-2 mx-auto left-0 right-0"></div>
                                                    {connectionsCount} users are currently connected and receiving live updates.
                                                    <br />
                                                    <br className="2xl:hidden" />
                                                    Updates are pushed automatically - no refresh required.
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs italic text-right">
                                                {isConnecting
                                                    ? 'Connecting to live updates server...'
                                                    : 'Live updates are disabled (refresh to enable)'}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-center md:text-right">Updating leaderboard</p>
                        )}

                        {!isPastDeadline && <button onClick={() => refetch()} disabled={isFetching} className="cursor-pointer">
                            <Icon
                                icon="arrows-rotate"
                                color="accent-[#EAC65E]"
                                className={isFetching ? 'animate-spin [animation-duration:1s]' : undefined}
                                size={20}
                            />
                        </button>}
                    </div>

                    <StatsModal isVisible={showStats} onClose={() => setShowStats(false)} profileIds={sortedPlayerIds} />
                </div>
            )}
            <table className={`w-full text-sm text-left relative z-20`}>
                <thead className={`text-base md:text-lg uppercase block`}>
                    <tr className="flex">
                        <HeadCell
                            sort={sort}
                            setSort={setSort}
                            className="w-20 hidden md:block"
                            columnName="rankMaxRating"
                            siblingColumnName="maxRating"
                            hideCols={hideCols}
                        >
                            Rank
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-36 flex-1" hideCols={hideCols}>
                            Player
                        </HeadCell>
                        <HeadCell
                            sort={sort}
                            setSort={setSort}
                            className="w-24 md:w-44 px-2! md:px-6!"
                            columnName="maxRating"
                            siblingColumnName="rankMaxRating"
                            hideCols={hideCols}
                        >
                            Highest<span className="hidden md:inline"> Rating</span>
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-24 md:w-44 px-2! md:px-6!" columnName="rating" hideCols={hideCols}>
                            Current<span className="hidden md:inline"> Rating</span>
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-64 hidden lg:block" columnName="lastMatchTime" hideCols={hideCols}>
                            Last Game
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-36 hidden md:block" columnName="streak" hideCols={hideCols}>
                            Last 5
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-24 hidden lg:block" columnName="winrates" hideCols={hideCols}>
                            Win %
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-24 hidden 2xl:block" columnName="games" hideCols={hideCols}>
                            Games
                        </HeadCell>
                    </tr>
                </thead>
                <tbody className="block" ref={ref} style={{ minHeight: limit * 64 }}>
                    {!players || players.length === 0 || isError ? (
                        <tr className="flex h-96 items-center justify-center">
                            <td className="flex">
                                {isError ? (
                                    <p className="text-lg">There was an error loading the leaderboard. Please reload the page.</p>
                                ) : (
                                    <Icon className="animate-spin [animation-duration:1s]" color="white" icon="spinner" size={32} />
                                )}
                            </td>
                        </tr>
                    ) : (
                        transitions((style, player, { key }, index) => {
                            const match = matches.find((m) =>
                                m.players.some((p) => p.profileId === player.profileId && (!isPastDeadline || m.finished))
                            );

                            const status = Object.entries(statuses).reduce<Status>((currentStatus, [status, { minPlace, maxPlace }]) => {
                                const rank = sortedPlayerIds.findIndex((playerId) => player.profileId === playerId) + 1;

                                if (rank >= minPlace && rank <= maxPlace) {
                                    return status as Status;
                                } else {
                                    return currentStatus;
                                }
                            }, 'none');

                            const hasDuplicateRank = players.some((p) => p.maxRating === player.maxRating && p.profileId !== player.profileId);

                            return (
                                <PlayerRow
                                    hideCols={hideCols}
                                    isPastDeadline={isPastDeadline}
                                    style={{
                                        ...style,
                                        position: style.position as SpringValue,
                                        zIndex: 100 - (index + 1),
                                        height: 64,
                                    }}
                                    initialRank={initialRankings[player.profileId]}
                                    rank={sortedPlayerIds.findIndex((pid) => player.profileId === pid) + 1}
                                    hasDuplicateRank={hasDuplicateRank}
                                    minRatingToQualify={minRatingToQualify}
                                    player={player}
                                    key={key}
                                    playerNames={playerNames}
                                    match={match}
                                    status={status}
                                    selectPlayer={selectPlayer}
                                    showCurrentRank={sort[0] === 'rating'}
                                />
                            );
                        })
                    )}
                </tbody>
            </table>

            {hideHeader ? null : (
                <div className="flex flex-col lg:flex-row gap-6 justify-center py-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center relative z-50">
                        <p className="text-lg">Looking for a specific player?</p>
                        <InlinePlayerSearch iconColor="accent-white" onSelect={selectPlayer} position="top" showViewAll={false} />
                    </div>

                    <div className="w-px self-stretch bg-white hidden lg:block" />

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center relative z-50">
                        <p className="text-lg">Want to see statistics for the ladder?</p>
                        <Button onPress={() => setShowStats(true)}>View Statistics</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

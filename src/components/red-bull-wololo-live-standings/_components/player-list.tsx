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

export function PlayerList({
    leaderboardId,
    isPastDeadline,
    maxRatingOverrides,
}: {
    leaderboardId: string;
    isPastDeadline: boolean;
    maxRatingOverrides: Record<number, number>;
}) {
    const [time, setTime] = useState<Date>();
    const [initialRankings, setInitialRankings] = useState<Record<string, number>>({});
    const [sort, setSort] = useState(['maxRating', 'desc'] as [keyof ILeaderboardPlayer | 'winrates', 'desc' | 'asc']);
    const [matches, setMatches] = useState<ILobbiesMatch[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const ref = useRef(null);
    const refetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const updateMatches = (newMatches: ILobbiesMatch[], clearMatches = false) => {
        setMatches((prev) => {
            const newMatchesFiltered = newMatches.filter((match) => match.leaderboardId === leaderboardId);
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
                    if (match && match.leaderboardId === leaderboardId) {
                        if (refetchTimer.current) {
                            clearTimeout(refetchTimer.current);
                        }
                        updateMatches([match]);

                        refetchTimer.current = setTimeout(() => {
                            refetch();
                        }, 15000);
                    }
                },
            },
            profileIds
        );
    };

    const { data, isFetching, refetch, isLoading, isError, isSuccess } = useQuery<ILeaderboard, Error, ILeaderboard>({
        queryKey: ['leaderboard-players', leaderboardId],
        queryFn: async () => {
            closeSocket();

            const response = await fetch(`https://aoe2frontend.vercel.app/api/leaderboard/${leaderboardId}`);
            const text = await response.text();
            const leaderboardData = JSON.parse(text, dateReviver) as {
                leaderboard: ILeaderboard;
                matches: IMatchNew[];
                isCached: boolean;
            };

            if (!leaderboardData?.leaderboard?.players?.length) {
                throw Error('Leaderboard bug');
            }

            if (!leaderboardData?.matches) {
                throw Error('Matches bug');
            }

            if (leaderboardData.isCached) {
                await new Promise<void>((resolve) => setTimeout(resolve, 1000));
            }

            updateMatches(leaderboardData.matches.map(reformatTeamMatch), true);

            setTime(new Date());

            return leaderboardData.leaderboard;
        },
        staleTime: 10 * 60 * 1000,
        gcTime: Infinity,
        refetchInterval: 2 * 30 * 1000,
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

                const last10FinishedMatches = player.last10MatchesWon?.filter((m) => m !== null) ?? [];

                if (player.streak > 0 && last10FinishedMatches[0] === false) {
                    player.streak = 0;

                    for (const match of last10FinishedMatches) {
                        if (match === false) {
                            player.streak++;
                        } else {
                            break;
                        }
                    }
                } else if (player.streak < 0 && last10FinishedMatches[0] === true) {
                    player.streak = 0;

                    for (const match of last10FinishedMatches) {
                        if (match === true) {
                            player.streak++;
                        } else {
                            break;
                        }
                    }
                }

                return {
                    ...player,
                    winrates: (player.wins / player.games) * 100,
                    lastMatchTime: mostRecentMatch?.started ?? mostRecentMatch?.finished ?? player.lastMatchTime,
                    rating,
                    maxRating,
                };
            }),
        [data?.players, isPastDeadline, matches]
    );
    const sortedPlayerIds = orderBy(mappedPlayers, ['maxRating', 'rating'], ['desc', 'desc'])
        ?.slice(0, 50)
        .map((p) => p.profileId);
    const qualifiedPlayers = sortedPlayerIds?.slice(statuses.qualified.minPlace - 1, statuses.qualified.maxPlace);
    const players = orderBy(orderBy(mappedPlayers, 'maxRating', 'desc')?.slice(0, 50), [sort[0], 'rating'], [sort[1], 'desc'])?.slice(0, 50);

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

    return (
        <div>
            <div className="pb-2 mb-8 border-b-2 border-[#EAC65E] flex flex-col md:flex-row justify-between items-center select-text">
                <h2 className="text-xl md:text-5xl uppercase font-bold">{isPastDeadline ? '' : 'Current '}Top Players</h2>

                <div className="flex gap-4">
                    {time && !isFetching ? (
                        <time dateTime={formatISO(time)} className="text-center md:text-right">
                            Last updated {format(time, 'pp')}
                            <br />
                            {!isPastDeadline && (
                                <p className="text-xs italic text-right">
                                    {isConnecting
                                        ? 'Connecting to live updates server...'
                                        : connected
                                        ? 'Live updates are enabled (no need to manually refresh)'
                                        : 'Live updates are disabled (refresh to enable)'}
                                </p>
                            )}
                        </time>
                    ) : (
                        <p className="text-center md:text-right">Updating leaderboard</p>
                    )}

                    <button onClick={() => refetch()} disabled={isFetching} className="cursor-pointer">
                        <Icon
                            icon="arrows-rotate"
                            color="accent-[#EAC65E]"
                            className={isFetching ? 'animate-spin [animation-duration:1s]' : undefined}
                            size={20}
                        />
                    </button>
                </div>
            </div>
            <table className={`w-full text-sm text-left relative z-20`}>
                <thead className={`text-lg uppercase block`}>
                    <tr className="flex">
                        <HeadCell sort={sort} setSort={setSort} className="w-20 hidden md:block" columnName="maxRating">
                            Rank
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-36 flex-1">
                            Player
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-48 md:w-44" columnName="maxRating" hideIcon>
                            Highest Rating
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-44 hidden md:block" columnName="rating">
                            Current Rating
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-64 hidden lg:block" columnName="lastMatchTime">
                            Last Match
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-32 hidden md:block" columnName="streak">
                            Last 5
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-24 hidden lg:block" columnName="winrates">
                            Win %
                        </HeadCell>
                        <HeadCell sort={sort} setSort={setSort} className="w-24 hidden 2xl:block" columnName="games">
                            Games
                        </HeadCell>
                    </tr>
                </thead>
                <tbody className="block min-h-[3200px]" ref={ref}>
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
                                    leaderboardId={leaderboardId}
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
                                />
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}

import { fetchMatches, fetchProfile } from '@app/api/helper/api';
import { ILeaderboardPlayer, IProfilesResultProfile, IStatOpponent } from '@app/api/helper/api.types';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { isAfter, subWeeks } from 'date-fns';
import { merge, orderBy } from 'lodash';
import { Fragment, useState } from 'react';
import { LineSegment, VictoryAxis, VictoryChart, VictoryCursorContainer, VictoryLabel, VictoryLine, VictoryScatter, VictoryTheme } from 'victory';
import { formatStreakShort, LastFiveMatches } from './last-five-matches';
import { formatCustom, formatDateShort, formatMonth, formatTime, formatYear } from '@nex/data';
import { MatchCard } from './match-card';
import { reformatTeamMatch } from '../util';
import { Icon } from '@app/components/icon';
import cn from 'classnames';

const formatTick = (tick: any, index: number, ticks: any[]) => {
    const date = ticks[index] as Date;
    if (date.getMonth() == 0 && date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
        return formatYear(date);
    }
    if (date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
        return formatMonth(date);
    }
    if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
        return formatDateShort(date);
    }
    return formatTime(ticks[index]);
};

export const PlayerModal = ({
    leaderboardId,
    player,
    onClose,
    isVisible,
    playerNames,
    minRatingToQualify,
    selectPlayer,
}: {
    leaderboardId: string;
    player: ILeaderboardPlayer;
    isVisible: boolean;
    onClose: () => void;
    playerNames: Record<string, { name: string; icon?: string }>;
    minRatingToQualify: number;
    selectPlayer?: (player: IProfilesResultProfile) => void;
}) => {
    const { data, isLoading } = useQuery({
        queryKey: ['leaderboard-player', player.profileId],
        queryFn: async () => {
            const matchData = await fetchMatches({
                leaderboardIds: [leaderboardId],
                language: 'en',
                profileIds: [player.profileId],
            });

            if (!matchData?.matches) {
                throw new Error('Unable to load stats');
            }

            return matchData.matches;
        },
        enabled: isVisible,
        staleTime: 30 * 1000,
    });
    const { data: profile, isLoading: isProfileLoading } = useQuery({
        queryKey: ['leaderboard-player-stats', player.profileId],
        queryFn: async () => {
            const statsData = await fetchProfile({
                language: 'en',
                profileId: player.profileId,
                extend: 'stats',
                // extend: 'stats,last_10_matches_won',
            });
            if (!statsData?.stats || !statsData?.ratings) {
                throw new Error('Unable to load stats');
            }

            return statsData;
        },
        enabled: isVisible,
        staleTime: 5 * 60 * 1000,
    });

    const leaderboardPlayer = profile?.leaderboards.find((l) => l.leaderboardId === leaderboardId);

    let ratingHistory = profile?.ratings?.find((r) => r.leaderboardId === leaderboardId);
    const since = subWeeks(new Date(), 1);

    ratingHistory = ratingHistory
        ? {
              ...ratingHistory,
              ratings: ratingHistory.ratings.filter((d) => since == null || isAfter(d.date, since)),
          }
        : undefined;

    const themeCustomizations = {
        axis: {
            style: {
                tickLabels: {
                    fill: 'white',
                },
            },
        },
    };

    const stats = profile?.stats.find((s) => s.leaderboardId === leaderboardId);

    const chartTheme = merge({ ...VictoryTheme.material }, themeCustomizations);

    const tabs = ['Civilizations', 'Maps', 'Opponents'] as const;
    const [tab, setTab] = useState<(typeof tabs)[number]>('Civilizations');
    let tabData: Array<{
        games: number;
        wins: number;
        key: string;
        imageUrl?: string;
        name: string;
        icon?: string;
    }> = [];
    if (stats) {
        switch (tab) {
            case 'Civilizations':
                tabData = stats.civ.map((c) => ({
                    ...c,
                    key: c.civ,
                    imageUrl: c.civImageUrl,
                    name: c.civName,
                }));
                break;
            case 'Maps':
                tabData = stats.map.map((m) => ({
                    ...m,
                    key: m.map,
                    imageUrl: m.mapImageUrl,
                    name: m.mapName,
                }));
                break;
            case 'Opponents':
                tabData = stats.opponents.map((o) => ({
                    ...o,
                    key: o.profileId.toString(),
                    name: playerNames[o.profileId]?.name ?? o.name,
                    icon: playerNames[o.profileId]?.icon ?? o.countryIcon,
                }));
                break;
            default:
                tabData = [];
                break;
        }
    }

    tabData = orderBy(tabData, ['games', 'wins'], ['desc', 'desc']);

    const lastTenMatchesWon = player.last10MatchesWon ?? leaderboardPlayer?.last10MatchesWon?.map((w) => w.won);
    const rank = player.rank ?? leaderboardPlayer?.rank;

    return (
        <Transition appear show={isVisible} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto selection:bg-blue-600/90" style={{ colorScheme: 'dark' }}>
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full md:max-w-md lg:max-w-6xl transform overflow-hidden rounded-2xl bg-blue-950 p-6 text-left align-middle shadow-xl transition-all text-white">
                                <div className="flex justify-between">
                                    <DialogTitle as="h2" className="text-xl font-semibold">
                                        <span className="text-3xl mr-2 align-middle font-flag">{player.countryIcon ?? profile?.countryIcon}</span>
                                        {player.name}
                                    </DialogTitle>

                                    <button onClick={onClose}>
                                        <Icon color="white" icon="times" size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-stretch">
                                    <div className="flex-1 flex flex-col gap-3">
                                        <h3 className="text-lg font-bold -mb-2">Statistics</h3>

                                        {isProfileLoading || !profile ? (
                                            <div className="flex items-center justify-center py-4">
                                                {isProfileLoading ? (
                                                    <Icon className="animate-spin [animation-duration:1s]" icon="spinner" color="white" size={32} />
                                                ) : (
                                                    <p>Unable to fetch profile</p>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex flex-wrap gap-3 justify-center">
                                                    {[
                                                        {
                                                            name: player.rank ? 'Rank' : 'Current Rank',
                                                            value: `#${rank}`,
                                                            desc: player.rank
                                                                ? `${rank > 4 ? `${rank - 4} Below Qualifying` : 'Qualified Position'}`
                                                                : `${
                                                                      minRatingToQualify - (player.rating ?? leaderboardPlayer?.rating)
                                                                  } points to be in qualified position`,
                                                        },
                                                        {
                                                            name: 'Highest Rating',
                                                            value: `${player.maxRating ?? leaderboardPlayer?.maxRating}`,
                                                            desc: `Current Rating ${player.rating ?? leaderboardPlayer?.rating}`,
                                                        },
                                                        {
                                                            name: 'Streak',
                                                            value: formatStreakShort(player.streak ?? leaderboardPlayer?.streak),
                                                            desc: (
                                                                <LastFiveMatches
                                                                    playerNames={playerNames}
                                                                    last10MatchesWon={lastTenMatchesWon}
                                                                    player={player}
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            name: 'Games Played',
                                                            value: `${player.games ?? leaderboardPlayer?.games}`,
                                                            desc: `${player.wins ?? leaderboardPlayer?.wins} Wins, ${
                                                                player.losses ?? leaderboardPlayer?.losses
                                                            } Losses`,
                                                        },
                                                    ].map((stat) => (
                                                        <div
                                                            className="bg-blue-800 rounded-lg border border-gray-800 p-2 items-center text-center w-36"
                                                            key={stat.name}
                                                        >
                                                            <div className="stat-title">{stat.name}</div>
                                                            <div className={typeof stat.value === 'string' ? 'text-2xl' : undefined}>
                                                                {stat.value}
                                                            </div>
                                                            <div className={typeof stat.value === 'string' ? 'text-xs' : undefined}>{stat.desc}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {ratingHistory && (
                                                    <VictoryChart
                                                        width={350}
                                                        height={250}
                                                        theme={chartTheme}
                                                        padding={{
                                                            left: 50,
                                                            bottom: 30,
                                                            top: 20,
                                                            right: 20,
                                                        }}
                                                        scale={{ x: 'time' }}
                                                        containerComponent={
                                                            <VictoryCursorContainer
                                                                cursorComponent={<LineSegment style={{ stroke: 'white' }} />}
                                                                cursorDimension="x"
                                                                cursorLabel={({ datum }) => {
                                                                    const labels = [
                                                                        `${formatCustom(datum.x, 'Pp')} - ${
                                                                            orderBy(ratingHistory.ratings, 'date', 'desc').find(
                                                                                (r) => !isAfter(r.date, datum.x)
                                                                            )?.rating
                                                                        }`,
                                                                    ];
                                                                    return labels as unknown as number;
                                                                }}
                                                                cursorLabelComponent={
                                                                    <VictoryLabel
                                                                        backgroundStyle={
                                                                            ratingHistory
                                                                                ? [
                                                                                      {
                                                                                          fill: 'black',
                                                                                          borderRadius: 100,
                                                                                          strokeWidth: 1,
                                                                                          stroke: 'white',
                                                                                      },
                                                                                  ]
                                                                                : undefined
                                                                        }
                                                                        backgroundPadding={{ top: 5, bottom: 5, right: 8, left: 8 }}
                                                                        style={{ fill: 'white' }}
                                                                    />
                                                                }
                                                            />
                                                        }
                                                    >
                                                        <VictoryAxis
                                                            crossAxis
                                                            gridComponent={
                                                                <LineSegment
                                                                    active={false}
                                                                    style={{
                                                                        stroke: 'transparent',
                                                                    }}
                                                                />
                                                            }
                                                            tickFormat={formatTick}
                                                            tickCount={5}
                                                        />
                                                        <VictoryAxis
                                                            dependentAxis
                                                            crossAxis
                                                            gridComponent={
                                                                <LineSegment
                                                                    active={false}
                                                                    style={{
                                                                        stroke: '#272e43',
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                        <VictoryLine
                                                            name={'line-' + ratingHistory.leaderboardId}
                                                            key={'line-' + ratingHistory.leaderboardId}
                                                            data={ratingHistory.ratings}
                                                            x="date"
                                                            y="rating"
                                                            style={{
                                                                data: {
                                                                    stroke: '#D00E4D',
                                                                },
                                                            }}
                                                        />
                                                        <VictoryScatter
                                                            name={'scatter-' + ratingHistory.leaderboardId}
                                                            key={'scatter-' + ratingHistory.leaderboardId}
                                                            data={ratingHistory.ratings}
                                                            x="date"
                                                            y="rating"
                                                            size={1.5}
                                                            style={{
                                                                data: {
                                                                    fill: 'red',
                                                                },
                                                            }}
                                                        />
                                                    </VictoryChart>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-3 h-[500px] lg:overflow-y-scroll">
                                        <h3 className="text-lg font-bold -mb-2">Winrates</h3>
                                        {isProfileLoading || !stats ? (
                                            <div className="flex items-center justify-center py-4">
                                                {isProfileLoading ? (
                                                    <Icon className="animate-spin [animation-duration:1s]" icon="spinner" color="white" size={32} />
                                                ) : (
                                                    <p>Unable to fetch winrates</p>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex gap-2">
                                                    {tabs.map((t) => (
                                                        <button
                                                            onClick={() => setTab(t)}
                                                            className={`flex-1 uppercase font-bold text-xs px-4 pt-2 pb-1.5 rounded cursor-pointer ${
                                                                tab === t ? 'bg-gold-700' : ''
                                                            }`}
                                                            key={t}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className={`flex flex-col ${tab === 'Opponents' ? 'gap-0' : 'gap-3'}`}>
                                                    <div className={`flex text-xs font-bold  ${tab === 'Opponents' ? 'mb-2' : ''}`}>
                                                        <div className="flex-1">{tab.replace(/(s)$/, '')}</div>
                                                        <div className="w-12 text-right">Games</div>
                                                        <div className="w-16 text-right">Won</div>
                                                    </div>
                                                    {tabData.map((row) => (
                                                        <div
                                                            key={row.key}
                                                            className={cn(
                                                                'flex items-center',
                                                                tab === 'Opponents' && selectPlayer && 'cursor-pointer hover:underline'
                                                            )}
                                                            onClick={
                                                                tab === 'Opponents' && selectPlayer
                                                                    ? () => selectPlayer(row as unknown as IProfilesResultProfile)
                                                                    : undefined
                                                            }
                                                        >
                                                            <div className="flex gap-2 flex-1 items-center">
                                                                {row.imageUrl ? (
                                                                    <img src={row.imageUrl} className="w-5 h-5" />
                                                                ) : (
                                                                    <span className="text-lg align-middle">{row.icon}</span>
                                                                )}
                                                                {row.name}
                                                            </div>

                                                            <div className="w-12 text-right">{row.games}</div>
                                                            <div className="w-16 text-right">{((row.wins / row.games) * 100).toFixed(0)}%</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-3 h-[500px] lg:overflow-y-scroll">
                                        <h3 className="text-lg font-bold -mb-2">Recent Games</h3>
                                        {isLoading || !data?.length ? (
                                            <div className="flex items-center justify-center py-4">
                                                {isLoading ? (
                                                    <Icon
                                                        className={isLoading ? 'animate-spin [animation-duration:1s]' : undefined}
                                                        icon="spinner"
                                                        color="white"
                                                        size={32}
                                                    />
                                                ) : (
                                                    <p>Unable to fetch recent games</p>
                                                )}
                                            </div>
                                        ) : (
                                            data?.map((match, index) => (
                                                <div key={match.matchId} className="bg-blue-800 rounded-lg border border-gray-800 px-3 py-2">
                                                    <MatchCard
                                                        index={index}
                                                        userId={player.profileId}
                                                        match={reformatTeamMatch(match)}
                                                        playerNames={playerNames}
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

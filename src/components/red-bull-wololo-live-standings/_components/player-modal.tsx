import { fetchMatches, fetchProfile } from '@app/api/helper/api';
import { ILeaderboardPlayer } from '@app/api/helper/api.types';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { isAfter, isToday, isWithinInterval, isYesterday, subDays, subHours } from 'date-fns';
import { maxBy, minBy, orderBy } from 'lodash';
import { Fragment, useEffect, useState } from 'react';
import { LazyPerfChart } from '@app/view/components/perf-chart/lazy-perf-chart';
import type { ChartTheme } from '@app/view/components/perf-chart/types';
import { formatStreakShort, LastFiveMatches } from './last-five-matches';
import { formatCustom } from '@nex/data';
import { MatchCard } from './match-card';
import { reformatTeamMatch } from '../util';
import { Icon } from '@app/components/icon';
import { faSpinner, faTimes } from '@fortawesome/sharp-solid-svg-icons';
import cn from 'classnames';
import { Button } from '@app/components/button';
import useDebounce from '@app/hooks/use-debounce';
import { Field } from '@app/components/field';
import { Link } from 'expo-router';
import { START_DATE } from '../dates';
import { RatingDiff } from './rating-diff';

// The modal is always drawn on the dark overlay background.
const chartTheme: ChartTheme = {
    dark: true,
    textColor: '#FFFFFF',
    gridColor: '#272e43',
    axisColor: '#90a4ae',
    background: 'transparent',
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
    selectPlayer?: (player: { name: string; profileId: number }) => void;
    onViewStats?: () => void;
}) => {
    const [activityValue, setActivityValue] = useState(localStorage.getItem('activityValue') ?? 'today');
    const [text, setText] = useState('');
    const debouncedSearch = useDebounce(text, 600);
    const { data, fetchNextPage, hasNextPage, isLoading: isLoadingMatches, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['matches', player.profileId, debouncedSearch],
        queryFn: (context) =>
            fetchMatches({
                ...context,
                profileIds: [player.profileId],
                search: debouncedSearch,
                leaderboardIds: [leaderboardId],
                language: 'en',
            }),
        staleTime: 30 * 1000,
        enabled: isVisible,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => (lastPage.matches.length === lastPage.perPage ? lastPage.page + 1 : null),
    });

    const isLoading = debouncedSearch !== text || isLoadingMatches;

    const { data: profile, isLoading: isProfileLoading } = useQuery({
        queryKey: ['leaderboard-player-stats', player.profileId],
        queryFn: async () => {
            const statsData = await fetchProfile({
                language: 'en',
                profileId: player.profileId,
                extend: 'stats,last_10_matches_won',
                stats_player_limit: 250,
            });
            if (!statsData?.stats || !statsData?.ratings) {
                throw new Error('Unable to load stats');
            }

            return statsData;
        },
        enabled: isVisible,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        setText('');
    }, [isVisible]);

    const leaderboardPlayer = profile?.leaderboards.find((l) => l.leaderboardId === leaderboardId);

    let ratingHistory = profile?.ratings?.find((r) => r.leaderboardId === leaderboardId);

    const recentRatings = ratingHistory?.ratings.filter((rating) => {
        const now = new Date();

        switch (activityValue) {
            case 'today':
                return isToday(rating.date);
            case 'yesterday':
                return isYesterday(rating.date);
            case '24':
                return isWithinInterval(rating.date, {
                    start: subHours(now, 24),
                    end: now,
                });
            case '48':
                return isWithinInterval(rating.date, {
                    start: subHours(now, 48),
                    end: now,
                });
            case 'week':
                return isWithinInterval(rating.date, {
                    start: subDays(now, 7),
                    end: now,
                });
            default:
                return false;
        }
    });
    const recentDiff = recentRatings?.map((rating) => rating.ratingDiff ?? 0).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const recentWins = recentRatings?.filter((r) => (r.ratingDiff ?? 0) > 0);
    const recentLosses = recentRatings?.filter((r) => (r.ratingDiff ?? 0) < 0);
    const biggestWin = maxBy(recentWins, 'ratingDiff');
    const biggestLoss = minBy(recentLosses, 'ratingDiff');

    const since = START_DATE;

    ratingHistory = ratingHistory
        ? {
              ...ratingHistory,
              ratings: ratingHistory.ratings.filter((d) => since == null || isAfter(d.date, since)),
          }
        : undefined;


    const stats = profile?.stats.find((s) => s.leaderboardId === leaderboardId);


    const tabs = ['Civilizations', 'Maps', 'Opponents'] as const;
    const [tab, setTab] = useState<(typeof tabs)[number]>('Civilizations');
    let tabData: {
        games: number;
        wins: number;
        key: string;
        imageUrl?: string;
        name: string;
        icon?: string;
    }[] = [];
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

    const recentMatches = data?.pages?.[0].matches;

    const lastTenMatchesWon = player.last10MatchesWon ?? leaderboardPlayer?.last10MatchesWon?.map((w) => w.won);
    const rank = player.rank ?? leaderboardPlayer?.rank;
    const rating =
        player.rating ??
        leaderboardPlayer?.rating ??
        recentMatches
            ?.find((m) => m.finished)
            ?.teams.flatMap((t) => t.players)
            .find((p) => p.profileId === player.profileId)?.rating;
    const streak = player.streak ?? leaderboardPlayer?.streak;
    const countryIcon = player.countryIcon ?? profile?.countryIcon;
    const wins =
        player.wins ??
        leaderboardPlayer?.wins ??
        recentMatches?.filter((m) => m.teams.flatMap((t) => t.players).find((p) => p.profileId === player.profileId && p.won === true) && m.finished)
            .length;
    const losses =
        player.losses ??
        leaderboardPlayer?.losses ??
        recentMatches?.filter((m) => m.teams.flatMap((t) => t.players).find((p) => p.profileId === player.profileId && p.won === false) && m.finished)
            .length;
    const games = player.games ?? leaderboardPlayer?.games ?? recentMatches?.filter((m) => m.finished).length;

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
                                <div className="flex justify-between items-start md:items-center">
                                    <div className="flex flex-col md:flex-row gap-1 md:gap-4 mb-4 md:mb-0 md:items-center">
                                        <DialogTitle as="h2" className="text-xl font-semibold pb-2">
                                            {!!(countryIcon) && <span className="text-3xl mr-2 align-middle font-flag">{countryIcon}</span>}
                                            {player.name}
                                        </DialogTitle>

                                        <Link className="flex rounded mb-1" href={`/players/${player.profileId}`} target="_blank">
                                            <Button size="small">View Full Profile</Button>
                                        </Link>
                                    </div>

                                    <button onClick={onClose}>
                                        <Icon color="white" icon={faTimes} size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-stretch px-px">
                                    <div className="flex-1 flex flex-col gap-3">
                                        <h3 className="text-lg font-bold -mb-2">Statistics</h3>

                                        {!player.rank && (isProfileLoading || !profile) ? (
                                            <div className="flex items-center justify-center py-4">
                                                {isProfileLoading ? (
                                                    <Icon className="animate-spin [animation-duration:1s]" icon={faSpinner} color="white" size={32} />
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
                                                            value: rank ? `#${rank}` : 'Unranked',
                                                            desc: player.rank
                                                                ? `${rank > 4 ? `${rank - 4} Below Qualifying` : 'Qualified Position'}`
                                                                : rating && rank
                                                                ? `${minRatingToQualify - rating} points to be in qualified position`
                                                                : games && rating
                                                                ? '10 match minimum'
                                                                : undefined,
                                                        },
                                                        {
                                                            name: 'Highest Rating',
                                                            value: `${player.maxRating ?? leaderboardPlayer?.maxRating ?? 'N/A'}`,
                                                            desc: rating ? `Current Rating ${rating}` : undefined,
                                                        },
                                                        {
                                                            name: 'Streak',
                                                            value: streak ? formatStreakShort(player.streak ?? leaderboardPlayer?.streak) : 'N/A',
                                                            desc: lastTenMatchesWon ? (
                                                                <LastFiveMatches
                                                                    playerNames={playerNames}
                                                                    last10MatchesWon={lastTenMatchesWon}
                                                                    player={player}
                                                                />
                                                            ) : undefined,
                                                        },
                                                        {
                                                            name: 'Games Played',
                                                            value: `${games ?? 'N/A'}`,
                                                            desc: games ? `${wins} Wins, ${losses} Losses` : undefined,
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

                                                    {recentRatings ? (
                                                        <div className="flex bg-blue-800 rounded-lg border border-gray-800 px-3 py-2 items-center w-75 justify-between">
                                                            <div className="text-sm font-medium">
                                                                Activity from
                                                                <br />
                                                                <select
                                                                    className="p-0 appearance-none underline bg-blue-800"
                                                                    onChange={(e) => {
                                                                        localStorage.setItem('activityValue', e.target.value);
                                                                        setActivityValue(e.target.value);
                                                                    }}
                                                                    value={activityValue}
                                                                >
                                                                    <option value="today">Today</option>
                                                                    <option value="yesterday">Yesterday</option>
                                                                    <option value="24">Past 24 hours</option>
                                                                    <option value="48">Past 48 hours</option>
                                                                    <option value="week">Past Week</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex flex-col items-center group relative cursor-pointer">
                                                                <div className="text-2xl -mt-1">{recentRatings.length}</div>
                                                                <div className="text-xs">{recentRatings.length === 1 ? 'Game' : 'Games'}</div>

                                                                <div className="absolute top-12 left-1/2 -translate-x-1/2 mx-auto scale-0 bg-black rounded-lg border-gray-800 px-3 py-2 group-hover:scale-100 z-10 text-sm shadow-2xl transition-transform text-center 2xl:whitespace-nowrap w-56 2xl:w-auto invisible group-hover:visible">
                                                                    <div className="h-0 w-0 border-x-8 border-x-transparent border-b-8 border-black absolute -top-2 mx-auto left-0 right-0"></div>
                                                                    {recentWins?.length} {recentWins?.length === 1 ? 'win' : 'wins'}
                                                                    <br />
                                                                    {recentLosses?.length} {recentLosses?.length === 1 ? 'loss' : 'losses'}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-center group relative cursor-pointer">
                                                                <div className="text-2xl -mt-1">
                                                                    <RatingDiff ratingDiff={recentDiff ?? 0} />
                                                                </div>
                                                                <div className="text-xs">Points</div>

                                                                <div className="absolute top-12 left-1/2 -translate-x-1/2 mx-auto scale-0 bg-black rounded-lg border-gray-800 px-3 py-2 group-hover:scale-100 z-10 text-sm shadow-2xl transition-transform text-center 2xl:whitespace-nowrap w-56 2xl:w-auto invisible group-hover:visible">
                                                                    <div className="h-0 w-0 border-x-8 border-x-transparent border-b-8 border-black absolute -top-2 mx-auto left-0 right-0"></div>
                                                                    Biggest Win:{' '}
                                                                    {biggestWin?.ratingDiff ? (
                                                                        <RatingDiff ratingDiff={biggestWin.ratingDiff} />
                                                                    ) : (
                                                                        'N/A'
                                                                    )}
                                                                    <br />
                                                                    Biggest Loss:{' '}
                                                                    {biggestLoss?.ratingDiff ? (
                                                                        <RatingDiff ratingDiff={biggestLoss.ratingDiff} />
                                                                    ) : (
                                                                        'N/A'
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                {ratingHistory && (
                                                    <LazyPerfChart
                                                        width={350}
                                                        height={250}
                                                        theme={chartTheme}
                                                        padding={{ left: 10, bottom: 10, top: 20, right: 20 }}
                                                        xAxis={{ grid: false }}
                                                        series={[
                                                            {
                                                                id: ratingHistory.leaderboardId,
                                                                label: 'Rating',
                                                                color: '#D00E4D',
                                                                scatter: true,
                                                                scatterRadius: 1.5,
                                                                data: ratingHistory.ratings
                                                                    .map((r) => ({ x: new Date(r.date).getTime(), y: r.rating }))
                                                                    .sort((a, b) => a.x - b.x),
                                                            },
                                                        ]}
                                                        cursor={{ formatX: (x) => formatCustom(new Date(x), 'Pp') }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-3 h-[564px] lg:overflow-y-scroll px-px">
                                        <div className="flex flex-row items-center justify-between -mb-2">
                                            <h3 className="text-lg font-bold">Statistics</h3>
                                        </div>
                                        {isProfileLoading || !stats ? (
                                            <div className="flex items-center justify-center py-4">
                                                {isProfileLoading ? (
                                                    <Icon className="animate-spin [animation-duration:1s]" icon={faSpinner} color="white" size={32} />
                                                ) : (
                                                    <p>Unable to fetch Statistics</p>
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

                                                <div className="flex flex-col gap-1">
                                                    <div className="flex text-xs font-bold">
                                                        <div className="flex-1">{tab.replace(/(s)$/, '')}</div>
                                                        <div className="w-12 text-right">Games</div>
                                                        <div className="w-16 text-right">Won</div>
                                                    </div>

                                                    {tabData.length === 0 && <p className="text-center">No {tab.toLowerCase()} found</p>}

                                                    {tabData.map((row) => (
                                                        <div key={row.key} className="flex items-center h-7">
                                                            <div className="flex gap-2 flex-1 items-center overflow-hidden">
                                                                {row.imageUrl ? (
                                                                    <img src={row.imageUrl} className="w-5 h-5" />
                                                                ) : row.icon ? (
                                                                    <span className="text-lg align-middle font-flag">{row.icon}</span>
                                                                ) : null}
                                                                <span
                                                                    className={cn(
                                                                        'flex-1 whitespace-nowrap overflow-hidden text-ellipsis',
                                                                        tab === 'Opponents' && selectPlayer && 'cursor-pointer hover:underline'
                                                                    )}
                                                                    onClick={
                                                                        tab === 'Opponents' && selectPlayer
                                                                            ? () =>
                                                                                  selectPlayer({
                                                                                      profileId: Number(row.key),
                                                                                      name: row.name,
                                                                                  })
                                                                            : undefined
                                                                    }
                                                                >
                                                                    {row.name}
                                                                </span>
                                                            </div>

                                                            <div className="w-12 text-right">{row.games}</div>
                                                            <div className="w-16 text-right">{((row.wins / row.games) * 100).toFixed(0)}%</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-3 h-[564px] lg:overflow-y-scroll px-px">
                                        <h3 className="text-lg font-bold -mb-2">Recent Games</h3>

                                        <Field value={text} onChangeText={setText} placeholder="Search by opponent" />

                                        {isLoading || !data?.pages.length ? (
                                            <div className="flex items-center justify-center py-4">
                                                {isLoading ? (
                                                    <Icon
                                                        className={isLoading ? 'animate-spin [animation-duration:1s]' : undefined}
                                                        icon={faSpinner}
                                                        color="white"
                                                        size={32}
                                                    />
                                                ) : !data ? (
                                                    <p>Unable to fetch recent games</p>
                                                ) : (
                                                    <p>No recent games</p>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {data.pages
                                                    .flatMap((p) => p.matches)
                                                    ?.map((match, index) => (
                                                        <Link
                                                            key={match.matchId}
                                                            className="block bg-blue-800 rounded-lg border border-gray-800 px-3 py-2"
                                                            href={`/matches/${match.matchId}`}
                                                            target="_blank"
                                                        >
                                                            <MatchCard
                                                                index={index}
                                                                userId={player.profileId}
                                                                match={reformatTeamMatch(match)}
                                                                playerNames={playerNames}
                                                                selectPlayer={selectPlayer}
                                                            />
                                                        </Link>
                                                    ))}
                                                {isFetchingNextPage ? (
                                                    <div className="mt-1 min-h-6 relative overflow-hidden">
                                                        <div className="absolute inset-0 flex flex-row justify-center">
                                                            <Icon
                                                                className="animate-spin [animation-duration:1s]"
                                                                icon={faSpinner}
                                                                color="white"
                                                                size={24}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    hasNextPage && (
                                                        <div className="flex flex-row justify-center">
                                                            <Button className="mt-1" size="small" onPress={() => fetchNextPage()}>
                                                                Load More
                                                            </Button>
                                                        </div>
                                                    )
                                                )}
                                            </>
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

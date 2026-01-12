import { WinrateCiv } from '@app/api/winrates';
import { Icon } from '@app/components/icon';
import { Text } from '@app/components/text';
import { Image } from '@app/components/uniwind/image';
import { CivWinrateCard } from '@app/components/winrates/civ-card';
import { useTranslation } from '@app/helper/translate';
import { useLanguage } from '@app/queries/all';
import { Slider2 } from '@app/view/components/slider2';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { getHost } from '@nex/data';
import { useQuery } from '@tanstack/react-query';
import { orderBy } from 'lodash';
import { Fragment, useState } from 'react';
import { View } from 'react-native';

interface CivStat {
    civ: string;
    civName: string;
    civImageUrl: string;
    games: number;
    wins: number;
    losses: number;
}

interface MapStat {
    map: string;
    mapName: string;
    mapImageUrl: string;
    games: number;
    civ: CivStat[];
}

export const StatsModal = ({ onClose, isVisible, profileIds }: { isVisible: boolean; onClose: () => void; profileIds: number[] }) => {
    const language = useLanguage();
    const [source, setSource] = useState(localStorage.getItem('statsSource') ?? 'top50');
    const ids = source === 'all' ? [] : profileIds;
    const getTranslation = useTranslation();
    const { data, isPending: isFetching } = useQuery<MapStat[]>({
        queryKey: ['statistics', ids],
        queryFn: async () => {
            const response = await fetch(
                `${getHost('aoe2companion-data')}api/leaderboards/ew_1v1_redbullwololo/statistics?profile_ids=${ids.join(',')}`
            );
            const text = await response.text();
            return JSON.parse(text);
        },
        staleTime: 2 * 60 * 1000,
        gcTime: Infinity,
        refetchOnWindowFocus: true,
        enabled: isVisible,
    });

    const convertedStats =
        data?.map((map) => ({
            ...map,
            civ: map.civ.map<WinrateCiv>((civ) => ({
                rank: 0,
                by_map: {},
                civ_name: civ.civ,
                by_matchup: {},
                by_opening: {},
                prior_rank: 0,
                by_game_time: {},
                avg_castle_time: 0,
                avg_feudal_time: 0,
                avg_game_length: 0,
                avg_imperial_time: 0,
                wins: civ.wins,
                ci_lower: 0,
                ci_upper: 0,
                win_rate: civ.wins / civ.games,
                num_games: civ.games,
                play_rate: civ.games / (map.games / 2),
            })),
        })) ?? [];

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
                    <div className="fixed inset-0 bg-black/90" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto selection:bg-blue-600/90" style={{ colorScheme: 'dark' }}>
                    <div className="flex min-h-full justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full md:max-w-md lg:max-w-7xl transform overflow-hidden rounded-2xl bg-blue-950 p-6 text-left align-middle shadow-xl transition-all text-white relative min-h-full">
                                <div className="flex flex-col gap-4 items-center min-h-full">
                                    <button onClick={onClose} className="absolute top-4 right-4">
                                        <Icon icon="times" size={24} color="white" />
                                    </button>

                                    <DialogTitle as="h2" className="text-2xl font-semibold">
                                        Statistics for{' '}
                                        <select
                                            className="p-0 appearance-none underline bg-blue-950"
                                            onChange={(e) => {
                                                setSource(e.target.value);
                                                localStorage.setItem('statsSource', e.target.value);
                                            }}
                                            value={source}
                                        >
                                            <option value="top50">Top 50 Players</option>
                                            <option value="all">All Players</option>
                                        </select>
                                    </DialogTitle>

                                    {convertedStats.length > 0 && (
                                        <Text variant="label-lg">{convertedStats.reduce((acc, current) => acc + current.games, 0).toLocaleString(language)} Games</Text>
                                    )}

                                    <View className="gap-6 flex-1">
                                        {isFetching ? (
                                            <View className="items-center justify-center flex-1">
                                                <Icon className="animate-spin [animation-duration:1s]" icon="spinner" color="white" size={32} />
                                            </View>
                                        ) : (
                                            convertedStats.map((stat, index) => {
                                                const sortedWinrates = orderBy(stat.civ, 'win_rate', 'asc');

                                                const sortedPlayrates = orderBy(stat.civ, 'play_rate', 'asc');

                                                return (
                                                    <Fragment key={stat.map}>
                                                        {index !== 0 && <View className="h-px bg-gray-800" />}

                                                        <View className="flex-col lg:flex-row gap-4 items-center">
                                                            <View className="flex flex-col items-center gap-2">
                                                                <Image source={{ uri: stat.mapImageUrl }} className="w-32 h-32" />

                                                                <View className="items-center gap-0.5">
                                                                    <Text variant="header">{stat.mapName}</Text>
                                                                    <Text variant="label">{stat.games.toLocaleString(language)} Games</Text>
                                                                </View>
                                                            </View>

                                                            <View className="gap-2 w-sm xl:w-md">
                                                                <View className="flex-row justify-between items-center px-4">
                                                                    <Text variant="header-sm">
                                                                        {getTranslation('winrates.mostplayedcivilizations')}
                                                                    </Text>
                                                                </View>
                                                                <Slider2
                                                                    className="pb-6"
                                                                    paginationStyle={{ bottom: 0 }}
                                                                    slides={[...sortedPlayrates]
                                                                        .reverse()
                                                                        .slice(0, 5)
                                                                        .map((civ) => (
                                                                            <CivWinrateCard civ={civ} maxPlayrate={100} clickable={false} />
                                                                        ))}
                                                                />
                                                            </View>

                                                            <View className="gap-2 w-sm xl:w-md">
                                                                <View className="flex-row justify-between items-center px-4">
                                                                    <Text variant="header-sm">{getTranslation('winrates.highestwinrates')}</Text>
                                                                </View>
                                                                <Slider2
                                                                    className="pb-6"
                                                                    paginationStyle={{ bottom: 0 }}
                                                                    slides={[...sortedWinrates]
                                                                        .reverse()
                                                                        .slice(0, 5)
                                                                        .map((civ) => (
                                                                            <CivWinrateCard civ={civ} maxPlayrate={100} clickable={false} />
                                                                        ))}
                                                                />
                                                            </View>
                                                        </View>
                                                    </Fragment>
                                                );
                                            })
                                        )}
                                    </View>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

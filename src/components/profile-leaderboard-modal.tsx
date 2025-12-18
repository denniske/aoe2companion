import React, { Fragment, useMemo, useState } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Icon } from './icon';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { StatsRow } from '@app/view/components/stats-rows';
import { IProfileRatingsLeaderboard, IStatNew } from '@app/api/helper/api.types';
import { useTranslation } from '@app/helper/translate';
import { Text } from './text';
import { Card } from './card';
import RatingChart from '@app/view/components/rating-chart';
import { formatDateShort, formatMonth, formatTime, formatYear } from '@nex/data';
import { InlinePlayerSearch } from './inline-player-search';
import { useProfile } from '@app/queries/all';
import { useResolveClassNames } from 'uniwind';
import { TimespanSelect } from './select/timespan-select';
import { getRatingTimespan } from '@app/utils/rating';
import { isAfter } from 'date-fns';

export const ProfileLeaderboardModal = ({
    onClose,
    isVisible,
    ratings,
    stats,
    name,
}: {
    isVisible: boolean;
    onClose: () => void;
    stats: IStatNew | undefined;
    ratings: IProfileRatingsLeaderboard | undefined;
    name?: string;
}) => {
    const [comparedProfileId, setComparedProfileId] = useState<number | null>(null);
    const getTranslation = useTranslation();
    const { data: compariedProfile, isLoading: isLoadingComparison } = useProfile(comparedProfileId || 0);
    const [ratingHistoryDuration, setRatingHistoryDuration] = useState<string>('max');

    const personalStyles = useResolveClassNames('text-gold-600');
    const compareStyles = useResolveClassNames('text-blue-500');

    const ratingHistories = useMemo(() => {
        const since = getRatingTimespan(ratingHistoryDuration);

        const allRatings: Array<IProfileRatingsLeaderboard & { color?: string; label?: string }> = [];
        const comparedRatings = compariedProfile?.ratings.find((r) => r.leaderboardId === ratings?.leaderboardId);

        if (ratings) {
            allRatings.push({
                ...ratings,
                ratings: ratings.ratings.filter((d) => since == null || isAfter(d.date!, since)),
                color: personalStyles.color?.toString(),
                label: name,
            });
        }

        if (comparedRatings) {
            allRatings.push({
                ...comparedRatings,
                ratings: comparedRatings.ratings.filter((d) => since == null || isAfter(d.date!, since)),
                color: compareStyles.color?.toString(),
                label: compariedProfile?.name,
            });
        }

        return allRatings;
    }, [personalStyles, compareStyles, compariedProfile, ratings, name, ratingHistoryDuration]);

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

                <div className="fixed inset-0 overflow-y-auto">
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
                            <DialogPanel className="w-full max-w-6xl transform rounded-2xl bg-gold-50 dark:bg-blue-950 pt-2 p-6 text-left align-middle shadow-xl transition-all relative">
                                <View className="gap-4 mt-4">
                                    <View className="flex-row justify-between">
                                        <Text variant="title" color="brand">
                                            {name} - {stats?.leaderboardName}
                                        </Text>

                                        <TouchableOpacity onPress={onClose}>
                                            <Icon icon="times" size={32} prefix="fasr" />
                                        </TouchableOpacity>
                                    </View>

                                    <View className="flex-row items-center gap-4 relative">
                                        <Text variant="header-lg">Rating History</Text>
                                        <View className="flex-1" />
                                        <TimespanSelect
                                            ratingHistoryDuration={ratingHistoryDuration}
                                            setRatingHistoryDuration={setRatingHistoryDuration}
                                        />
                                    </View>

                                    {ratings && (
                                        <View className="z-50">
                                            <RatingChart
                                                allowMouseInteraction
                                                width={1200}
                                                formatTick={(date) => {
                                                    if (
                                                        date.getMonth() == 0 &&
                                                        date.getDate() == 1 &&
                                                        date.getHours() == 0 &&
                                                        date.getMinutes() == 0 &&
                                                        date.getSeconds() == 0
                                                    ) {
                                                        return formatYear(date);
                                                    }
                                                    if (
                                                        date.getDate() == 1 &&
                                                        date.getHours() == 0 &&
                                                        date.getMinutes() == 0 &&
                                                        date.getSeconds() == 0
                                                    ) {
                                                        return formatMonth(date);
                                                    }
                                                    if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
                                                        return formatDateShort(date);
                                                    }
                                                    return formatTime(date);
                                                }}
                                                filteredRatingHistories={ratingHistories}
                                                hiddenLeaderboardIds={[]}
                                                ratingHistoryDuration={ratingHistoryDuration}
                                            />
                                            <View className="flex-row gap-8 justify-center mt-4 items-center">
                                                {ratingHistories.map((history) => (
                                                    <View className="flex-row gap-2 items-center overflow-hidden shrink">
                                                        <View style={{ backgroundColor: history.color }} className="h-6 w-6" />

                                                        <Text variant="label" numberOfLines={1} className="flex-1">
                                                            {history.label}
                                                        </Text>
                                                    </View>
                                                ))}

                                                {isLoadingComparison && <ActivityIndicator animating color="#999" />}

                                                <View className="flex-row gap-4 items-center">
                                                    <Text variant="label">Compare With</Text>
                                                    <InlinePlayerSearch
                                                        showViewAll={false}
                                                        onSelect={({ profileId }) => setComparedProfileId(profileId)}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                    <Text variant="header-lg">Statistics</Text>

                                    <View className="grid grid-cols-3 gap-4 items-start">
                                        {(
                                            [
                                                [{ key: 'civ', title: 'civ' }],
                                                [{ key: 'map', title: 'map' }],
                                                [
                                                    { key: 'opponents', title: 'opponent' },
                                                    { key: 'allies', title: 'ally' },
                                                ],
                                            ] as const
                                        ).map((group) => (
                                            <View className="gap-4">
                                                {group.map(({ key, title }) =>
                                                    stats?.[key].length ? (
                                                        <Card direction="vertical" className="gap-1 flex-1 py-3!" key={key}>
                                                            <View className="flex-row items-end">
                                                                <Text color="brand" variant="header" className="flex-4" numberOfLines={1}>
                                                                    {getTranslation(`main.stats.heading.${title}`)}
                                                                </Text>

                                                                <Text numberOfLines={1} align="right" className="flex-1" color="subtle">
                                                                    {getTranslation('main.stats.heading.games')}
                                                                </Text>
                                                                <Text numberOfLines={1} align="right" className="flex-1" color="subtle">
                                                                    {getTranslation('main.stats.heading.won')}
                                                                </Text>
                                                            </View>

                                                            <View className="h-px bg-border" />

                                                            {title === 'civ' &&
                                                                stats.civ.map((stat, index) => <StatsRow key={index} data={stat} type={title} />)}

                                                            {title === 'map' &&
                                                                stats.map.map((stat, index) => <StatsRow key={index} data={stat} type={title} />)}

                                                            {title === 'ally' &&
                                                                stats.allies.map((stat, index) => <StatsRow key={index} data={stat} type={title} />)}

                                                            {title === 'opponent' &&
                                                                stats.opponents.map((stat, index) => (
                                                                    <StatsRow key={index} data={stat} type={title} />
                                                                ))}
                                                        </Card>
                                                    ) : null
                                                )}
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

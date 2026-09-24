import cn from 'classnames';
import { PressableOpacity } from '@app/components/pressable-opacity';
import { Platform, StyleSheet, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { formatDateShort, formatMonth, formatTime, formatYear, LeaderboardId } from '@nex/data';
import { getLeaderboardTextColor } from '../../helper/colors';
import { TextLoader } from './loader/text-loader';
import { useAppTheme } from '../../theming';
import { isAfter } from 'date-fns';
import { IProfileRatingsLeaderboard, IProfileResult } from '../../api/helper/api.types';
import { ViewLoader } from '@app/view/components/loader/view-loader';
import { PerfChart } from '@app/view/components/perf-chart/native-perf-chart';
import type { ChartSeries } from '@app/view/components/perf-chart/types';
import { useAuthProfileId } from '@app/queries/all';
import { usePrefData } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-account';
import { useTranslation } from '@app/helper/translate';
import { getRatingTimespan } from '@app/utils/rating';
import { TimespanSelect } from '@app/components/select/timespan-select';
import RatingChart from '@app/view/components/rating-chart';

interface IRatingProps {
    ratingHistories?: IProfileRatingsLeaderboard[] | null;
    profile?: Pick<IProfileResult, 'profileId'> | null;
    ready: boolean;
    // The screen can own the timespan instead, so its selector can sit in a row
    // with the other filters rather than inside the chart card.
    ratingHistoryDuration?: string;
}

export default function Rating({ ratingHistories, profile, ready, ratingHistoryDuration: durationProp }: IRatingProps) {
    const [width, setWidth] = useState(0)
    const getTranslation = useTranslation();
    const effectiveRatingHistories = ready ? ratingHistories : null;

    const theme = useAppTheme();
    const authProfileId = useAuthProfileId();

    const prefHiddenLeaderboardIds = usePrefData((state) => state?.ratingHistoryHiddenLeaderboardIds);
    const savePrefsMutation = useSavePrefsMutation();
    const [hiddenLeaderboardIds, setHiddenLeaderboardIds] = useState<LeaderboardId[]>([]);
    const [appliedHiddenLeaderboardIds, setAppliedHiddenLeaderboardIds] = useState(false);

    useEffect(() => {
        if (!authProfileId) return;
        if (!profile) return;
        if (appliedHiddenLeaderboardIds) return;

        if (authProfileId === profile?.profileId) {
            setHiddenLeaderboardIds(prefHiddenLeaderboardIds || []);
        } else {
            setHiddenLeaderboardIds([]);
        }
        setAppliedHiddenLeaderboardIds(true);
    }, [authProfileId, profile, appliedHiddenLeaderboardIds]);

    // Changing the pref will trigger a rerender on every chart. Should we do this?
    // const ratingHistoryDuration = useSelector((state) => state.prefs.ratingHistoryDuration) || 'max';
    const [ownDuration, setOwnDuration] = useState<string>('max');
    const ratingHistoryDuration = durationProp ?? ownDuration;

    const toggleLeaderboard = (leaderboardId: LeaderboardId) => {
        let ids = [];
        if (hiddenLeaderboardIds.includes(leaderboardId)) {
            ids = hiddenLeaderboardIds.filter((id) => id != leaderboardId);
        } else {
            ids = [...hiddenLeaderboardIds, leaderboardId];
        }
        setHiddenLeaderboardIds(ids);
        if (authProfileId === profile?.profileId) {
            savePrefsMutation.mutate({ ratingHistoryHiddenLeaderboardIds: hiddenLeaderboardIds });
        }
    };

    // We need to supply our custom tick formatter because otherwise victory native will
    // print too much ticks on the x-axis.
    const formatTick = (date: Date) => {
        if (date.getMonth() == 0 && date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatYear(date);
        }
        if (date.getDate() == 1 && date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatMonth(date);
        }
        if (date.getHours() == 0 && date.getMinutes() == 0 && date.getSeconds() == 0) {
            return formatDateShort(date);
        }
        return formatTime(date);
    };

    const filteredRatingHistories = useMemo(() => {
        const since = getRatingTimespan(ratingHistoryDuration);

        // No pc/console split here any more: the caller passes the histories it wants
        // charted, which for a leaderboard screen is that one leaderboard.
        return effectiveRatingHistories?.map((r) => ({
            ...r,
            leaderboardId: r.leaderboardId,
            ratings: r.ratings.filter((d) => since == null || isAfter(d.date!, since)),
        }));
    }, [effectiveRatingHistories, ratingHistoryDuration]);

    const hasData = filteredRatingHistories?.some((rh) => rh.ratings.length > 0);

    // PerfChart wants epoch-ms points sorted ascending; the api hands them back
    // newest first.
    const perfSeries = useMemo<ChartSeries[]>(
        () =>
            (filteredRatingHistories ?? [])
                .filter((rh) => !hiddenLeaderboardIds?.includes(rh.leaderboardId) && rh.ratings.length > 0)
                .map((rh) => ({
                    id: rh.leaderboardId,
                    color: getLeaderboardTextColor(rh.leaderboardId, theme.dark),
                    data: rh.ratings
                        .map((r) => ({ x: new Date(r.date!).getTime(), y: r.rating }))
                        .sort((a, b) => a.x - b.x),
                })),
        [filteredRatingHistories, hiddenLeaderboardIds, theme.dark]
    );

    // console.log('Rendering Rating chart, hasData', hasData, filteredRatingHistories);

    return (
        <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} className='w-full'>
            {durationProp === undefined && (
                <View className="flex-row justify-end mb-4">
                    <TimespanSelect ratingHistoryDuration={ownDuration} setRatingHistoryDuration={setOwnDuration} />
                </View>
            )}

            {/* The selectors sit right above; give the plot room to breathe. */}
            <ViewLoader ready={hasData}>
                <View style={{ width: width, height: 300 }} className="mt-4">
                    {hasData &&
                        (Platform.OS === 'web' ? (
                            <RatingChart
                                width={width}
                                formatTick={formatTick}
                                ratingHistoryDuration={ratingHistoryDuration}
                                filteredRatingHistories={filteredRatingHistories}
                                hiddenLeaderboardIds={hiddenLeaderboardIds}
                            />
                        ) : (
                            // Trying the renderer from the chart project on native. Web keeps the
                            // victory chart, whose web build already works around CanvasKit not
                            // being ready at module scope (see rating-chart.web.tsx).
                            <PerfChart series={perfSeries} width={width} height={300} dark={theme.dark} />
                        ))}
                </View>
            </ViewLoader>

            {/* One series needs no legend to tell it apart. */}
            {(filteredRatingHistories?.length ?? 0) > 1 && (
            <View className="flex-row justify-evenly flex-wrap -mx-2 mt-3">
                {(filteredRatingHistories || Array(2).fill(0)).map((ratingHistory, i) => (
                    <PressableOpacity key={'legend-' + i} onPress={() => toggleLeaderboard(ratingHistory.leaderboardId)}>
                        <TextLoader
                            width={100}
                            key={'legend-' + i}
                            style={{
                                textAlign: 'center',
                                opacity: hiddenLeaderboardIds?.includes(ratingHistory.leaderboardId) ? 0.5 : 1,
                                paddingHorizontal: 10,
                                paddingVertical: 8,
                                fontSize: 12,
                                color: getLeaderboardTextColor(ratingHistory.leaderboardId, theme.dark),
                            }}
                        >
                            {ratingHistory.abbreviation?.replace('🎮', '')}
                        </TextLoader>
                    </PressableOpacity>
                ))}
            </View>
            )}
        </View>
    );
}

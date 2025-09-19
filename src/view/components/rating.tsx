import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { formatDateShort, formatMonth, formatTime, formatYear, LeaderboardId } from '@nex/data';
import { getLeaderboardTextColor } from '../../helper/colors';
import { TextLoader } from './loader/text-loader';
import { useAppTheme } from '../../theming';
import { isAfter } from 'date-fns';
import { IProfileRatingsLeaderboard, IProfileResult } from '../../api/helper/api.types';
import { windowWidth } from '@app/app/statistics/leaderboard';
import { ViewLoader } from '@app/view/components/loader/view-loader';
import { useAuthProfileId } from '@app/queries/all';
import { usePrefData } from '@app/queries/prefs';
import { useSavePrefsMutation } from '@app/mutations/save-account';
import { useTranslation } from '@app/helper/translate';
import { getRatingTimespan } from '@app/utils/rating';
import { TimespanSelect } from '@app/components/select/timespan-select';
import { PlatformSelect } from '@app/components/select/platform-select';
import RatingChart from '@app/view/components/rating-chart';

interface IRatingProps {
    ratingHistories?: IProfileRatingsLeaderboard[] | null;
    profile?: IProfileResult | null;
    ready: boolean;
}

export default function Rating({ ratingHistories, profile, ready }: IRatingProps) {
    const getTranslation = useTranslation();
    ratingHistories = ready ? ratingHistories : null;

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
    const [platform, setPlatform] = useState<string>('pc');
    const [ratingHistoryDuration, setRatingHistoryDuration] = useState<string>('max');

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

        return ratingHistories?.filter(r => (!r.leaderboardId.includes('_console') && platform != 'console') || (r.leaderboardId.includes('_console') && platform == 'console'))?.map((r) => ({
            ...r,
            leaderboardId: r.leaderboardId,
            ratings: r.ratings.filter((d) => since == null || isAfter(d.date!, since)),
        }))
            ;
    }, [ratingHistories, ratingHistoryDuration, platform]);

    const hasData = filteredRatingHistories?.some((rh) => rh.ratings.length > 0);

    // console.log('Rendering Rating chart, hasData', hasData, filteredRatingHistories);

    return (
        <View style={styles.container}>
            <View style={styles.durationRow}>
                <PlatformSelect platform={platform} setPlatform={setPlatform}/>
                <TimespanSelect ratingHistoryDuration={ratingHistoryDuration} setRatingHistoryDuration={setRatingHistoryDuration}/>
            </View>

            <ViewLoader ready={hasData}>
                <View style={{ width: windowWidth - 40, height: 300 }}>
                    {
                        hasData &&
                        <RatingChart
                            formatTick={formatTick}
                            ratingHistoryDuration={ratingHistoryDuration}
                            filteredRatingHistories={filteredRatingHistories}
                            hiddenLeaderboardIds={hiddenLeaderboardIds}
                        />
                    }
                </View>
            </ViewLoader>

            <View style={styles.legend}>
                {(filteredRatingHistories || Array(2).fill(0)).map((ratingHistory, i) => (
                    <TouchableOpacity key={'legend-' + i} onPress={() => toggleLeaderboard(ratingHistory.leaderboardId)}>
                        <TextLoader
                            width={100}
                            key={'legend-' + i}
                            style={{
                                opacity: hiddenLeaderboardIds?.includes(ratingHistory.leaderboardId) ? 0.5 : 1,
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                fontSize: 12,
                                color: getLeaderboardTextColor(ratingHistory.leaderboardId, theme.dark),
                            }}
                        >
                            {ratingHistory.abbreviation?.replace('🎮', '')}
                        </TextLoader>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chart: {
        backgroundColor: 'yellow',
        width: '100%',
    },
    durationRow: {
        // backgroundColor: 'green',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    container: {
        // backgroundColor: 'green',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        marginHorizontal: -8,
        marginTop: 10,
        // backgroundColor: 'red',
    },
    legendDesc: {
        textAlign: 'center',
        fontSize: 12,
    },
});

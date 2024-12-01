import { Dropdown } from '@app/components/dropdown';
import { FlatList } from '@app/components/flat-list';
import { leaderboardIdsByType } from '@app/helper/leaderboard';
import { LeaderboardId } from '@nex/data';
import { useNavigationState, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { fetchLeaderboards } from '../../api/helper/api';
import { getTranslation } from '../../helper/translate';
import { openLink } from '../../helper/url';
import { useWebRefresh } from '../../hooks/use-web-refresh';
import { useMutate } from '../../redux/reducer';
import { appVariants } from '../../styles';
import { useTheme } from '../../theming';
import { createStylesheet } from '../../theming-new';
import FlatListLoadingIndicator from '../components/flat-list-loading-indicator';
import { TextLoader } from '../components/loader/text-loader';
import { MyText } from '../components/my-text';
import RefreshControlThemed from '../components/refresh-control-themed';
import { StatsHeader, StatsRow } from '../components/stats-rows';
import TemplatePicker from '../components/template-picker';
import { useQuery } from '@tanstack/react-query';
import { useProfileWithStats } from '@app/queries/all';

interface Props {
    profileId: number;
}

export default function MainStats({ profileId }: Props) {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);

    if (profileId == null) {
        // This happens sometimes when clicking notification
        // Routes will contain "Feed" with match_id
        // console.log('ROUTES', JSON.stringify(routes));
        return (
            <View style={styles.list}>
                <MyText>
                    If you see this screen instead of a user profile, report a bug in the{' '}
                    <MyText style={appStyles.link} onPress={() => openLink('https://discord.com/invite/gCunWKx')}>
                        discord
                    </MyText>
                    .
                </MyText>
            </View>
        );
    }

    return <MainStatsInternal profileId={profileId} />;
}

function MainStatsInternal({ profileId }: { profileId: number }) {
    const styles = useStyles();
    const mutate = useMutate();
    // const prefLeaderboardId = useSelector(state => state.prefs.leaderboardId) ?? leaderboardIdsData[0];
    // const prefLeaderboardId = leaderboardIdsData[0];
    const [leaderboardId, setLeaderboardId] = useState<string>();

    const [leaderboardType, setLeaderboardType] = useState<'pc' | 'xbox'>('pc');

    const { data: leaderboards } = useQuery({
        queryKey: ['leaderboards'],
        queryFn: fetchLeaderboards,
    });

    const renderLeaderboard = (value: string, selected: boolean) => {
        return (
            <View style={styles.col}>
                <MyText style={[styles.h1, { fontWeight: selected ? 'bold' : 'normal' }]}>
                    {leaderboards?.find((l) => l.leaderboardId === value)?.abbreviationTitle}
                </MyText>
                <MyText style={[styles.h2, { fontWeight: selected ? 'bold' : 'normal' }]}>
                    {leaderboards?.find((l) => l.leaderboardId === value)?.abbreviationSubtitle}
                </MyText>
            </View>
        );
    };

    const leaderboardTitle = leaderboards?.find((l) => l.leaderboardId === leaderboardId)?.leaderboardName;

    useEffect(() => {
        if (leaderboards == null) return;
        if (leaderboardId == null) {
            setLeaderboardId(leaderboardIdsByType(leaderboards, leaderboardType)[0]);
        }
    }, [leaderboards]);

    // const currentCachedData = useSelector((state) => get(state.user, [profileId, 'profileWithStats']))?.stats?.find(
    //     (s) => s.leaderboardId === leaderboardId
    // );
    // const previousCachedData = usePrevious(currentCachedData);

    const { data: profileWithStats, refetch, isRefetching } = useProfileWithStats(profileId);

    const cachedData = profileWithStats?.stats.find((s) => s.leaderboardId === leaderboardId); //currentCachedData ?? previousCachedData;

    const statsCiv = cachedData?.civ;
    const statsMap = cachedData?.map;
    const statsAlly = cachedData?.allies;
    const statsOpponent = cachedData?.opponents;

    const hasStats = cachedData != null;

    // const list = ['stats-header', 'stats-duration', 'stats-position', 'stats-ally', 'stats-opponent', 'stats-civ', 'stats-map'];

    const list = [
        { type: 'stats-header' as const},
        ...(statsAlly?.length !== 0 ? [{ type: 'header' as const, title: getTranslation('main.stats.heading.ally') }] : []),
        ...(statsAlly?.map((row) => ({ type: 'ally' as const, data: row })) ?? Array(8).fill({ type: 'ally' as const, data: null })),
        { type: 'header' as const, title: getTranslation('main.stats.heading.opponent') },
        ...(statsOpponent?.map((row) => ({ type: 'opponent' as const, data: row })) ?? Array(8).fill({ type: 'opponent' as const, data: null })),
        { type: 'header' as const, title: getTranslation('main.stats.heading.civ') },
        ...(statsCiv?.map((row) => ({ type: 'civ' as const, data: row })) ?? Array(8).fill({ type: 'civ' as const, data: null })),
        { type: 'header' as const, title: getTranslation('main.stats.heading.map') },
        ...(statsMap?.map((row) => ({ type: 'map' as const, data: row })) ?? Array(8).fill({ type: 'map' as const, data: null })),
    ];

    const onLeaderboardSelected = async (leaderboardId: LeaderboardId) => {
        // mutate(setPrefValue('leaderboardId', leaderboardId));
        // await savePrefsToStorage();
        setLeaderboardId(leaderboardId);
    };

    // useEffect(() => {
    //     if (currentCachedData) {
    //         setRefetching(false);
    //     }
    // }, [currentCachedData]);

    const route = useRoute();
    const state = useNavigationState((state) => state);
    const activeRoute = state.routes[state.index];
    const isActiveRoute = route?.key === activeRoute?.key;

    useWebRefresh(() => {
        if (!isActiveRoute) return;
        onRefresh();
    }, [isActiveRoute]);

    const onRefresh = async () => {
        refetch();
    };

    if (!leaderboards) {
        return <View />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {Platform.OS === 'web' && isRefetching && <FlatListLoadingIndicator />}
                <FlatList
                    contentContainerStyle="p-4"
                    data={list}
                    CellRendererComponent={({ children, index, style, ...props }) => (
                        <View style={[style, { zIndex: list.length - index }]} {...props}>
                            {children}
                        </View>
                    )}
                    renderItem={({ item, index }) => {
                        switch (item.type) {
                            case 'stats-header':
                                return (
                                    <View>
                                        <View style={styles.pickerRow}>
                                            <Dropdown
                                                textVariant="label-sm"
                                                style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 8, marginRight: 6 }}
                                                value={leaderboardType}
                                                onChange={(lType) => {
                                                    setLeaderboardType(lType);
                                                    setLeaderboardId(leaderboardIdsByType(leaderboards, lType)[0]);
                                                }}
                                                options={[
                                                    { value: 'pc', label: 'PC' },
                                                    { value: 'xbox', label: 'Xbox' },
                                                ]}
                                            />
                                            <TemplatePicker
                                                value={leaderboardId}
                                                values={leaderboards
                                                    .filter(
                                                        (leaderboard) =>
                                                            (leaderboardType === 'xbox' && leaderboard.abbreviation.includes('🎮')) ||
                                                            (leaderboardType !== 'xbox' && !leaderboard.abbreviation.includes('🎮'))
                                                    )
                                                    .map((l) => l.leaderboardId)}
                                                template={renderLeaderboard}
                                                onSelect={onLeaderboardSelected}
                                            />
                                        </View>
                                        <TextLoader ready={hasStats} style={styles.info}>
                                            {statsMap && statsMap.length === 0
                                                ? getTranslation('main.stats.nomatches') + leaderboardTitle
                                                : 'Stats for ' + leaderboardTitle}
                                        </TextLoader>
                                    </View>
                                );
                            case 'header':
                                return (
                                    <StatsHeader
                                        title={item.title}
                                    />
                                );
                            default:
                                return (
                                    <StatsRow
                                        data={item.data}
                                        type={item.type}
                                    />
                                );
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={isRefetching} />}
                />
            </View>
        </View>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        info: {
            marginBottom: 10,
            marginLeft: 5,
        },

        col: {
            paddingHorizontal: 7,
            alignItems: 'center',
        },
        h1: {},
        h2: {
            fontSize: 11,
        },

        pickerRow: {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 20,
            marginBottom: 20,
            zIndex: 100,
        },
        list: {
            padding: 20,
        },
        container: {
            flex: 1,
            // backgroundColor: '#B89579',
        },
        content: {
            flex: 1,
        },
    } as const)
);

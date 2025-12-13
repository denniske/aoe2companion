import { FlatList } from '@app/components/flat-list';
import { leaderboardIdsByType } from '@app/helper/leaderboard';
import { useIsFocused, useNavigationState, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useWebRefresh } from '../../../../../hooks/use-web-refresh';
import { createStylesheet } from '../../../../../theming-new';
import FlatListLoadingIndicator from '../../../../../view/components/flat-list-loading-indicator';
import { MyText } from '../../../../../view/components/my-text';
import RefreshControlThemed from '../../../../../view/components/refresh-control-themed';
import { StatsHeader, StatsRow } from '../../../../../view/components/stats-rows';
import { useLeaderboards, useProfileWithStats, useWithRefetching } from '@app/queries/all';
import { useLocalSearchParams } from 'expo-router';
import { LeaderboardSelect } from '@app/components/select/leaderboard-select';
import { useTranslation } from '@app/helper/translate';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export default function MainStats() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<{ profileId: string }>();
    const profileId = parseInt(params.profileId);
    const styles = useStyles();
    const {getItem: getStoredLeaderboardId, setItem: setStoredLeaderboardId} = useAsyncStorage('statsLeaderboardId')
    const [leaderboardId, setLeaderboardId] = useState<string>();

    const { data: leaderboards } = useLeaderboards();

    const leaderboardTitle = leaderboards?.find((l) => l.leaderboardId === leaderboardId)?.leaderboardName;

    useEffect(() => {
        if (leaderboards == null) return;
        if (leaderboardId == null) {
            getStoredLeaderboardId().then((id) => {
                if (id && leaderboards.some((l) => l.leaderboardId === id)) {
                    setLeaderboardId(id);
                } else {
                    setLeaderboardId(leaderboardIdsByType(leaderboards, 'pc')[0]);
                }
            });
        }
    }, [leaderboards]);

    const isFocused = useIsFocused();
    const { data: profileWithStats, refetch, isRefetching } = useWithRefetching(useProfileWithStats(profileId, isFocused));

    const cachedData = profileWithStats?.stats.find((s) => s.leaderboardId === leaderboardId);

    const statsCiv = cachedData?.civ;
    const statsMap = cachedData?.map;
    const statsAlly = cachedData?.allies;
    const statsOpponent = cachedData?.opponents;

    const statsLoaded = cachedData != null;
    const hasStats = statsCiv?.length || statsMap?.length || statsAlly?.length || statsOpponent?.length;

    const list = [
        { type: 'stats-header' as const },
        ...(statsAlly?.length !== 0 ? [{ type: 'header' as const, title: getTranslation('main.stats.heading.ally') }] : []),
        ...(statsAlly?.map((row) => ({ type: 'ally' as const, data: row })) ?? Array(8).fill({ type: 'ally' as const, data: null })),
        ...(statsOpponent?.length !== 0 ? [{ type: 'header' as const, title: getTranslation('main.stats.heading.opponent') }] : []),
        ...(statsOpponent?.map((row) => ({ type: 'opponent' as const, data: row })) ?? Array(8).fill({ type: 'opponent' as const, data: null })),
        ...(statsCiv?.length !== 0 ? [{ type: 'header' as const, title: getTranslation('main.stats.heading.civ') }] : []),
        ...(statsCiv?.map((row) => ({ type: 'civ' as const, data: row })) ?? Array(8).fill({ type: 'civ' as const, data: null })),
        ...(statsMap?.length !== 0 ? [{ type: 'header' as const, title: getTranslation('main.stats.heading.map') }] : []),
        ...(statsMap?.map((row) => ({ type: 'map' as const, data: row })) ?? Array(8).fill({ type: 'map' as const, data: null })),
    ];

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

    if (profileWithStats?.sharedHistory === false) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <MyText style={styles.header}>{getTranslation('main.matches.sharedhistory.disabled')}</MyText>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {Platform.OS === 'web' && isRefetching && <FlatListLoadingIndicator />}
                <FlatList
                    initialNumToRender={10}
                    contentContainerClassName="p-4"
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
                                            <LeaderboardSelect
                                                leaderboardId={leaderboardId}
                                                onLeaderboardIdChange={(id) => {
                                                    if (id) {
                                                        setStoredLeaderboardId(id);
                                                    }

                                                    setLeaderboardId(id ?? undefined);}
                                                }
                                            />
                                        </View>
                                        {
                                            statsLoaded && !hasStats &&
                                            <MyText style={styles.info}>
                                                {getTranslation('main.stats.nomatches')}
                                            </MyText>
                                        }
                                    </View>
                                );
                            case 'header':
                                return <StatsHeader title={item.title} />;
                            default:
                                return <StatsRow data={item.data} type={item.type} />;
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
        header: {
            textAlign: 'center',
            padding: 20,
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

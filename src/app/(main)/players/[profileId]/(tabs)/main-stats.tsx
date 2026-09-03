import { FlatList } from '@app/components/flat-list';
import { leaderboardIdsByType } from '@app/helper/leaderboard';
import { useIsFocused, useNavigationState, useRoute } from "expo-router/react-navigation";
import React, { useEffect, useRef, useState } from 'react';
import { FlatList as RNFlatList, Platform, StyleSheet, View } from 'react-native';
import { useLeaderboards, useProfileWithStats, useWithRefetching } from '@app/queries/all';
import { useLocalSearchParams } from 'expo-router';
import { LeaderboardSelect } from '@app/components/select/leaderboard-select';
import { useTranslation } from '@app/helper/translate';
import { useWebRefresh } from '@app/hooks/use-web-refresh';
import { MyText } from '@app/view/components/my-text';
import FlatListLoadingIndicator from '@app/view/components/flat-list-loading-indicator';
import { StatsHeader, StatsRow } from '@app/view/components/stats-rows';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { createStylesheet } from '@app/theming-new';
import Rating from '@app/view/components/rating';

export default function MainStats() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<{ profileId: string; leaderboardId?: string; scrollTo?: 'civ' | 'map' }>();
    const profileId = parseInt(params.profileId);
    const styles = useStyles();
    // Arriving from a leaderboard card preselects that leaderboard; opened on its
    // own the screen falls back to the first pc leaderboard as before.
    const [leaderboardId, setLeaderboardId] = useState<string | undefined>(params.leaderboardId);

    const { data: leaderboards } = useLeaderboards();

    const leaderboardTitle = leaderboards?.find((l) => l.leaderboardId === leaderboardId)?.leaderboardName;

    useEffect(() => {
        if (leaderboards == null) return;
        if (leaderboardId == null) {
            setLeaderboardId(leaderboardIdsByType(leaderboards, 'pc')[0]);
        }
    }, [leaderboards]);

    const isFocused = useIsFocused();
    const { data: profileWithStats, refetch, isRefetching } = useWithRefetching(useProfileWithStats(profileId, isFocused));

    const cachedData = profileWithStats?.stats.find((s) => s.leaderboardId === leaderboardId);

    // The chart component takes a list of histories, so showing one leaderboard is
    // a matter of handing it just that one.
    const ratingHistories = profileWithStats?.ratings?.filter((r) => r.leaderboardId === leaderboardId);

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

    // Arriving from a favourite civ/map on a card: jump to that section once the rows
    // exist. The list is a flat array, so the target is the index of its header.
    const listRef = useRef<RNFlatList<any>>(null);
    const [hasScrolledToSection, setHasScrolledToSection] = useState(false);
    const sectionIndex = params.scrollTo
        ? list.findIndex(
              (item) =>
                  item.type === 'header' &&
                  item.title === getTranslation(params.scrollTo === 'civ' ? 'main.stats.heading.civ' : 'main.stats.heading.map')
          )
        : -1;

    useEffect(() => {
        if (hasScrolledToSection || !statsLoaded || sectionIndex < 0) return;
        setHasScrolledToSection(true);
        listRef.current?.scrollToIndex({ index: sectionIndex, animated: true, viewPosition: 0 });
    }, [hasScrolledToSection, statsLoaded, sectionIndex]);

    const route = useRoute();
    const state = useNavigationState((state) => state);
    const activeRoute = state.routes[state.index];
    const isActiveRoute = route?.key === activeRoute?.key;

    const onRefresh = async () => {
        refetch();
    };

    useWebRefresh(() => {
        if (!isActiveRoute) return;
        onRefresh();
    }, [isActiveRoute]);

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
        <View className="flex-1">
            {Platform.OS === 'web' && isRefetching && <FlatListLoadingIndicator />}
            <FlatList
                ref={listRef}
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
                                            onLeaderboardIdChange={(x) => setLeaderboardId(x ?? undefined)}
                                        />
                                    </View>
                                    {!!ratingHistories?.length && (
                                        <View className="mb-6">
                                            <Rating ratingHistories={ratingHistories} profile={profileWithStats} ready={profileWithStats != null} />
                                        </View>
                                    )}
                                    {statsLoaded && !hasStats && <MyText style={styles.info}>{getTranslation('main.stats.nomatches')}</MyText>}
                                </View>
                            );
                        case 'header':
                            return <StatsHeader title={item.title} />;
                        default:
                            return <StatsRow data={item.data} type={item.type} />;
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                onScrollToIndexFailed={({ index, averageItemLength }) => {
                    // Rows this far down are not measured yet, so the estimate below lands
                    // roughly a section short. Jump there anyway to force them to render,
                    // then ask again a few times as the measurements come in.
                    listRef.current?.scrollToOffset({ offset: index * averageItemLength, animated: false });
                    for (const delay of [150, 400, 900]) {
                        setTimeout(() => listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 }), delay);
                    }
                }}
                refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={isRefetching} />}
            />
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

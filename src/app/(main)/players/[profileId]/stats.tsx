import { FlatList } from '@app/components/flat-list';
import { leaderboardIdsByType } from '@app/helper/leaderboard';
import { useIsFocused, useNavigationState, useRoute } from "expo-router/react-navigation";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList as RNFlatList, LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native';
import { useLeaderboards, useProfileFast, useProfileRatings, useProfileStatsAll, useWithRefetching } from '@app/queries/all';
import { IStatsDuration } from '@app/api/helper/api.types';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { HeaderTitle } from '@app/components/header-title';
import { LeaderboardSelect } from '@app/components/select/leaderboard-select';
import { useTranslation } from '@app/helper/translate';
import { useWebRefresh } from '@app/hooks/use-web-refresh';
import { MyText } from '@app/view/components/my-text';
import FlatListLoadingIndicator from '@app/view/components/flat-list-loading-indicator';
import { StatsHeader, StatsRow } from '@app/view/components/stats-rows';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { createStylesheet } from '@app/theming-new';
import Rating from '@app/view/components/rating';
import { TimespanSelect } from '@app/components/select/timespan-select';

export default function MainStats() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<{ profileId: string; leaderboardId?: string; scrollTo?: 'civ' | 'map' }>();
    const profileId = parseInt(params.profileId);
    const styles = useStyles();
    const { data: leaderboards } = useLeaderboards();

    // Read from the route rather than copied into state: the tab stays mounted, so state
    // seeded from the first card tapped kept that leaderboard when a later card navigated
    // here. Opened on its own the screen falls back to the first pc leaderboard, and only
    // once that is known, so it does not fetch a placeholder leaderboard first.
    const leaderboardId = params.leaderboardId ?? (leaderboards ? leaderboardIdsByType(leaderboards, 'pc')[0] : undefined);
    // The select reports its value back on render, so only a real change may touch the
    // route -- setParams, unlike a state setter, re-renders even for the same value.
    const setLeaderboardId = (id: string | undefined) => {
        if (id && id !== leaderboardId) router.setParams({ leaderboardId: id });
    };

    const leaderboardTitle = leaderboards?.find((l) => l.leaderboardId === leaderboardId)?.leaderboardName;

    // Owned here so the selector can sit beside the leaderboard one. It drives both the
    // chart and the stats: stats/all returns every timespan, so switching is local.
    const [ratingHistoryDuration, setRatingHistoryDuration] = useState<string>('max');

    const isFocused = useIsFocused();
    const { data: profile } = useProfileFast(profileId, isFocused);
    const ratingsQuery = useWithRefetching(useProfileRatings(profileId, leaderboardId, isFocused));
    const statsQuery = useWithRefetching(useProfileStatsAll(profileId, leaderboardId, isFocused));
    const isRefetching = ratingsQuery.isRefetching || statsQuery.isRefetching;
    const refetch = () => Promise.all([ratingsQuery.refetch(), statsQuery.refetch()]);

    const statsDurations = statsQuery.data;
    const cachedData = (statsDurations?.[ratingHistoryDuration as IStatsDuration] ?? statsDurations?.max)?.[0];

    const ratingHistories = ratingsQuery.data;

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
    useEffect(() => setHasScrolledToSection(false), [params.leaderboardId, params.scrollTo]);

    // getItemLayout has to answer synchronously, but none of these heights are
    // constants in the styles -- so measure one of each shape as it renders and
    // feed those back. The defaults only apply for the first frame.
    const [itemHeights, setItemHeights] = useState({ statsHeader: 420, header: 44, row: 36 });
    const measure = (key: 'statsHeader' | 'header' | 'row') => (e: LayoutChangeEvent) => {
        const height = e.nativeEvent.layout.height;
        if (!height) return;
        setItemHeights((current) => (Math.abs(current[key] - height) < 1 ? current : { ...current, [key]: height }));
    };

    const heightOf = (item: (typeof list)[number]) =>
        item.type === 'stats-header' ? itemHeights.statsHeader : item.type === 'header' ? itemHeights.header : itemHeights.row;

    const itemOffsets = useMemo(() => {
        let offset = 0;
        return list.map((item) => {
            const start = offset;
            offset += heightOf(item);
            return start;
        });
    }, [list, itemHeights]);
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

    if (profile?.sharedHistory === false) {
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
            <Stack.Screen
                options={{
                    title: leaderboardTitle ?? getTranslation('main.heading.stats'),
                    headerTitle: () => (
                        <HeaderTitle
                            title={leaderboardTitle ?? getTranslation('main.heading.stats')}
                            subtitle={profile?.name ?? ''}
                        />
                    ),
                }}
            />
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
                                <View onLayout={measure('statsHeader')}>
                                    <View style={styles.pickerRow} className="justify-between gap-4">
                                        <LeaderboardSelect
                                            leaderboardId={leaderboardId}
                                            onLeaderboardIdChange={(x) => setLeaderboardId(x ?? undefined)}
                                            applySavedLeaderboard={!params.leaderboardId}
                                        />
                                        <TimespanSelect
                                            ratingHistoryDuration={ratingHistoryDuration}
                                            setRatingHistoryDuration={setRatingHistoryDuration}
                                        />
                                    </View>
                                    {!!ratingHistories?.length && (
                                        <View className="mb-6">
                                            <Rating
                                                ratingHistories={ratingHistories}
                                                profile={profile}
                                                ready={ratingHistories != null}
                                                ratingHistoryDuration={ratingHistoryDuration}
                                            />
                                        </View>
                                    )}
                                    {statsLoaded && !hasStats && <MyText style={styles.info}>{getTranslation('main.stats.nomatches')}</MyText>}
                                </View>
                            );
                        case 'header':
                            return (
                                <View onLayout={measure('header')}>
                                    <StatsHeader title={item.title} />
                                </View>
                            );
                        default:
                            return (
                                <View onLayout={measure('row')}>
                                    <StatsRow data={item.data} type={item.type} />
                                </View>
                            );
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
                onScrollToIndexFailed={({ index, averageItemLength }) => {
                    // Rows this far down are not measured yet, so the estimate below lands
                    // roughly a section short. Jump there anyway to force them to render,
                    // then ask again a few times as the measurements come in.
                    listRef.current?.scrollToOffset({ offset: index * averageItemLength, animated: false });
                    for (const delay of [150, 400, 900]) {
                        setTimeout(() => listRef.current?.scrollToIndex({ index, animated: false, viewPosition: 0 }), delay);
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

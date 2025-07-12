import { Dropdown } from '@app/components/dropdown';
import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { Match } from '@app/components/match/match';
import { leaderboardIdsByType } from '@app/helper/leaderboard';
import { useNavigationState, useRoute } from '@react-navigation/native';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { flatten } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { fetchLeaderboards, fetchMatches } from '../../../../../api/helper/api';
import { openLink } from '../../../../../helper/url';
import useDebounce from '../../../../../hooks/use-debounce';
import { useWebRefresh } from '../../../../../hooks/use-web-refresh';
import { useSelector } from '../../../../../redux/reducer';
import { appVariants } from '../../../../../styles';
import { useTheme } from '../../../../../theming';
import { createStylesheet } from '../../../../../theming-new';
import FlatListLoadingIndicator from '../../../../../view/components/flat-list-loading-indicator';
import { MyText } from '../../../../../view/components/my-text';
import RefreshControlThemed from '../../../../../view/components/refresh-control-themed';
import TemplatePicker from '../../../../../view/components/template-picker';
import { useAuthProfileId, useProfile } from '@app/queries/all';
import { useLocalSearchParams } from 'expo-router';
import { Checkbox as CheckboxNew } from '@app/components/checkbox';
import { LeaderboardsSelect } from '@app/components/select/leaderboards-select';
import { useTranslation } from '@app/helper/translate';

export default function MainMatches() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<{ profileId: string }>();
    const profileId = parseInt(params.profileId);
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    const [text, setText] = useState('');
    const [leaderboardIds, setLeaderboardIds] = useState<string[]>([]);
    const [withMe, setWithMe] = useState(false);
    const [reloading, setReloading] = useState(false);
    const authProfileId = useAuthProfileId();

    const realText = text.trim().length < 3 ? '' : text.trim();
    const debouncedSearch = useDebounce(realText, 600);

    const { data: profile } = useProfile(profileId);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } = useInfiniteQuery({
        queryKey: ['matches', profileId, withMe, debouncedSearch, leaderboardIds],
        queryFn: (context) =>
            fetchMatches({
                ...context,
                profileIds: [profileId],
                withProfileIds: withMe ? [authProfileId!] : [],
                search: debouncedSearch,
                leaderboardIds: leaderboardIds,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => (lastPage.matches.length === lastPage.perPage ? lastPage.page + 1 : null),
        placeholderData: keepPreviousData,
    });

    // console.log('data', data);

    const toggleWithMe = () => setWithMe(!withMe);

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

    //     if (text.trim().length > 0) {
    //         const parts = text.toLowerCase().split(' ');
    //         filtered = filtered.filter(m => {
    //             return parts.every(part => {
    //                 return m.name.toLowerCase().indexOf(part) >= 0 ||
    //                     (getMapName(m.map_type, m.ugc, m.rms, m.game_type, m.scenario) || '').toLowerCase().indexOf(part) >= 0 ||
    //                     m.players.some(p => p.name?.toLowerCase().indexOf(part) >= 0) ||
    //                     m.players.some(p => p.civ != null && getCivName(p.civ) && getCivName(p.civ)!.toLowerCase()?.indexOf(part) >= 0);
    //             });
    //         });
    //     }
    //     if (withMe && auth) {
    //         filtered = filtered.filter(m => m.players.some(p => sameUser(p, auth)));
    //     }

    const list = flatten(data?.pages?.map((p) => p.matches) || Array(15).fill(null));
    // const list = [...(filteredMatches ? ['header'] : []), ...(filteredMatches || Array(15).fill(null))];

    const route = useRoute();
    const state = useNavigationState((state) => state);
    const activeRoute = state.routes[state.index];
    const isActiveRoute = route?.key === activeRoute?.key;

    useWebRefresh(() => {
        if (!isActiveRoute) return;
        onRefresh();
    }, [isActiveRoute]);

    const onRefresh = async () => {
        setReloading(true);
        await refetch();
        setReloading(false);
    };

    if (!leaderboards) {
        return <View />;
    }

    const onEndReached = async () => {
        if (!hasNextPage || isFetchingNextPage) return;
        fetchNextPage();
    };

    const _renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return <FlatListLoadingIndicator />;
    };

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
        <View style={styles.container}>
            <View style={styles.content}>
                {/*<Button onPress={onRefresh}>REFRESH</Button>*/}
                <View style={styles.pickerRow}>
                    <LeaderboardsSelect
                        leaderboardIdList={leaderboardIds}
                        onLeaderboardIdChange={setLeaderboardIds}
                    />
                    <View style={appStyles.expanded} />
                    {authProfileId && profileId !== authProfileId && (
                        <View style={styles.row2}>
                            <CheckboxNew checked={withMe} onPress={toggleWithMe} text={getTranslation('main.matches.withme')} />
                        </View>
                    )}
                </View>
                <View className="px-4">
                    <Field
                        type="search"
                        placeholder={getTranslation('main.matches.search.placeholder')}
                        onChangeText={(text) => setText(text)}
                        value={text}
                    />
                </View>
                {Platform.OS === 'web' && reloading && <FlatListLoadingIndicator />}
                <View style={{ flex: 1, opacity: isRefetching ? 0.7 : 1 }}>
                    {list.length === 0 && <MyText style={styles.header}>{getTranslation('main.matches.nomatches')}</MyText>}
                    <FlatList
                        contentContainerStyle="p-4 gap-2"
                        initialNumToRender={10}
                        windowSize={2}
                        data={list}
                        renderItem={({ item, index }) => {
                            switch (item) {
                                // case 'header':
                                //     return <MyText style={styles.header}>{getTranslation('main.matches.matches', { matches: filteredMatches?.length })}</MyText>
                                default:
                                    return (
                                        <Match match={item as any} expanded={false} highlightedUsers={[Number(profileId)]} user={Number(profileId)} />
                                    );
                            }
                        }}
                        ListFooterComponent={_renderFooter}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.1}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={reloading} />}
                    />
                </View>
            </View>
        </View>
    );
}

const useStyles = createStylesheet((theme, mode) =>
    StyleSheet.create({
        searchbar: {
            borderRadius: 0,
            paddingHorizontal: 10,
        },
        header: {
            textAlign: 'center',
            padding: 20,
        },

        info: {
            marginBottom: 10,
            marginLeft: 5,
        },

        row: {
            flexDirection: 'row',
            paddingHorizontal: 7,
            alignItems: 'center',
        },
        row2: {
            flexDirection: 'row',
            alignItems: 'center',
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
            zIndex: 100,
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 16,
            paddingRight: 16,
            marginBottom: 20,
            marginTop: 20,
            flexWrap: 'wrap',
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

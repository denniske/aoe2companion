import { Dropdown } from '@app/components/dropdown';
import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { Match } from '@app/components/match';
import { leaderboardIdsByType } from '@app/helper/leaderboard';
import { useNavigationState, useRoute } from '@react-navigation/native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { flatten } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

import { fetchLeaderboards, fetchMatches } from '../../api/helper/api';
import { getTranslation } from '../../helper/translate';
import { openLink } from '../../helper/url';
import { useApi } from '../../hooks/use-api';
import useDebounce from '../../hooks/use-debounce';
import { useWebRefresh } from '../../hooks/use-web-refresh';
import { useSelector } from '../../redux/reducer';
import { appVariants } from '../../styles';
import { useTheme } from '../../theming';
import { createStylesheet } from '../../theming-new';
import FlatListLoadingIndicator from '../components/flat-list-loading-indicator';
import { MyText } from '../components/my-text';
import RefreshControlThemed from '../components/refresh-control-themed';
import TemplatePicker from '../components/template-picker';

interface Props {
    profileId: number;
}

export default function MainMatches({ profileId }: Props) {
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

    return <MainMatchesInternal profileId={profileId} />;
}

function MainMatchesInternal({ profileId }: { profileId: number }) {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    const [text, setText] = useState('');
    const [leaderboardIds, setLeaderboardIds] = useState<string[]>([]);
    const [withMe, setWithMe] = useState(false);
    const [reloading, setReloading] = useState(false);
    const auth = useSelector((state) => state.auth);
    const [platform, setPlatform] = useState<'pc' | 'xbox'>('pc');

    const realText = text.trim().length < 3 ? '' : text.trim();
    const debouncedSearch = useDebounce(realText, 600);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } = useInfiniteQuery(
        ['matches', profileId, withMe, debouncedSearch, leaderboardIds, platform],
        (context) => {
            return fetchMatches({
                ...context,
                profileIds: [context.queryKey[1] as number],
                withProfileIds: (context.queryKey[2] as boolean) ? [auth?.profileId ?? 0] : [],
                search: context.queryKey[3] as string,
                leaderboardIds: context.queryKey[4] as unknown as number[],
                platform: context.queryKey[5] === 'pc' ? 'pc' : 'console',
            });
        },
        {
            getNextPageParam: (lastPage, pages) => (lastPage.matches.length === lastPage.perPage ? lastPage.page + 1 : null),
            keepPreviousData: true,
            enabled: leaderboardIds.length > 0,
        }
    );

    // console.log('data', data);

    const toggleWithMe = () => setWithMe(!withMe);

    const onLeaderboardSelected = async (selLeaderboardId: string) => {
        if (leaderboardIds.length === 1 && leaderboardIds[0] === selLeaderboardId) {
            setLeaderboardIds([]);
        } else {
            setLeaderboardIds([selLeaderboardId]);
        }
    };
    const leaderboards = useApi(
        {},
        [],
        (state) => state.leaderboards,
        (state, value) => {
            state.leaderboards = value;
        },
        fetchLeaderboards
    );


    const renderLeaderboard = (value: string, selected: boolean) => {
        return (
            <View style={styles.col}>
                <MyText style={[styles.h1, { fontWeight: selected ? 'bold' : 'normal' }]}>
                    {leaderboards.data.find((l) => l.leaderboardId === value)?.abbreviationTitle}
                </MyText>
                <MyText style={[styles.h2, { fontWeight: selected ? 'bold' : 'normal' }]}>
                    {leaderboards.data.find((l) => l.leaderboardId === value)?.abbreviationSubtitle}
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

    if (!leaderboards.data) {
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

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/*<Button onPress={onRefresh}>REFRESH</Button>*/}
                <View style={styles.pickerRow}>
                    <Dropdown
                        textVariant="label-sm"
                        style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 8, marginRight: 6 }}
                        value={platform}
                        onChange={(lType) => {
                            setPlatform(lType);
                            setLeaderboardIds([]);
                        }}
                        options={[
                            { value: 'pc', label: 'PC' },
                            { value: 'xbox', label: 'Xbox' },
                        ]}
                    />
                    <TemplatePicker
                        value={leaderboardIds.length > 1 ? undefined : leaderboardIds[0]}
                        values={leaderboardIdsByType(leaderboards.data, platform)}
                        template={renderLeaderboard}
                        onSelect={onLeaderboardSelected}
                    />
                    <View style={appStyles.expanded} />
                    {auth && profileId !== auth?.profileId && (
                        <View style={styles.row2}>
                            <Checkbox.Android status={withMe ? 'checked' : 'unchecked'} onPress={toggleWithMe} />
                            <TouchableOpacity onPress={toggleWithMe}>
                                <MyText>{getTranslation('main.matches.withme')}</MyText>
                            </TouchableOpacity>
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
    })
);

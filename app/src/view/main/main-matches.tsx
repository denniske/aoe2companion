import {useTheme} from "../../theming";
import {FlatList, Platform, StyleSheet, View} from "react-native";
import React, {useEffect, useState} from "react";
import {RouteProp, useNavigation, useNavigationState, useRoute} from "@react-navigation/native";
import {Game} from "../components/game";
import RefreshControlThemed from "../components/refresh-control-themed";
import {useSelector} from "../../redux/reducer";
import {Searchbar} from "react-native-paper";
import {MyText} from "../components/my-text";
import {appVariants} from "../../styles";
import TemplatePicker from "../components/template-picker";
import {flatten} from 'lodash';
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {openLink} from "../../helper/url";
import {useWebRefresh} from "../../hooks/use-web-refresh";
import FlatListLoadingIndicator from "../components/flat-list-loading-indicator";
import Constants from 'expo-constants';
import {RootStackParamList} from "../../../App2";
import {useApi} from "../../hooks/use-api";
import {fetchLeaderboards} from "../../api/leaderboard";
import {useInfiniteQuery} from "@tanstack/react-query";
import useDebounce from "../../hooks/use-debounce";
import {fetchMatches} from "../../api/helper/api";


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
                    If you see this screen instead of a user profile, report a bug in the <MyText style={appStyles.link} onPress={() => openLink('https://discord.com/invite/gCunWKx')}>discord</MyText>.
                </MyText>
            </View>
        );
    }

    return <MainMatchesInternal profileId={profileId}/>;
}

function MainMatchesInternal({profileId}: {profileId: number}) {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    const [text, setText] = useState('');
    const [leaderboardId, setLeaderboardId] = useState<string>();
    const [withMe, setWithMe] = useState(false);
    const [reloading, setReloading] = useState(false);

    const navigation = useNavigation();
    const userProfile = useSelector(state => state.user[profileId]?.profile);
    useEffect(() => {
        if (!userProfile) return;
        navigation.setOptions({
            title: userProfile?.name + ' - ' + (Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name),
        });
    }, [userProfile]);

    const realText = text.trim().length < 3 ? '' : text.trim();
    const debouncedSearch = useDebounce(realText, 600);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching,
    } = useInfiniteQuery(
        ['matches', profileId, debouncedSearch, leaderboardId],
        (context) => {
            return fetchMatches({
                ...context,
                profileIds: [context.queryKey[1] as number],
                search: context.queryKey[2] as string,
                leaderboardIds: [context.queryKey[3] as number],
            });
        }, {
            getNextPageParam: (lastPage, pages) => lastPage.matches.length === lastPage.perPage ? lastPage.page + 1 : null,
            keepPreviousData: true,
        });

    // console.log('data', data);

    const toggleWithMe = () => setWithMe(!withMe);

    const onLeaderboardSelected = async (selLeaderboardId: string) => {
        if (leaderboardId === selLeaderboardId) {
            setLeaderboardId(undefined);
        } else {
            setLeaderboardId(selLeaderboardId);
        }
    };
    const leaderboards = useApi(
        {},
        [],
        state => state.leaderboards,
        (state, value) => {
            state.leaderboards = value;
        },
        fetchLeaderboards
    );

    const renderLeaderboard = (value: string, selected: boolean) => {
        return <View style={styles.col}>
            <MyText style={[styles.h1, { fontWeight: selected ? 'bold' : 'normal'}]}>{leaderboards.data.find(l => l.leaderboardId === value)?.abbreviationTitle}</MyText>
            <MyText style={[styles.h2, { fontWeight: selected ? 'bold' : 'normal'}]}>{leaderboards.data.find(l => l.leaderboardId === value)?.abbreviationSubtitle}</MyText>
        </View>;
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

    const list = flatten(data?.pages?.map(p => p.matches) || Array(15).fill(null));
    // const list = [...(filteredMatches ? ['header'] : []), ...(filteredMatches || Array(15).fill(null))];

    const route = useRoute();
    const state = useNavigationState(state => state);
    const activeRoute = state.routes[state.index] as RouteProp<RootStackParamList, 'Main'>;
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

    if (!leaderboards.data){
        return <View></View>;
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
                    <TemplatePicker value={leaderboardId} values={leaderboards.data.map(l => l.leaderboardId)} template={renderLeaderboard} onSelect={onLeaderboardSelected}/>
                    <View style={appStyles.expanded}/>
                    {/*{*/}
                    {/*    auth && profileId !== auth?.profileId &&*/}
                    {/*    <View style={styles.row}>*/}
                    {/*        <Checkbox.Android*/}
                    {/*            status={withMe ? 'checked' : 'unchecked'}*/}
                    {/*            onPress={toggleWithMe}*/}
                    {/*        />*/}
                    {/*        <TouchableOpacity onPress={toggleWithMe}>*/}
                    {/*            <MyText>{getTranslation('main.matches.withme')}</MyText>*/}
                    {/*        </TouchableOpacity>*/}
                    {/*    </View>*/}
                    {/*}*/}
                </View>
                <Searchbar
                    textAlign="left"
                    style={styles.searchbar}
                    placeholder={getTranslation('main.matches.search.placeholder')}
                    onChangeText={text => setText(text)}
                    value={text}
                />
                {
                    Platform.OS === 'web' && reloading &&
                    <FlatListLoadingIndicator/>
                }
                <View style={{flex: 1, opacity: isRefetching ? 0.7 : 1}}>
                    {
                        list.length === 0 &&
                        <MyText style={styles.header}>{getTranslation('main.matches.nomatches')}</MyText>
                    }
                    <FlatList
                        contentContainerStyle={styles.list}
                        initialNumToRender={10}
                        windowSize={2}
                        data={list}
                        renderItem={({item, index}) => {
                            switch (item) {
                                // case 'header':
                                //     return <MyText style={styles.header}>{getTranslation('main.matches.matches', { matches: filteredMatches?.length })}</MyText>
                                default:
                                    return <Game match={item as any} expanded={index === -1} highlightedUsers={[profileId]} user={profileId}/>;
                            }
                        }}
                        ListFooterComponent={_renderFooter}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.1}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControlThemed
                                onRefresh={onRefresh}
                                refreshing={reloading}
                            />
                        }
                    />
                </View>
            </View>
        </View>
    );
}


const useStyles = createStylesheet((theme, mode) => StyleSheet.create({
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
    col: {
        paddingHorizontal: 7,
        alignItems: 'center',
    },
    h1: {

    },
    h2: {
        fontSize: 11,
    },
    pickerRow: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20,
        marginTop: 20,
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
}));

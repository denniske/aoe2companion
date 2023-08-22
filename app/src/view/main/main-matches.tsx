import {useTheme} from "../../theming";
import {FlatList, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {RouteProp, useNavigation, useNavigationState, useRoute} from "@react-navigation/native";
import {Game} from "../components/game";
import RefreshControlThemed from "../components/refresh-control-themed";
import {clearMatchesPlayer, useMutate, useSelector} from "../../redux/reducer";
import {Button, Checkbox, Searchbar} from "react-native-paper";
import {MyText} from "../components/my-text";
import {appVariants} from "../../styles";
import {fetchPlayerMatches, LeaderboardId} from "@nex/data";
import TemplatePicker from "../components/template-picker";
import {get, set} from 'lodash';
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {openLink} from "../../helper/url";
import {useWebRefresh} from "../../hooks/use-web-refresh";
import FlatListLoadingIndicator from "../components/flat-list-loading-indicator";
import {leaderboardIdsData, leaderboardMappingData} from "@nex/dataset";
import Constants from 'expo-constants';
import {RootStackParamList} from "../../../App2";
import {useCachedConservedLazyApi} from "../../hooks/use-cached-conserved-lazy-api";
import {usePrevious} from "@nex/data/hooks";
import {useApi} from "../../hooks/use-api";
import {fetchLeaderboards} from "../../api/leaderboard";


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
    const previousText = usePrevious(text);
    const mutate = useMutate();
    const [leaderboardId, setLeaderboardId] = useState<string>();
    const previousLeaderboardId = usePrevious(leaderboardId);
    // const [filteredMatches, setFilteredMatches] = useState<IMatchNew[]>();
    const [withMe, setWithMe] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [fetchedAll, setFetchedAll] = useState(false);
    const [fetching, setFetching] = useState(false);

    const navigation = useNavigation();
    const userProfile = useSelector(state => state.user[profileId]?.profile);
    useEffect(() => {
        if (!userProfile) return;
        navigation.setOptions({
            title: userProfile?.name + ' - ' + (Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name),
        });
    }, [userProfile]);

    const auth = useSelector(state => state.auth);

    // const matches = useSelector(state => get(state.user, [profileId, 'matches']));

    // console.log('===> user', user);

    let matchesHandle = useCachedConservedLazyApi(
        [leaderboardId],
        () => true,
        state => get(state, ['user', profileId, 'matches']),
        (state, value) => set(state, ['user', profileId, 'matches'], value),
        fetchPlayerMatches, 0, 500, [profileId], (leaderboardId == null ? undefined : [leaderboardId]), text
    );
    const matches = matchesHandle.data;
    const filteredMatches = matches;


    const refresh = () => {
        if (previousText?.trim() === text.trim() && previousLeaderboardId === leaderboardId) {
            return;
        }
        if (text.length < 3) {
            matchesHandle.refetch(0, 500, [profileId], (leaderboardId == null ? undefined : [leaderboardId]), '');
            return;
        }
        matchesHandle.refetch(0, 500, [profileId], (leaderboardId == null ? undefined : [leaderboardId]), text.trim());
        // setFetchedAll(false);
    };

    useEffect(() => {
        refresh();
    }, [leaderboardId]);

    useEffect(() => {
        refresh();
    }, [text]);

    const toggleWithMe = () => setWithMe(!withMe);

    const onLeaderboardSelected = async (selLeaderboardId: string) => {
        console.log('==>', leaderboardId, selLeaderboardId);
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

    // useEffect(() => {
    //     if (matches == null) return;
    //
    //     let filtered = matches;
    //
    //     if (leaderboardId != null) {
    //         filtered = filtered.filter(m => m.leaderboardId == leaderboardId);
    //     }
    //
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
    //
    //     if (withMe && auth) {
    //         filtered = filtered.filter(m => m.players.some(p => sameUser(p, auth)));
    //     }
    //
    //     setFilteredMatches(filtered);
    // }, [text, leaderboardId, withMe, matches]);

    // console.log('matches', matches);

    const list = [...(filteredMatches ? ['header'] : []), ...(filteredMatches || Array(15).fill(null))];

    const [refetching, setRefetching] = useState(false);

    useEffect(() => {
        if (matches) {
            setRefetching(false);
        }
    }, [matches])

    const route = useRoute();
    const state = useNavigationState(state => state);
    const activeRoute = state.routes[state.index] as RouteProp<RootStackParamList, 'Main'>;
    const isActiveRoute = route?.key === activeRoute?.key;

    useWebRefresh(() => {
        if (!isActiveRoute) return;
        onRefresh();
    }, [isActiveRoute]);

    const onRefresh = async () => {
        setRefetching(true);
        await mutate(clearMatchesPlayer(profileId));
        await matchesHandle.refetch(0, 500, [profileId], text.trim().length >= 3 ? text.trim() : '');
        setRefetching(false);
    };

    if (!leaderboards.data){
        return <View></View>;
    }

    const onEndReached = async () => {
        if (fetchingMore || !matchesHandle.data) return;
        setFetchingMore(true);
        // console.log("FEEDLIST", 'onEndReached');
        const matchesLength = matchesHandle.data?.length ?? 0;
        const newMatchesData = await matchesHandle.refetch(0, (matchesHandle.data?.length ?? 0) + 15, following.map(f => f.profileId));
        if (matchesLength === newMatchesData?.length) {
            setFetchedAll(true);
        }
        setFetchingMore(false);
    };

    const _renderFooter = () => {
        if (!fetchingMore) return null;
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
                    Platform.OS === 'web' && refetching &&
                    <FlatListLoadingIndicator/>
                }
                <FlatList
                    contentContainerStyle={styles.list}
                    initialNumToRender={10}
                    windowSize={2}
                    data={list}
                    renderItem={({item, index}) => {
                        switch (item) {
                            case 'header':
                                return <MyText style={styles.header}>{getTranslation('main.matches.matches', { matches: filteredMatches?.length })}</MyText>
                            default:
                                return <Game match={item as any} expanded={index === -1} highlightedUsers={[profileId]} user={profileId}/>;
                        }
                    }}
                    ListFooterComponent={_renderFooter}
                    onEndReached={fetchedAll ? null : onEndReached}
                    onEndReachedThreshold={0.1}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControlThemed
                            onRefresh={onRefresh}
                            refreshing={refetching}
                        />
                    }
                />
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
        marginBottom: 15,
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
        // justifyContent: 'center',
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

import {FlatList, Platform, StyleSheet, View} from "react-native";
import {
    clearMatchesPlayer,
    clearStatsPlayer,
    setLoadingMatchesOrStats,
    setPrefValue,
    useMutate,
    useSelector
} from "../../redux/reducer";
import {LeaderboardId} from "@nex/data";
import React, {useEffect, useState} from "react";
import {RouteProp, useNavigation, useNavigationState, useRoute} from "@react-navigation/native";
import {get} from 'lodash';
import {usePrevious} from "@nex/data/hooks";
import {saveCurrentPrefsToStorage} from "../../service/storage";
import {MyText} from "../components/my-text";
import StatsCiv from "../components/stats-civ";
import TemplatePicker from "../components/template-picker";
import RefreshControlThemed from "../components/refresh-control-themed";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {useNavigationStateExternal} from '../../hooks/use-navigation-state-external';
import {getPathToRoute, getRoutesFromCurrentActiveStack} from '../../service/navigation';
import {useTheme} from '../../theming';
import {appVariants} from '../../styles';
import {openLink} from "../../helper/url";
import FlatListLoadingIndicator from "../components/flat-list-loading-indicator";
import {useWebRefresh} from "../../hooks/use-web-refresh";
import {leaderboardIdsData, leaderboardMappingData} from "@nex/dataset";
import Constants from 'expo-constants';
import {RootStackParamList} from "../../../App2";
import {useApi} from "../../hooks/use-api";
import {loadProfile} from "../../service/profile";


export default function MainStats() {
    console.log('MainStats');

    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    const route = useRoute();
    const navigationState = useNavigationStateExternal();
    let routes = getPathToRoute(navigationState, route.key);
    if (routes.length === 0) {
        routes = getRoutesFromCurrentActiveStack(navigationState);
    }

    if (routes == null || routes.length === 0 || routes[0].params == null) return <View/>;

    const profileId = routes[0].params.profileId;

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

    return <MainStatsInternal profileId={profileId}/>;
}

function MainStatsInternal({profileId}: {profileId: number}) {
    const styles = useStyles();
    const mutate = useMutate();
    // const prefLeaderboardId = useSelector(state => state.prefs.leaderboardId) ?? leaderboardIdsData[0];
    const prefLeaderboardId = leaderboardIdsData[0];
    const [leaderboardId, setLeaderboardId] = useState(prefLeaderboardId);

    const navigation = useNavigation();
    const userProfile = useSelector(state => state.user[profileId]?.profile);
    useEffect(() => {
        if (!userProfile) return;
        navigation.setOptions({
            title: userProfile?.name + ' - ' + (Constants.expoConfig?.name || Constants.expoConfig2?.extra?.expoClient?.name),
        });
    }, [userProfile]);

    const profileWithStats = useApi(
        {},
        [],
        state => state.user[profileId]?.profileWithStats,
        (state, value) => {
            if (state.user[profileId] == null) {
                state.user[profileId] = {};
            }
            state.user[profileId].profileWithStats = value;
        },
        loadProfile, profileId, 'stats'
    );

    const currentCachedData =
        useSelector(state => get(state.user, [profileId, 'profileWithStats']))?.stats?.find(s => s.leaderboardId === leaderboardId);
    const previousCachedData = usePrevious(currentCachedData);

    // console.log('==> profile', profile.data);
    // console.log('==> profileWithStats', profileWithStats.data);

    const cachedData = currentCachedData ?? previousCachedData;

    // let statsDuration = cachedData?.statsDuration;
    // let statsPosition = cachedData?.statsPosition;
    // let statsPlayer = cachedData?.statsPlayer;
    let statsCiv = cachedData?.civ;
    let statsMap = cachedData?.map;
    let statsAlly = cachedData?.allies;
    let statsOpponent = cachedData?.opponents;

    const hasStats = cachedData != null;

    const list = ['stats-header', 'stats-duration', 'stats-position', 'stats-ally', 'stats-opponent', 'stats-civ', 'stats-map'];

    const onLeaderboardSelected = async (leaderboardId: LeaderboardId) => {
        mutate(setPrefValue('leaderboardId', leaderboardId));
        await saveCurrentPrefsToStorage();
        setLeaderboardId(leaderboardId);
    };

    const valueMapping: any = leaderboardMappingData;
    const values: any[] = leaderboardIdsData;

    const renderLeaderboard = (value: LeaderboardId, selected: boolean) => {
        return <View style={styles.col}>
            <MyText style={[styles.h1, { fontWeight: selected ? 'bold' : 'normal'}]}>{valueMapping[value].title}</MyText>
            <MyText style={[styles.h2, { fontWeight: selected ? 'bold' : 'normal'}]}>{valueMapping[value].subtitle}</MyText>
        </View>;
    };

    const leaderboardTitle = valueMapping?.[leaderboardId]?.title + ' ' + valueMapping?.[leaderboardId]?.subtitle;

    const [refetching, setRefetching] = useState(false);

    useEffect(() => {
        if (currentCachedData) {
            setRefetching(false);
        }
    }, [currentCachedData])

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
        await mutate(clearStatsPlayer(profileId));
        await mutate(clearMatchesPlayer(profileId));
        await mutate(setLoadingMatchesOrStats());
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {
                    Platform.OS === 'web' && refetching &&
                    <FlatListLoadingIndicator/>
                }
                <FlatList
                    contentContainerStyle={styles.list}
                    data={list}
                    renderItem={({item, index}) => {
                        switch (item) {
                            case 'stats-header':
                                return <View>
                                    <View style={styles.pickerRow}>
                                        <TemplatePicker value={leaderboardId} values={values} template={renderLeaderboard} onSelect={onLeaderboardSelected}/>
                                    </View>
                                    {/*<TextLoader ready={hasStats} style={styles.info}>*/}
                                    {/*    {statsPlayer?.matchCount > 0 ?*/}
                                    {/*        getTranslation('main.stats.thelastmatches', { matches: statsPlayer?.matchCount }) :*/}
                                    {/*        getTranslation('main.stats.nomatches') + leaderboardTitle}*/}
                                    {/*</TextLoader>*/}
                                </View>;
                            // case 'stats-duration':
                            //     return <MyText>---</MyText>;
                            //     // return <StatsDuration data={statsDuration} user={user}/>;
                            // case 'stats-position':
                            //     return <MyText>---</MyText>;
                            //     // return <StatsPosition data={statsPosition} user={user} leaderboardId={leaderboardId}/>;
                            case 'stats-civ':
                                return <StatsCiv data={statsCiv} user={profileId} title={getTranslation('main.stats.heading.civ')} leaderboardId={leaderboardId}/>;
                            case 'stats-map':
                                return <StatsCiv data={statsMap} user={profileId} title={getTranslation('main.stats.heading.map')} leaderboardId={leaderboardId}/>;
                            case 'stats-ally':
                                return <StatsCiv data={statsAlly} user={profileId} title={getTranslation('main.stats.heading.ally')} leaderboardId={leaderboardId}/>;
                            case 'stats-opponent':
                                return <StatsCiv data={statsOpponent} user={profileId} title={getTranslation('main.stats.heading.opponent')} leaderboardId={leaderboardId}/>;
                            default:
                                return <View/>;
                        }
                    }}
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


const useStyles = createStylesheet(theme => StyleSheet.create({
    info: {
        marginBottom: 10,
        marginLeft: 5,
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
        paddingRight: 20,
        marginBottom: 20,
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

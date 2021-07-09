import {useTheme} from "../../theming";
import {FlatList, Linking, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import React, {useEffect, useState} from "react";
import {RouteProp, useNavigation, useNavigationState, useRoute} from "@react-navigation/native";
import {RootStackParamList, RootTabParamList} from "../../../App";
import {Game} from "../components/game";
import RefreshControlThemed from "../components/refresh-control-themed";
import {
    clearMatchesPlayer,
    clearStatsPlayer,
    setLoadingMatchesOrStats,
    useMutate,
    useSelector
} from "../../redux/reducer";
import {Checkbox, Searchbar} from "react-native-paper";
import {MyText} from "../components/my-text";
import {appVariants} from "../../styles";
import {LeaderboardId} from "@nex/data";
import TemplatePicker from "../components/template-picker";
import {get} from 'lodash';
import {IMatch} from "@nex/data";
import {getMapName} from "../../helper/maps";
import {parseUserId, sameUser} from "../../helper/user";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {useNavigationStateExternal} from '../../hooks/use-navigation-state-external';
import {getPathToRoute, getRoutes, getRoutesFromCurrentActiveStack} from '../../service/navigation';
import {openLink} from "../../helper/url";
import {useWebRefresh} from "../../hooks/use-web-refresh";
import FlatListLoadingIndicator from "../components/flat-list-loading-indicator";
import {getCivName} from '../../../../website/src/helper/civs';


export default function MainMatches() {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    const route = useRoute();
    const navigationState = useNavigationStateExternal();
    let routes = getPathToRoute(navigationState, route.key);
    if (routes.length === 0) {
        routes = getRoutesFromCurrentActiveStack(navigationState);
    }

    if (routes == null || routes.length === 0 || routes[0].params == null) return <View/>;

    const user = routes[0].params.id;

    if (user == null) {
        return (
            <View style={styles.list}>
                <MyText>
                    If you see this screen instead of a user profile, report a bug in the <MyText style={appStyles.link} onPress={() => openLink('https://discord.com/invite/gCunWKx')}>discord</MyText>.
                </MyText>
            </View>
        );
    }

    return <MainMatchesInternal user={user}/>;
}

function MainMatchesInternal({user}: { user: any}) {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);
    const [text, setText] = useState('');
    const mutate = useMutate();
    const [leaderboardId, setLeaderboardId] = useState<LeaderboardId>();
    const [filteredMatches, setFilteredMatches] = useState<IMatch[]>();
    const [withMe, setWithMe] = useState(false);

    const navigation = useNavigation();
    const userProfile = useSelector(state => state.user[user.id]?.profile);
    useEffect(() => {
        if (!userProfile) return;
        navigation.setOptions({
            title: userProfile?.name + ' - AoE II Companion',
        });
    }, [userProfile]);

    const auth = useSelector(state => state.auth);

    const matches = useSelector(state => get(state.user, [user.id, 'matches']));

    useEffect(() => {
        if (matches == null) return;

        let filtered = matches;

        if (leaderboardId != null) {
            filtered = filtered.filter(m => m.leaderboard_id == leaderboardId);
        }

        if (text.trim().length > 0) {
            const parts = text.toLowerCase().split(' ');
            filtered = filtered.filter(m => {
                return parts.every(part => {
                    return m.name.toLowerCase().indexOf(part) >= 0 ||
                        (getMapName(m.map_type) || '').toLowerCase().indexOf(part) >= 0 ||
                        m.players.some(p => p.name?.toLowerCase().indexOf(part) >= 0) ||
                        m.players.some(p => p.civ != null && getCivName(p.civ).toLowerCase().indexOf(part) >= 0);
                });
            });
        }

        if (withMe && auth) {
            filtered = filtered.filter(m => m.players.some(p => sameUser(p, auth)));
        }

        setFilteredMatches(filtered);
    }, [text, leaderboardId, withMe, matches]);

    const list = [...(filteredMatches ? ['header'] : []), ...(filteredMatches || Array(15).fill(null))];

    const toggleWithMe = () => setWithMe(!withMe);

    const onLeaderboardSelected = async (selLeaderboardId: LeaderboardId) => {
        console.log('==>', leaderboardId, selLeaderboardId);
        if (leaderboardId === selLeaderboardId) {
            setLeaderboardId(undefined);
        } else {
            setLeaderboardId(selLeaderboardId);
        }
    };

    const values: number[] = [
        3,
        4,
        13,
        14,
        0,
    ];

    const valueMapping: any = {
        0: {
            title: 'UNR',
            subtitle: 'Unranked',
        },
        3: {
            title: 'RM',
            subtitle: '1v1',
        },
        4: {
            title: 'RM',
            subtitle: 'Team',
        },
        1: {
            title: 'DM',
            subtitle: '1v1',
        },
        2: {
            title: 'DM',
            subtitle: 'Team',
        },
        13: {
            title: 'EW',
            subtitle: '1v1',
        },
        14: {
            title: 'EW',
            subtitle: 'Team',
        },
    };

    const renderLeaderboard = (value: LeaderboardId, selected: boolean) => {
        return <View style={styles.col}>
            <MyText style={[styles.h1, { fontWeight: selected ? 'bold' : 'normal'}]}>{valueMapping[value].title}</MyText>
            <MyText style={[styles.h2, { fontWeight: selected ? 'bold' : 'normal'}]}>{valueMapping[value].subtitle}</MyText>
        </View>;
    };

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
        await mutate(clearMatchesPlayer(user));
        await mutate(setLoadingMatchesOrStats());
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.pickerRow}>
                    <TemplatePicker value={leaderboardId} values={values} template={renderLeaderboard} onSelect={onLeaderboardSelected}/>
                    <View style={appStyles.expanded}/>
                    {
                        auth && !sameUser(user, auth) &&
                        <View style={styles.row}>
                            <Checkbox.Android
                                status={withMe ? 'checked' : 'unchecked'}
                                onPress={toggleWithMe}
                            />
                            <TouchableOpacity onPress={toggleWithMe}>
                                <MyText>{getTranslation('main.matches.withme')}</MyText>
                            </TouchableOpacity>
                        </View>
                    }
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
                                return <Game match={item as any} expanded={index === -1} highlightedUsers={[user]} user={user}/>;
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


const useStyles = createStylesheet((theme, mode) => StyleSheet.create({
    searchbar: {
        marginTop: Platform.select({ ios: mode == 'light' ? 0 : 0 }),
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

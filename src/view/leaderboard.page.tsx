import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator, Dimensions, Image, ImageProps, StyleSheet, Text, TextProps, TouchableHighlight, View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fetchLeaderboard} from "../api/leaderboard";
import {userIdFromBase} from "../helper/user";
import {getFlagIcon} from "../helper/flags";
import {useCavy} from "cavy";
import {ILeaderboardPlayer} from "../helper/data";
import {RootStackProp} from "../../App";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useLazyApi} from "../hooks/use-lazy-api";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {getString} from "../helper/strings";
import {IconButton} from "react-native-paper";
import {TextLoader} from "./loader/text-loader";
import {ImageLoader} from "./loader/image-loader";
import {TabBarLabel} from "./components/tab-bar-label";

const Tab = createMaterialTopTabNavigator();

export default function LeaderboardPage() {
    return (
        <Tab.Navigator swipeEnabled={false} lazy={true}>
            <Tab.Screen name="MainHome" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="RM 1v1"/>}}>
                {() => <Leaderboard leaderboardId={3} />}
            </Tab.Screen>
            <Tab.Screen name="MainMatches" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="RM Team"/>}}>
                {() => <Leaderboard leaderboardId={4} />}
            </Tab.Screen>
            <Tab.Screen name="MainMatches2" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="DM 1v1"/>}}>
                {() => <Leaderboard leaderboardId={1} />}
            </Tab.Screen>
            <Tab.Screen name="MainMatches3" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="DM Team"/>}}>
                {() => <Leaderboard leaderboardId={2} />}
            </Tab.Screen>
            <Tab.Screen name="MainMatches4" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="Unr."/>}}>
                {() => <Leaderboard leaderboardId={0} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export function Leaderboard({leaderboardId} : any) {
    const navigation = useNavigation<RootStackProp>();
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(Math.floor((window.height - 250) / 40));

    console.log('window', window);
    console.log('screen', screen);

    const players = useLazyApi(
        fetchLeaderboard, 'aoe2de', leaderboardId, {start: page * perPage + 1, count: perPage}
    );

    useEffect(() => {
        players.refetch('aoe2de', leaderboardId, {start: page * perPage + 1, count: perPage});
    }, [page, perPage]);

    const onSelect = async (player: ILeaderboardPlayer) => {
        console.log('naivigate', {
            id: userIdFromBase(player),
            name: player.name,
        });
        navigation.push('User', {
            id: userIdFromBase(player),
            name: player.name,
        });
    };

    const previousPage = async () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const nextPage = async () => {
        setPage(page + 1);
    };

    const count = players.data?.leaderboard.length;
    const total = players.data?.total;
    const from = page * perPage + 1;
    const to = from + count - 1;
    const canPrevious = page > 0;
    const canNext = to < total;

    const list = [...(players.data?.leaderboard || Array(perPage).fill(null))];
    console.log("list", list);

    const _renderRow = (player: any, i: number) => {
        return (
            <TouchableHighlight style={styles.row} key={i} onPress={() => onSelect(player)} underlayColor="white">
                <View style={styles.innerRow}>
                    <TextLoader style={styles.cellRank}>{player?.rank}</TextLoader>
                    <TextLoader style={styles.cellRating}>{player?.rating}</TextLoader>
                    <View style={styles.cellName}>
                        <ImageLoader style={styles.countryIcon} source={getFlagIcon(player?.country)}/>
                        <TextLoader style={styles.name} numberOfLines={1}>{player?.name}</TextLoader>
                    </View>
                    <TextLoader style={styles.cellGames}>{player?.games}</TextLoader>
                </View>
            </TouchableHighlight>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{getString('leaderboard', leaderboardId)}</Text>

            <View style={styles.headerRow}>
                <Text style={styles.cellRank} numberOfLines={1}>Rank</Text>
                <Text style={styles.cellRating} numberOfLines={1}>Rating</Text>
                <Text style={styles.cellName} numberOfLines={1}>Name</Text>
                <Text style={styles.cellGames} numberOfLines={1}>Games</Text>
            </View>

            <View style={styles.measureContainer}>
                {
                    list.map((player, i) => _renderRow(player, i))
                }
            </View>

            <View style={styles.footerRow}>
                {
                    players.touched &&
                    <View style={styles.activityInfo}>
                        {
                            players.loading &&
                            <ActivityIndicator animating size="small"/>
                        }
                    </View>
                }

                {
                    players.touched &&
                    <Text style={styles.pageInfo}>{isNaN(to) ? null : `${from}-${to} of ${total}`}</Text>
                }

                <IconButton
                    style={styles.arrowIcon}
                    icon={({ size, color }) => (<Icon name="chevron-left" color={color} size={size}/>)}
                    color={canPrevious ? 'black' : 'grey'}
                    disabled={!canPrevious}
                    onPress={previousPage}
                />
                <IconButton
                    icon={({ size, color }) => (<Icon name="chevron-right" color={color} size={size}/>)}
                    color={canNext ? 'black' : 'grey'}
                    disabled={!canNext}
                    onPress={nextPage}
                />
            </View>
        </View>
    );
}

const padding = 8;

const styles = StyleSheet.create({
    measureContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'visible',
        // backgroundColor: 'yellow',
        padding: 5,
        width: '100%',
    },
    activityInfo: {
        flex: 1,
        alignItems: 'flex-end'
    },
    pageInfo: {
        flex: 0,
        textAlign: 'right',
        marginLeft: 15,
    },
    arrowIcon: {
        marginLeft: 25,
        // backgroundColor: 'red',
    },
    name: {
        flex: 1,
    },
    cellRank: {
        padding: padding,
        textAlign: 'left',
        flex: 1,
        // marginRight: 20,
        // backgroundColor: 'red',
    },
    cellRating: {
        padding: padding,
        flex: 1.5,
    },
    cellName: {
        padding: padding,
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cellName2: {
        padding: padding,
        flex: 4,
    },
    cellGames: {
        padding: padding,
        flex: 1.5,
        // marginLeft: 5,
    },
    cellWins: {
        padding: padding,
        flex: 1,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 3,
        // padding: 3,
        // paddingVertical: 5,
        padding: 5,
        borderRadius: 5,
        marginRight: 30,
        marginLeft: 30,
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        padding: 3,
        borderRadius: 5,
        marginRight: 30,
        marginLeft: 30,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    row: {
        // marginRight: 30,
        // marginLeft: 30,
        // width: '100%',
        // flex: 3,
        flex: 1,
        backgroundColor: 'white',
    },
    innerRow: {
        flex: 1,
        // height: 40,
        // alignItems: "center",
        // backgroundColor: 'blue',
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    countryIcon: {
        width: 21,
        height: 15,
        // paddingBottom: 4,
        marginRight: 5,
    },
    title: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
        paddingTop: 18,
    },
});

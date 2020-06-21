import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fetchLeaderboard} from "../api/leaderboard";
import {composeUserId, userIdFromBase} from "../helper/user";
import {getFlagIcon} from "../helper/flags";
import {useCavy} from "cavy";
import {ILeaderboardPlayer} from "../helper/data";
import {RootStackProp} from "../../App";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {TouchableFeedback} from "./components/touchable-feedback";
import {useLazyApi} from "../hooks/use-lazy-api";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {TabBarLabel} from "./main.page";
import {getString} from "../helper/strings";
import {DataTable, IconButton} from "react-native-paper";

const Tab = createMaterialTopTabNavigator();

export default function LeaderboardPage() {
    return (
        <Tab.Navigator swipeEnabled={false}lazy={true}>
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

export function Leaderboard({leaderboardId} : any) {
    const generateTestHook = useCavy();
    const navigation = useNavigation<RootStackProp>();
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(-1);

    const players = useLazyApi(
        // [],
        // state => state.leaderboard[leaderboardId],
        // (state, value) => {
        //     if (state.leaderboard[leaderboardId] == null) {
        //         state.leaderboard[leaderboardId] = [] as any;
        //     }
        //     state.leaderboard[leaderboardId] = value;
        // },
        fetchLeaderboard, 'aoe2de', leaderboardId, {start: page, count: perPage}
    );

    useEffect(() => {
        if (perPage === -1) return;
        players.refetch('aoe2de', leaderboardId, {start: page * perPage, count: perPage});
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

    const measureView = (event: any) => {
        if (perPage !== -1) return;
        console.log(event.nativeEvent.layout.height);
        const height = event.nativeEvent.layout.height;
        setPerPage(Math.floor(height / 40));
    };

    const count = players.data?.leaderboard.length;
    const total = players.data?.total;
    const from = page * perPage + 1;
    const to = from + count - 1;
    const canPrevious = page > 0;
    const canNext = to < total;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{getString('leaderboard', leaderboardId)}</Text>
            {/*<DataTable>*/}
            {/*    <DataTable.Header>*/}
            {/*        <DataTable.Title>Dessert</DataTable.Title>*/}
            {/*        <DataTable.Title numeric>Calories</DataTable.Title>*/}
            {/*        <DataTable.Title numeric>Fat</DataTable.Title>*/}
            {/*    </DataTable.Header>*/}

            {/*    <DataTable.Row>*/}
            {/*        <DataTable.Cell>Frozen yogurt</DataTable.Cell>*/}
            {/*        <DataTable.Cell numeric>159</DataTable.Cell>*/}
            {/*        <DataTable.Cell numeric>6.0</DataTable.Cell>*/}
            {/*    </DataTable.Row>*/}

            {/*    <DataTable.Row>*/}
            {/*        <DataTable.Cell>Ice cream sandwich</DataTable.Cell>*/}
            {/*        <DataTable.Cell numeric>237</DataTable.Cell>*/}
            {/*        <DataTable.Cell numeric>8.0</DataTable.Cell>*/}
            {/*    </DataTable.Row>*/}

            {/*    <DataTable.Pagination*/}
            {/*        page={1}*/}
            {/*        numberOfPages={3}*/}
            {/*        onPageChange={(page) => { console.log(page); }}*/}
            {/*        label="1-2 of 6"*/}
            {/*    />*/}
            {/*</DataTable>*/}

            <View style={styles.measureContainer} onLayout={measureView}>
                <View style={styles.headerRow}>
                    <Text style={styles.cellRank} numberOfLines={1}>Rank</Text>
                    <Text style={styles.cellRating} numberOfLines={1}>Rating</Text>
                    <Text style={styles.cellName} numberOfLines={1}>Name</Text>
                    <Text style={styles.cellGames} numberOfLines={1}>Games</Text>
                    {/*<Text style={styles.cellWins} numberOfLines={1}>Wins</Text>*/}
                </View>
                {
                    players.data && players.data.leaderboard.map((player, i) =>
                        <TouchableHighlight style={styles.row} key={composeUserId(player)}
                                            onPress={() => onSelect(player)} underlayColor="white"
                                            ref={generateTestHook('Leaderboard.Player.' + composeUserId(player))}>
                            <View style={styles.innerRow}>
                                <Text style={styles.cellRank} numberOfLines={1}>{player.rank}</Text>
                                <Text style={styles.cellRating} numberOfLines={1}>{player.rating}</Text>
                                <View style={styles.cellName}>
                                    <Image style={styles.countryIcon} source={getFlagIcon(player.country)}/>
                                    <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
                                </View>
                                <Text style={styles.cellGames}>{player.games}</Text>
                                {/*<Text style={styles.cellWins}>{player.wins}</Text>*/}
                            </View>
                        </TouchableHighlight>
                    )
                }
            </View>
            <View style={styles.footerRow}>
                <View style={styles.activityInfo}>
                    {
                        players.loading &&
                        <ActivityIndicator animating size="small"/>
                    }
                </View>

                <Text style={styles.pageInfo}>{from}-{to} of {total}</Text>

                <IconButton
                    style={styles.arrowIcon}
                    icon={({ size, color }) => (<Icon name="chevron-left" color={color} size={size}/>)}
                    color={canPrevious ? 'black' : 'grey'}
                    disabled={!canPrevious}
                    // onPress={previousPage}
                />
                <IconButton
                    icon={({ size, color }) => (<Icon name="chevron-right" color={color} size={size}/>)}
                    color={canNext ? 'black' : 'grey'}
                    disabled={!canNext}
                    onPress={nextPage}
                />

                {/*<TouchableFeedback style={styles.arrowIcon} onPress={previousPage} disabled={!canPrevious} underlayColor="white">*/}
                {/*    <Icon name={'chevron-left'} color={canPrevious ? 'black' : 'grey'} size={24}/>*/}
                {/*</TouchableFeedback>*/}
                {/*<TouchableFeedback style={styles.arrowIcon} onPress={nextPage} disabled={!canNext} underlayColor="white">*/}
                {/*    <Icon name={'chevron-right'} color={canNext ? 'black' : 'grey'} size={24}/>*/}
                {/*</TouchableFeedback>*/}
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
    },
    cellRating: {
        padding: padding,
        flex: 1.5,
    },
    cellCountry: {
        padding: padding,
        width: 30,
    },
    cellName: {
        padding: padding,
        flex: 4,
        flexDirection: 'row',
    },
    cellGames: {
        padding: padding,
        flex: 1.5,
        marginLeft: 5,
    },
    cellWins: {
        padding: padding,
        flex: 1,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginRight: 30,
        marginLeft: 30,
        width: '100%',
        flex: 3,
    },
    innerRow: {
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    countryIcon: {
        width: 21,
        height: 15,
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

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

export default function LeaderboardPage() {
    const generateTestHook = useCavy();
    const navigation = useNavigation<RootStackProp>();
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(-1);

    const leaderboardId = 4;

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Team Random Map</Text>
            <View style={styles.measureContainer} onLayout={measureView}>
                <View style={styles.headerRow}>
                    <Text style={styles.cellRank} numberOfLines={1}>Rank</Text>
                    <Text style={styles.cellRating} numberOfLines={1}>Rating</Text>
                    <Text style={styles.cellName} numberOfLines={1}>Name</Text>
                    <Text style={styles.cellGames} numberOfLines={1}>Games</Text>
                    <Text style={styles.cellWins} numberOfLines={1}>Wins</Text>
                </View>
                {
                    players.data && players.data.leaderboard.map((player, i) =>
                        <TouchableHighlight style={styles.row} key={composeUserId(player)}
                                            onPress={() => onSelect(player)} underlayColor="white"
                                            ref={generateTestHook('Leaderboard.Player.' + composeUserId(player))}>
                            <View style={styles.row2}>
                                <Text style={styles.cellRank} numberOfLines={1}>{player.rank}</Text>
                                <Text style={styles.cellRating} numberOfLines={1}>{player.rating}</Text>
                                <View style={styles.cellName}>
                                    <Image style={styles.countryIcon} source={getFlagIcon(player.country)}/>
                                    <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
                                </View>
                                <Text style={styles.cellGames}>{player.games}</Text>
                                <Text style={styles.cellWins}>{player.wins}</Text>
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

                <Text style={styles.pageInfo}>{page * perPage + 1}-{page * perPage + perPage} of {players.data?.total}</Text>

                <TouchableFeedback style={styles.arrowIcon} onPress={previousPage} disabled={page === 0} underlayColor="white">
                    <Icon name={'chevron-left'} color={page === 0 ? 'grey' : 'black'} size={24}/>
                </TouchableFeedback>
                <TouchableHighlight style={styles.arrowIcon} onPress={nextPage} disabled={page + perPage >= players.data?.total} underlayColor="white">
                    <Icon name={'chevron-right'} size={24}/>
                </TouchableHighlight>
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
        marginLeft: 15,
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
        flex: 1,
        // width: 40,
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
        flex: 1,
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
        padding: 3,
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
        // flexDirection: 'row',
        // alignItems: 'center',
        // marginBottom: 3,
        // padding: 3,
        // borderBottomWidth: 1,
        // borderBottomColor: '#EEE',
        flex: 3,
        // backgroundColor: 'red',
    },
    row2: {
        // marginRight: 30,
        // marginLeft: 30,
        width: '100%',
        flexDirection: 'row',
        // alignItems: 'center',
        // // marginBottom: 3,
        // padding: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        // flex: 3,
        // backgroundColor: 'red',
    },
    countryIcon: {
        width: 21,
        height: 15,
        marginRight: 5,
        // flex: 10,
        // alignSelf: 'center',
    },
    title: {
        // marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
    },
});

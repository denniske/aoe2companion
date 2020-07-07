import {Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import React from 'react';
import {IMatch, IPlayer} from "../../helper/data";
import {TextLoader} from "./loader/text-loader";
import {orderBy, uniqBy} from "lodash-es";
import {getFlagIcon} from "../../helper/flags";
import {composeUserId, sameUser, UserIdBase, userIdFromBase} from "../../helper/user";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";

interface IRow {
    player: IPlayer;
    games: number;
    won: number;
}

interface IRowProps {
    data: IRow;
}

function Row({data}: IRowProps) {
    const navigation = useNavigation<RootStackProp>();

    const gotoPlayer = () => {
        navigation.push('User', {
            id: userIdFromBase(data.player),
            name: data.player.name,
        });
    };

    return (
            <View style={styles.row}>
                <TouchableHighlight style={styles.cellLeaderboard} onPress={gotoPlayer}>
                    <View style={styles.row}>
                        <Image style={styles.icon} source={getFlagIcon(data.player.country)}/>
                        <Text>{data.player.name}</Text>
                    </View>
                </TouchableHighlight>
                <Text style={styles.cellGames}>
                    {data.games}
                </Text>
                <Text style={styles.cellWon}>
                    {isNaN(data.won) ? '-' : data.won.toFixed(0) + ' %'}
                </Text>
            </View>
    )
}

interface IProps {
    matches: IMatch[];
    user: UserIdBase;
}

function validMatch(m: IMatch) {
    return m.players.filter(p => p.won !== null).length === m.num_players;
}

export default function StatsPlayer({matches, user}: IProps) {
    let rowsAlly: IRow[] | null = null;
    let rowsOpponent: IRow[] | null = null;
    const maxRowCount = 8;

    if (matches) {
        let otherPlayers = matches.flatMap(m => m.players).filter(p => !sameUser(p, user));
        let otherPlayersUniq = uniqBy(otherPlayers, p => composeUserId(p));

        rowsAlly = otherPlayersUniq.map(otherPlayer => {
            const gamesWithAlly = matches.filter(m => {
                const userTeam = m.players.find(p => sameUser(p, user))?.team;
                const otherPlayerTeam = m.players.find(p => sameUser(p, otherPlayer))?.team;
                return userTeam != null && otherPlayerTeam != null && userTeam === otherPlayerTeam;
            });
            const validGamesWithAlly = gamesWithAlly.filter(validMatch);
            const validGamesWithPlayerWon = validGamesWithAlly.filter(m => m.players.filter(p => p.won && sameUser(p, user)).length > 0);
            return ({
                player: otherPlayer,
                games: gamesWithAlly.length,
                won: validGamesWithPlayerWon.length / validGamesWithAlly.length * 100,
            });
        });
        rowsAlly = rowsAlly.filter(r => r.games > 0);
        rowsAlly = orderBy(rowsAlly, r => r.games, 'desc');
        rowsAlly = rowsAlly.filter((r, i) => i < maxRowCount);

        rowsOpponent = otherPlayersUniq.map(otherPlayer => {
            const gamesWithOpponent = matches.filter(m => {
                const userTeam = m.players.find(p => sameUser(p, user))?.team;
                const otherPlayerTeam = m.players.find(p => sameUser(p, otherPlayer))?.team;
                return userTeam != null && otherPlayerTeam != null && userTeam !== otherPlayerTeam;
            });
            const validGamesWithOpponent = gamesWithOpponent.filter(validMatch);
            const validGamesWithPlayerWon = validGamesWithOpponent.filter(m => m.players.filter(p => p.won && sameUser(p, user)).length > 0);
            return ({
                player: otherPlayer,
                games: gamesWithOpponent.length,
                won: validGamesWithPlayerWon.length / validGamesWithOpponent.length * 100,
            });
        });
        rowsOpponent = rowsOpponent.filter(r => r.games > 0);
        rowsOpponent = orderBy(rowsOpponent, r => r.games, 'desc');
        rowsOpponent = rowsOpponent.filter((r, i) => i < maxRowCount);
    }

    return (
            <View style={styles.container}>
                <View>
                    {
                        matches &&
                        <Text style={styles.info}>(of the last {matches.length} matches)</Text>
                    }

                    <View style={styles.row}>
                        <Text numberOfLines={1} style={styles.cellLeaderboard}>Ally</Text>
                        <Text numberOfLines={1} style={styles.cellGames}>Games</Text>
                        <Text numberOfLines={1} style={styles.cellWon}>Won*</Text>
                    </View>

                    {
                        rowsAlly && rowsAlly.map(leaderboard =>
                                <Row key={composeUserId(leaderboard.player)} data={leaderboard}/>
                        )
                    }

                    {
                        !rowsAlly && Array(8).fill(0).map((a, i) =>
                            <View key={i} style={styles.row}>
                                <TextLoader style={styles.cellLeaderboard}/>
                                <TextLoader style={styles.cellGames}/>
                                <TextLoader style={styles.cellWon}/>
                            </View>
                        )
                    }

                    <Text/>
                    <View style={styles.row}>
                        <Text numberOfLines={1} style={styles.cellLeaderboard}>Opponent</Text>
                        <Text numberOfLines={1} style={styles.cellGames}>Games</Text>
                        <Text numberOfLines={1} style={styles.cellWon}>Won*</Text>
                    </View>

                    {
                        rowsOpponent && rowsOpponent.map(leaderboard =>
                                <Row key={composeUserId(leaderboard.player)} data={leaderboard}/>
                        )
                    }
                    <Text/>
                    {
                        matches &&
                        <Text style={styles.info}>*based on matches with known result</Text>
                    }

                    {
                        !rowsOpponent && Array(8).fill(0).map((a, i) =>
                            <View key={i} style={styles.row}>
                                <TextLoader style={styles.cellLeaderboard}/>
                                <TextLoader style={styles.cellGames}/>
                                <TextLoader style={styles.cellWon}/>
                            </View>
                        )
                    }
                </View>
            </View>
    )
}


const padding = 5;

const styles = StyleSheet.create({
    info: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#555',
        fontSize: 12,
    },
    cellLeaderboard: {
        // backgroundColor: 'red',
        padding: padding,
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cellGames: {
        padding: padding,
        flex: 1,
        // textAlign: 'right'
    },
    cellWon: {
        padding: padding,
        flex: 1,
        // textAlign: 'right'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        // backgroundColor: 'red',
    },
    icon: {
        width: 22,
        height: 22,
        marginRight: 5,
    },
});

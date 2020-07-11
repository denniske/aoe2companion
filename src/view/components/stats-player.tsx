import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IMatch, IPlayer, validMatch} from "../../helper/data";
import {TextLoader} from "./loader/text-loader";
import {orderBy, uniqBy} from "lodash-es";
import {getFlagIcon} from "../../helper/flags";
import {composeUserId, sameUser, UserIdBase, userIdFromBase} from "../../helper/user";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {MyText} from "./my-text";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {LeaderboardId} from "../../helper/leaderboards";

interface IRow {
    player: IPlayer;
    games: number;
    won: number;
}

interface IRowProps {
    data: IRow;
}

function Row({data}: IRowProps) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();

    const gotoPlayer = () => {
        navigation.push('User', {
            id: userIdFromBase(data.player),
            name: data.player.name,
        });
    };

    return (
            <View style={styles.row}>
                <TouchableOpacity style={styles.cellLeaderboard} onPress={gotoPlayer}>
                    <View style={styles.row}>
                        <Image style={styles.countryIcon} source={getFlagIcon(data.player.country)}/>
                        <MyText>{data.player.name}</MyText>
                    </View>
                </TouchableOpacity>
                <MyText style={styles.cellGames}>
                    {data.games}
                </MyText>
                <MyText style={styles.cellWon}>
                    {isNaN(data.won) ? '-' : data.won.toFixed(0) + ' %'}
                </MyText>
            </View>
    )
}

interface IProps {
    matches?: IMatch[];
    user: UserIdBase;
    leaderboardId: LeaderboardId;
}

export default function StatsPlayer({matches, user, leaderboardId}: IProps) {
    const styles = useTheme(variants);
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

    if (matches && matches.length === 0) {
        return (<View>
                <MyText style={styles.info}>No matches yet!</MyText>
            </View>
        );
    }

    const hasAlly = [LeaderboardId.DMTeam, LeaderboardId.RMTeam, LeaderboardId.Unranked].includes(leaderboardId);

    return (
            <View style={styles.container}>
                <View>
                    {
                        matches &&
                        <MyText style={styles.info}>the last {matches.length} matches:</MyText>
                    }

                    {
                        hasAlly &&
                        <View style={styles.row}>
                            <MyText numberOfLines={1} style={styles.cellLeaderboard}>Ally</MyText>
                            <MyText numberOfLines={1} style={styles.cellGames}>Games</MyText>
                            <MyText numberOfLines={1} style={styles.cellWon}>Won*</MyText>
                        </View>
                    }

                    {
                        hasAlly && rowsAlly && rowsAlly.map(leaderboard =>
                                <Row key={composeUserId(leaderboard.player)} data={leaderboard}/>
                        )
                    }

                    {
                        hasAlly && !rowsAlly && Array(8).fill(0).map((a, i) =>
                            <View key={i} style={styles.row}>
                                <TextLoader style={styles.cellLeaderboard}/>
                                <TextLoader style={styles.cellGames}/>
                                <TextLoader style={styles.cellWon}/>
                            </View>
                        )
                    }

                    <MyText/>
                    <View style={styles.row}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>Opponent</MyText>
                        <MyText numberOfLines={1} style={styles.cellGames}>Games</MyText>
                        <MyText numberOfLines={1} style={styles.cellWon}>Won*</MyText>
                    </View>

                    {
                        rowsOpponent && rowsOpponent.map(leaderboard =>
                                <Row key={composeUserId(leaderboard.player)} data={leaderboard}/>
                        )
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

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        info: {
            textAlign: 'center',
            marginBottom: 10,
            color: theme.textNoteColor,
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
        countryIcon: {
            width: 21,
            height: 15,
            marginRight: 5,
        },
    });
};

const variants = makeVariants(getStyles);


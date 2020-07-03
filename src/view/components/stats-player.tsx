import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IMatch, IPlayer} from "../../helper/data";
import {TextLoader} from "../loader/text-loader";
import {Civ, civs, getCivIcon} from "../../helper/civs";
import {useSelector} from "../../redux/reducer";
import {AoeMap, getMapImage, getMapName, maps} from "../../helper/maps";
import {orderBy, sortBy, uniq, uniqBy} from "lodash-es";
import {getFlagIcon} from "../../helper/flags";
import {composeUserId} from "../../helper/user";

interface IRow {
    player: IPlayer;
    games: number;
    won: number;
}

interface IRowProps {
    data: IRow;
}

function Row({data}: IRowProps) {

    return (
            <View style={styles.row}>
                <View style={styles.cellLeaderboard}>
                    <Image style={styles.icon} source={getFlagIcon(data.player.country)}/>
                    <Text>{data.player.name}</Text>
                </View>
                <Text style={styles.cellGames}>
                    {data.games}
                </Text>
                <Text style={styles.cellWon}>
                    {data.won.toFixed(0)} %
                </Text>
            </View>
    )
}

interface IProps {
    matches: IMatch[];
}

export default function StatsPlayer({matches}: IProps) {
    const auth = useSelector(state => state.auth!);

    let rows: IRow[] | null = null;

    if (matches) {

        let otherPlayers = matches.flatMap(m => m.players).filter(p => p.steam_id !== auth.steam_id && p.profile_id !== auth.profile_id);
        let otherPlayersUniq = uniqBy(otherPlayers, p => composeUserId(p));

        rows = otherPlayersUniq.map(otherPlayer => {
            const gamesWithPlayer = matches.filter(m => m.players.filter(p =>
                (p.steam_id === otherPlayer.steam_id || p.profile_id === otherPlayer.profile_id)
            ).length > 0);
            const gamesWithPlayerWon = gamesWithPlayer.filter(m => m.players.filter(p =>
                p.won &&
                (p.steam_id === auth.steam_id || p.profile_id === auth.profile_id)
            ).length > 0);
            return ({
                player: otherPlayer,
                games: gamesWithPlayer.length,
                won: gamesWithPlayerWon.length / gamesWithPlayer.length * 100,
            });
        });
        rows = rows.filter(r => r.games > 0);
        rows = orderBy(rows, [r => r.games], ['desc']);
        // rows = orderBy(rows, [r => r.won], ['desc']);
        rows = rows.filter((r, i) => i < 8);
    }

    return (
            <View style={styles.container}>
                <Text/>
                <View>
                    <View style={styles.row}>
                        <Text numberOfLines={1} style={styles.cellLeaderboard}>Player</Text>
                        <Text numberOfLines={1} style={styles.cellGames}>Games</Text>
                        <Text numberOfLines={1} style={styles.cellWon}>Won</Text>
                    </View>

                    {
                        rows && rows.map(leaderboard =>
                                <Row key={composeUserId(leaderboard.player)} data={leaderboard}/>
                        )
                    }

                    {
                        !rows && Array(8).fill(0).map((a, i) =>
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
    },
    cellWon: {
        padding: padding,
        flex: 1,
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

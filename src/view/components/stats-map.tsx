import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IMatch} from "../../helper/data";
import {TextLoader} from "../loader/text-loader";
import {Civ, civs, getCivIcon} from "../../helper/civs";
import {useSelector} from "../../redux/reducer";
import {AoeMap, getMapImage, getMapName, maps} from "../../helper/maps";
import {orderBy, sortBy} from "lodash-es";

interface IRow {
    map: AoeMap;
    games: number;
    won: number;
}

interface IRowProps {
    data: any;
}

function Row({data}: IRowProps) {

    return (
            <View style={styles.row}>
                <View style={styles.cellLeaderboard}>
                    <Image style={styles.icon} source={getMapImage(data.map)}/>
                    <Text>{getMapName(data.map)}</Text>
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

export default function StatsMap({matches}: IProps) {
    const auth = useSelector(state => state.auth!);

    let rows: IRow[] | null = null;

    if (matches) {
        const mapList = Object.keys(maps);
        console.log(matches);
        rows = mapList.map((map: string) => {
            console.log(map);
            const gamesWithMap = matches.filter(m => m.map_type === parseInt(map));
            const gamesWithMapWon = gamesWithMap.filter(m => m.players.filter(p =>
                p.won &&
                (p.steam_id === auth.steam_id || p.profile_id === auth.profile_id)
            ).length > 0);
            return ({
                map: parseInt(map) as AoeMap,
                games: gamesWithMap.length,
                won: gamesWithMapWon.length / gamesWithMap.length * 100,
            });
        });
        rows = rows.filter(r => r.games > 0);
        rows = orderBy(rows, [r => r.games], ['desc']);
        // rows = orderBy(rows, [r => r.won], ['desc']);
    }

    return (
            <View style={styles.container}>
                <Text/>
                <View>
                    <View style={styles.row}>
                        <Text numberOfLines={1} style={styles.cellLeaderboard}>Map</Text>
                        <Text numberOfLines={1} style={styles.cellGames}>Games</Text>
                        <Text numberOfLines={1} style={styles.cellWon}>Won</Text>
                    </View>

                    {
                        rows && rows.map(leaderboard =>
                                <Row key={leaderboard.map} data={leaderboard}/>
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

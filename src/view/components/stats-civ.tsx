import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IMatch, validMatch} from "../../helper/data";
import {TextLoader} from "./loader/text-loader";
import {Civ, civs, getCivIcon} from "../../helper/civs";
import {orderBy} from "lodash-es";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {sameUser, UserIdBase} from "../../helper/user";
import {MyText} from "./my-text";
import {ITheme, makeVariants, useTheme} from "../theming";

interface IRow {
    civ: Civ;
    games: number;
    won: number;
}

interface IRowProps {
    data: any;
}

function Row({data}: IRowProps) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();

    const gotoCiv = () => {
        navigation.push('Civ', { civ: data.civ });
    };

    return (
            <View style={styles.row}>
                <TouchableOpacity style={styles.cellLeaderboard} onPress={gotoCiv}>
                    <View style={styles.row}>
                        <Image style={styles.icon} source={getCivIcon(data.civ)}/>
                        <MyText>{data.civ}</MyText>
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
}

export default function StatsCiv({matches, user}: IProps) {
    const styles = useTheme(variants);
    let rows: IRow[] | null = null;

    if (matches) {
        rows = civs.map(civ => {
            const gamesWithCiv = matches.filter(m => m.players.filter(p =>
                p.civ === civs.indexOf(civ) &&
                sameUser(p, user)
            ).length > 0);
            const validGamesWithCiv = gamesWithCiv.filter(validMatch);
            const validGamesWithCivWon = validGamesWithCiv.filter(m => m.players.filter(p => p.won && sameUser(p, user)).length > 0);
            return ({
                civ: civ,
                games: gamesWithCiv.length,
                won: validGamesWithCivWon.length / validGamesWithCiv.length * 100,
            });
        });
        rows = rows.filter(r => r.games > 0);
        rows = orderBy(rows, r => r.games, 'desc');
        // rows = orderBy(rows, [r => r.won], ['desc']);
    }

    if (matches && matches.length === 0) {
        return <View/>;
    }

    return (
            <View style={styles.container}>
                <MyText/>
                <View>
                    <View style={styles.row}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>Civ</MyText>
                        <MyText numberOfLines={1} style={styles.cellGames}>Games</MyText>
                        <MyText numberOfLines={1} style={styles.cellWon}>Won*</MyText>
                    </View>

                    {
                        rows && rows.map(leaderboard =>
                                <Row key={leaderboard.civ.toString()} data={leaderboard}/>
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

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
};

const variants = makeVariants(getStyles);

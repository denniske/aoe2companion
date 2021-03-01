import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IMatch} from "@nex/data";
import {TextLoader} from "./loader/text-loader";
import {Civ} from "@nex/data";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {UserIdBase} from "../../helper/user";
import {MyText} from "./my-text";
import {IRow} from "../../service/stats/stats-civ";
import Space from "./space";
import {getCivIcon} from "../../helper/civs";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {LeaderboardId} from '@nex/data';


interface IRowProps {
    data: any;
}

function Row({data}: IRowProps) {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    const gotoCiv = () => {
        navigation.push('Civ', { civ: data.civ });
    };

    return (
            <View style={styles.row}>
                <TouchableOpacity style={styles.cellLeaderboard} onPress={gotoCiv}>
                    <View style={styles.row}>
                        <Image fadeDuration={0} style={styles.icon} source={getCivIcon(data.civ)}/>
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
    user: UserIdBase;
    leaderboardId: LeaderboardId;
    data: IData;
}

interface IData {
    rowsWithCiv: IRow[] | null;
    rowsAgainstCiv: IRow[] | null;
    matches?: IMatch[] | null;
    user: UserIdBase;
    leaderboardId: LeaderboardId;
}

export default function StatsCiv(props: IProps) {
    const styles = useStyles();

    const { data, user } = props;
    let { rowsWithCiv, rowsAgainstCiv, leaderboardId } = data || { leaderboardId: props.leaderboardId };

    const hasAgainstCiv = [LeaderboardId.RM1v1, LeaderboardId.DM1v1].includes(leaderboardId);

    if (rowsWithCiv?.length === 0) {
        return <View/>;
    }

    return (
            <View style={styles.container}>
                <Space/>
                <View style={styles.row}>
                    <MyText numberOfLines={1} style={styles.cellLeaderboard}>{getTranslation('main.stats.heading.civ')}</MyText>
                    <MyText numberOfLines={1} style={styles.cellGames}>{getTranslation('main.stats.heading.games')}</MyText>
                    <MyText numberOfLines={1} style={styles.cellWon}>{getTranslation('main.stats.heading.won')}*</MyText>
                </View>

                {
                    rowsWithCiv && rowsWithCiv.map(leaderboard =>
                            <Row key={leaderboard.civ.toString()} data={leaderboard}/>
                    )
                }

                {
                    !rowsWithCiv && Array(8).fill(0).map((a, i) =>
                        <View key={i} style={styles.row}>
                            <TextLoader style={styles.cellLeaderboard}/>
                            <TextLoader style={styles.cellGames}/>
                            <TextLoader style={styles.cellWon}/>
                        </View>
                    )
                }

                {
                    hasAgainstCiv &&
                    <Space/>
                }
                {
                    hasAgainstCiv &&
                    <View style={styles.row}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>{getTranslation('main.stats.heading.againstciv')}</MyText>
                        <MyText numberOfLines={1} style={styles.cellGames}>{getTranslation('main.stats.heading.games')}</MyText>
                        <MyText numberOfLines={1} style={styles.cellWon}>{getTranslation('main.stats.heading.won')}*</MyText>
                    </View>
                }

                {
                    hasAgainstCiv && rowsAgainstCiv && rowsAgainstCiv.map(leaderboard =>
                            <Row key={leaderboard.civ.toString()} data={leaderboard}/>
                    )
                }

                {
                    hasAgainstCiv && !rowsAgainstCiv && Array(8).fill(0).map((a, i) =>
                        <View key={i} style={styles.row}>
                            <TextLoader style={styles.cellLeaderboard}/>
                            <TextLoader style={styles.cellGames}/>
                            <TextLoader style={styles.cellWon}/>
                        </View>
                    )
                }
            </View>
    )
}


const padding = 5;

const useStyles = createStylesheet(theme => StyleSheet.create({
    cellLeaderboard: {
        // backgroundColor: 'red',
        margin: padding,
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cellGames: {
        margin: padding,
        flex: 1,
        textAlign: 'right',
        fontVariant: ['tabular-nums'],
    },
    cellWon: {
        margin: padding,
        flex: 1,
        textAlign: 'right',
        fontVariant: ['tabular-nums'],
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
}));

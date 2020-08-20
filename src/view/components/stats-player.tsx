import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IMatch, IPlayer, validMatch} from "../../helper/data";
import {TextLoader} from "./loader/text-loader";
import {orderBy, uniqBy} from "lodash-es";
import {getFlagIcon} from "../../helper/flags";
import {composeUserId, sameUser, UserIdBase, userIdFromBase} from "../../helper/user";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App";
import {MyText} from "./my-text";
import {ITheme, makeVariants, useAppTheme, usePaperTheme, useTheme} from "../../theming";
import {LeaderboardId} from "../../helper/leaderboards";
import {useLazyApi} from "../../hooks/use-lazy-api";
import {loadUser} from "../../service/user";
import { sleep } from '../../helper/util';
import {IRow} from "../../service/stats/stats-player";
import {Button} from "react-native-paper";

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
    user: UserIdBase;
    leaderboardId: LeaderboardId;
    data: IData;
}

interface IData {
    rowsAlly: IRow[] | null;
    rowsOpponent: IRow[] | null;
    matches?: IMatch[] | null;
    user: UserIdBase;
    leaderboardId: LeaderboardId;
}


export default function StatsPlayer(props: IProps) {
    const styles = useTheme(variants);
    const [maxRowCountAlly, setMaxRowCountAlly] = useState(12);
    const [maxRowCountOpponent, setMaxRowCountOpponent] = useState(12);
    const theme = useAppTheme();

    const { data, user } = props;
    let { rowsAlly, rowsOpponent, matches, leaderboardId } = data || { leaderboardId: props.leaderboardId };

    const hasAlly = [LeaderboardId.DMTeam, LeaderboardId.RMTeam, LeaderboardId.Unranked].includes(leaderboardId);

    if (rowsOpponent?.length === 0) {
        return (
            <View>
                <MyText style={styles.info}>No matches yet!</MyText>
            </View>
        );
    }

    const rowsAllyLength = rowsAlly?.length;
    const rowsOpponentLength = rowsOpponent?.length;

    if (rowsAlly) {
        rowsAlly = rowsAlly?.filter((r, i) => i < maxRowCountAlly);
    }
    if (rowsOpponent) {
        rowsOpponent = rowsOpponent?.filter((r, i) => i < maxRowCountOpponent);
    }

    return (
            <View style={styles.container}>
                <View>
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

                    {
                        rowsAllyLength && rowsAllyLength > maxRowCountAlly &&
                        <Button
                            labelStyle={{fontSize: 13, marginVertical: 6}}
                            style={{marginTop: 6, marginHorizontal: 5}}
                            onPress={() => setMaxRowCountAlly(maxRowCountAlly + 20)}
                            mode="contained"
                            compact
                            uppercase={false}
                            dark={true}
                            color={theme.lightBackgroundColor}
                        >
                            Show more
                        </Button>
                    }

                    {
                        hasAlly &&
                        <MyText/>
                    }

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

                    {
                        rowsOpponentLength && rowsOpponentLength > maxRowCountOpponent &&
                        <Button
                            labelStyle={{fontSize: 13, marginVertical: 6}}
                            style={{marginTop: 6, marginHorizontal: 5}}
                            onPress={() => setMaxRowCountOpponent(maxRowCountOpponent + 20)}
                            mode="contained"
                            compact
                            uppercase={false}
                            dark={true}
                            color={theme.lightBackgroundColor}
                        >
                            Show more
                        </Button>
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
            textAlign: 'right',
            fontVariant: ['tabular-nums'],
        },
        cellWon: {
            padding: padding,
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
        countryIcon: {
            width: 21,
            height: 15,
            marginRight: 5,
        },
    });
};

const variants = makeVariants(getStyles);


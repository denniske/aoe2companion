import {StyleSheet, View} from 'react-native';
import React from 'react';
import {IMatch} from "../../helper/data";
import {TextLoader} from "./loader/text-loader";
import {UserIdBase} from "../../helper/user";
import {MyText} from "./my-text";
import {ITheme, makeVariants, useTheme} from "../../theming";
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {AoePosition, IRow} from "../../service/stats/stats-position";
import {LeaderboardId} from "../../helper/leaderboards";
import Space from "./space";

interface IRowProps {
    data: any;
}

function getPositionName(position: AoePosition) {
    return position === 'flank' ? 'Flank' : 'Pocket';
}

function Row({data}: IRowProps) {
    const styles = useTheme(variants);
    return (
            <View style={styles.row}>
                <View style={styles.cellLeaderboard}>
                    <View style={styles.icon}>
                        <Icon5 name={data.position == 'flank' ? 'fist-raised' : 'first-aid'} size={14} />
                    </View>
                    <MyText>{getPositionName(data.position)}</MyText>
                </View>
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
    data: IData;
    leaderboardId: LeaderboardId;
}

interface IData {
    rows: IRow[] | null;
    matches?: IMatch[] | null;
    user: UserIdBase;
    leaderboardId: LeaderboardId;
}

export default function StatsPosition(props: IProps) {
    const styles = useTheme(variants);

    const { data, user } = props;
    const { rows, leaderboardId } = data || { leaderboardId: props.leaderboardId };

    const hasPosition = [LeaderboardId.DMTeam, LeaderboardId.RMTeam].includes(leaderboardId);

    if (rows?.length === 0 || !hasPosition) {
        return <View/>;
    }

    return (
            <View style={styles.container}>
                <Space/>
                <View>
                    <View style={styles.row}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>Position</MyText>
                        <MyText numberOfLines={1} style={styles.cellGames}>Games</MyText>
                        <MyText numberOfLines={1} style={styles.cellWon}>Won*</MyText>
                    </View>

                    {
                        rows && rows.map(leaderboard =>
                            <Row key={leaderboard.position} data={leaderboard}/>
                        )
                    }

                    {
                        !rows && Array(2).fill(0).map((a, i) =>
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
            margin: padding,
            flex: 4,
            flexDirection: 'row',
            alignItems: 'center',
        },
        cellGames: {
            margin: padding,
            flex: 1,
            // textAlign: 'right',
            // fontVariant: ['tabular-nums'],
        },
        cellWon: {
            margin: padding,
            flex: 1,
            // textAlign: 'right',
            // fontVariant: ['tabular-nums'],
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor: 'yellow',
        },
        container: {
            // backgroundColor: 'red',
            marginBottom: 15,
        },
        icon: {
            width: 22,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
        },
    });
};

const variants = makeVariants(getStyles);


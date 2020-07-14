import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {IMatch, validMatch} from "../../helper/data";
import {TextLoader} from "./loader/text-loader";
import {AoeMap, getMapImage, getMapName, maps} from "../../helper/maps";
import {orderBy} from "lodash-es";
import {sameUser, UserIdBase} from "../../helper/user";
import {MyText} from "./my-text";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {useLazyApi} from "../../hooks/use-lazy-api";
import {LeaderboardId} from "../../helper/leaderboards";
import {IRow} from "../../service/stats/stats-map";


interface IRowProps {
    data: any;
}

function Row({data}: IRowProps) {
    const styles = useTheme(variants);
    return (
            <View style={styles.row}>
                <View style={styles.cellLeaderboard}>
                    <Image style={styles.icon} source={getMapImage(data.map)}/>
                    <MyText>{getMapName(data.map)}</MyText>
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
}

interface IData {
    rows: IRow[] | null;
    matches?: IMatch[] | null;
    user: UserIdBase;
}

export default function StatsMap(props: IProps) {
    const styles = useTheme(variants);

    const { data, user } = props;
    const { rows } = data || {};

    if (rows?.length === 0) {
        return <View/>;
    }

    return (
            <View style={styles.container}>
                <MyText/>
                <View>
                    <View style={styles.row}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>Map</MyText>
                        <MyText numberOfLines={1} style={styles.cellGames}>Games</MyText>
                        <MyText numberOfLines={1} style={styles.cellWon}>Won*</MyText>
                    </View>

                    {
                        rows && rows.map(leaderboard =>
                                <Row key={leaderboard.map} data={leaderboard}/>
                        )
                    }
                    <MyText/>
                    {
                        rows &&
                        <MyText style={styles.info}>*based on matches with known result</MyText>
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


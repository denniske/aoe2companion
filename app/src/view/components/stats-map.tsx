import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {IMatch} from "@nex/data/api";
import {TextLoader} from "./loader/text-loader";
import {getMapImage, getMapName, maps} from "../../helper/maps";
import {sameUser, UserIdBase} from "../../helper/user";
import {MyText} from "./my-text";
import {IRow} from "../../service/stats/stats-map";
import Space from "./space";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';


interface IRowProps {
    data: any;
}

function Row({data}: IRowProps) {
    const styles = useStyles();
    return (
            <View style={styles.row}>
                <View style={styles.cellLeaderboard}>
                    <Image fadeDuration={0} style={styles.icon} source={getMapImage(data.map)}/>
                    <MyText>{getMapName(data.map, data.ugc, data.rms, data.game_type, data.scenario)}</MyText>
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
    const styles = useStyles();

    const { data, user } = props;
    const { rows } = data || {};

    if (rows?.length === 0) {
        return <View/>;
    }

    return (
            <View style={styles.container}>
                <Space/>
                <View>
                    <View style={styles.row}>
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>{getTranslation('main.stats.heading.map')}</MyText>
                        <MyText numberOfLines={1} style={styles.cellGames}>{getTranslation('main.stats.heading.games')}</MyText>
                        <MyText numberOfLines={1} style={styles.cellWon}>{getTranslation('main.stats.heading.won')}*</MyText>
                    </View>

                    {
                        rows && rows.map(leaderboard =>
                                <Row key={leaderboard.map} data={leaderboard}/>
                        )
                    }
                    <Space/>
                    {
                        rows &&
                        <MyText style={styles.info}>*{getTranslation('main.stats.footer.note')}</MyText>
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

const useStyles = createStylesheet(theme => StyleSheet.create({
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

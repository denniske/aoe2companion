import {StyleSheet, View} from 'react-native';
import React from 'react';
import {IMatch} from "../../helper/data";
import {TextLoader} from "./loader/text-loader";
import {UserIdBase} from "../../helper/user";
import {MyText} from "./my-text";
import {useTheme} from "../../theming";
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import Space from "./space";
import {IRow} from "../../service/stats/stats-duration";
import {createStylesheet} from '../../theming-new';

interface IRowProps {
    data: IRow;
}

function Row({data}: IRowProps) {
    const styles = useStyles();
    let marginLeft = 0;
    if (data.duration == '< 5 min') {
        marginLeft = 0;
    }
    if (data.duration == '5 - 30 min') {
        marginLeft = 12.0;
    }
    if (data.duration == '30 - 60 min') {
        marginLeft = 3.0;
    }
    if (data.duration == '> 60 min') {
        marginLeft = 21.5;
    }
    return (
            <View style={styles.row}>
                <View style={styles.cellLeaderboard}>
                    <View style={styles.icon}>
                        <Icon5 name="clock" size={14} />
                    </View>
                    <MyText style={{marginLeft}}>{data.duration}</MyText>
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

export default function StatsDuration(props: IProps) {
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
                        <MyText numberOfLines={1} style={styles.cellLeaderboard}>Duration</MyText>
                        <MyText numberOfLines={1} style={styles.cellGames}>Games</MyText>
                        <MyText numberOfLines={1} style={styles.cellWon}>Won*</MyText>
                    </View>

                    {
                        rows && rows.map(row =>
                            <Row key={row.duration} data={row}/>
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
}));

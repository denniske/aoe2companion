import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {IStatAlly, IStatCiv, IStatMap, IStatOpponent} from "@nex/data/api";
import {TextLoader} from "./loader/text-loader";
import {Civ, LeaderboardId} from "@nex/data";
import {useNavigation} from "@react-navigation/native";
import {RootStackProp} from "../../../App2";
import {MyText} from "./my-text";
import Space from "./space";
import {getCivIcon} from "../../helper/civs";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {getMapImage} from "../../helper/maps";
import {CountryImage} from "./country-image";


interface IRowProps {
    data: IStatCiv & IStatMap & IStatAlly & IStatOpponent;
}

function Row({data}: IRowProps) {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    const gotoEntity = () => {
        if (data.civ) {
            navigation.push('Civ', { civ: data.civ });
        }
        if (data.profileId) {
            navigation.push('User', {
                profile_id: data.profileId,
                name: data.name,
            });
        }
    };

    const getIcon = () => {
        if (data.civ) {
            return getCivIcon(data);
        }
        if (data.map) {
            return getMapImage(data);
        }
    };

    const getName = () => {
        if (data.civ) {
            return data.civName;
        }
        if (data.map) {
            return data.mapName;
        }
        if (data.profileId) {
            return data.name;
        }
    };

    const won = data.wins / data.games * 100;

    return (
            <View style={styles.row}>
                <TouchableOpacity style={styles.cellLeaderboard} onPress={gotoEntity}>
                    <View style={styles.row}>
                        {
                            data.country &&
                            <CountryImage country={data.country} />
                        }
                        {
                            (data.civ || data.map) &&
                            <Image fadeDuration={0} style={styles.icon} source={getIcon()}/>
                        }
                        <MyText>{getName()}</MyText>
                    </View>
                </TouchableOpacity>
                <MyText style={styles.cellGames}>
                    {data.games}
                </MyText>
                <MyText style={styles.cellWon}>
                    {isNaN(won) ? '-' : won.toFixed(0) + ' %'}
                </MyText>
            </View>
    )
}


interface IProps {
    user: UserIdBase;
    title: string;
    leaderboardId: LeaderboardId;
    data: IStatCiv[];
}

export default function StatsCiv(props: IProps) {
    const styles = useStyles();

    const { data, user, title } = props;
    // let { rowsWithCiv, rowsAgainstCiv, leaderboardId } = data || { leaderboardId: props.leaderboardId };

    // const hasAgainstCiv = [LeaderboardId.RM1v1, LeaderboardId.DM1v1].includes(leaderboardId);

    console.log('data', title, data);

    if (data?.length === 0) {
        return <View/>;
    }

    // const getKey = (data: any) => {
    //     if (data.civ) {
    //         return data.civ;
    //     }
    //     if (data.map) {
    //         return data.map;
    //     }
    //     if (data.profileId) {
    //         return data.profileId;
    //     }
    // };

    return (
            <View style={styles.container}>
                <Space/>
                <View style={styles.row}>
                    <MyText numberOfLines={1} style={styles.cellLeaderboard}>{title}</MyText>
                    <MyText numberOfLines={1} style={styles.cellGames}>{getTranslation('main.stats.heading.games')}</MyText>
                    <MyText numberOfLines={1} style={styles.cellWon}>{getTranslation('main.stats.heading.won')}*</MyText>
                </View>

                {
                    data && data.map((row, i) =>
                        <Row key={i} data={row}/>
                    )
                }

                {
                    !data && Array(8).fill(0).map((a, i) =>
                        <View key={i} style={styles.row}>
                            <TextLoader style={styles.cellLeaderboard}/>
                            <TextLoader style={styles.cellGames}/>
                            <TextLoader style={styles.cellWon}/>
                        </View>
                    )
                }

                {/*{*/}
                {/*    hasAgainstCiv &&*/}
                {/*    <Space/>*/}
                {/*}*/}
                {/*{*/}
                {/*    hasAgainstCiv &&*/}
                {/*    <View style={styles.row}>*/}
                {/*        <MyText numberOfLines={1} style={styles.cellLeaderboard}>{getTranslation('main.stats.heading.againstciv')}</MyText>*/}
                {/*        <MyText numberOfLines={1} style={styles.cellGames}>{getTranslation('main.stats.heading.games')}</MyText>*/}
                {/*        <MyText numberOfLines={1} style={styles.cellWon}>{getTranslation('main.stats.heading.won')}*</MyText>*/}
                {/*    </View>*/}
                {/*}*/}

                {/*{*/}
                {/*    hasAgainstCiv && rowsAgainstCiv && rowsAgainstCiv.map(leaderboard =>*/}
                {/*            <Row key={leaderboard.civ.toString()} data={leaderboard}/>*/}
                {/*    )*/}
                {/*}*/}

                {/*{*/}
                {/*    hasAgainstCiv && !rowsAgainstCiv && Array(8).fill(0).map((a, i) =>*/}
                {/*        <View key={i} style={styles.row}>*/}
                {/*            <TextLoader style={styles.cellLeaderboard}/>*/}
                {/*            <TextLoader style={styles.cellGames}/>*/}
                {/*            <TextLoader style={styles.cellWon}/>*/}
                {/*        </View>*/}
                {/*    )*/}
                {/*}*/}
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

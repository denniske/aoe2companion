import {StyleSheet, View} from 'react-native';
import {getMatchTeams, IMatch} from '@nex/data';
import React from 'react';
import {PlayerSkeleton} from './player';
import {TextLoader} from "./loader/text-loader";
import {ImageLoader} from "./loader/image-loader";
import {ViewLoader} from "./loader/view-loader";
import {min, sortBy} from "lodash-es";
import {MyText} from './my-text';
import {useAppTheme} from "../../theming";
import {createStylesheet} from '../../theming-new';
import {getTranslation} from '../../helper/translate';
import {PlayerIntro} from "./player-intro";

interface IGameProps {
    match: IMatch;
}

// async function getLeaderboardArray(leaderboard_id: number, profile_ids: number[]) {
//     return await Promise.all(profile_ids.map(profile_id => fetchLeaderboard('aoe2de', leaderboard_id, { profile_id, count: 1 })));
// }

// Object.assign({}, ...buildingList.map((x) => ({[x.name]: x})));

export function GameIntro({match}: IGameProps) {
    const theme = useAppTheme();
    const styles = useStyles();

    // const leaderboardDict = useLazyApi(
    //     {},
    //     getLeaderboardArray, match.leaderboard_id, match.players.filter(p => p.profile_id).map(p => p.profile_id)
    // );
    //
    // useEffect(() => {
    //     leaderboardDict.reload();
    // }, []);

    if (match == null) {
        const playersInTeam1 = Array(3).fill(0);
        const playersInTeam2 = Array(3).fill(0);
        return (
            <View>
                <View style={styles.row}>
                    <ImageLoader style={styles.map}/>
                    <View style={styles.header}>
                        <TextLoader numberOfLines={1}
                                    style={[styles.matchTitle, {marginVertical: 2, height: 10}]}/>
                        <TextLoader numberOfLines={1}
                                    style={[styles.matchContent, {marginVertical: 2, height: 10}]}/>
                        <TextLoader numberOfLines={1}
                                    style={[styles.matchContent, {marginVertical: 2, height: 10}]}/>
                    </View>
                </View>
                <View style={styles.playerList}>
                    {
                        playersInTeam1.map((player, i) => <PlayerSkeleton key={i}/>)
                    }
                    <ViewLoader style={[styles.versus, {backgroundColor: '#ECE9ED'}]}/>
                    {
                        playersInTeam2.map((player, i) => <PlayerSkeleton key={i}/>)
                    }
                </View>
            </View>
        );
    }

    const teams = getMatchTeams(match);

    return (<View>
                {/*<View style={styles.row}>*/}
                {/*    <View style={styles.header}>*/}
                {/*        <BorderText numberOfLines={1} style={styles.matchTitle}>*/}
                {/*            {getMapName(match.map_type)} - {match.match_id}*/}
                {/*            {*/}
                {/*                match.server &&*/}
                {/*                <MyText style={styles.matchTitle}> - {match.server}</MyText>*/}
                {/*            }*/}
                {/*        </BorderText>*/}
                {/*        <BorderText numberOfLines={1} style={styles.matchContent}>*/}
                {/*            {getLeaderboardOrGameType(match.leaderboard_id, match.game_type)}*/}
                {/*        </BorderText>*/}
                {/*    </View>*/}
                {/*</View>*/}
                <View style={styles.playerList}>
                    {
                        sortBy(teams, ([team, players], i) => min(players.map(p => p.color))).map(([team, players], i) =>
                            <View key={team}>
                                {
                                    sortBy(players, p => p.color).map((player, j) => <PlayerIntro key={j} match={match} player={player} order={teams.length == 2 ? i % 2 : 1} />)
                                }
                                {
                                    i < teams.length-1 &&
                                    <View style={styles.versus}>
                                        <MyText style={styles.versusText}>{getTranslation('match.versus')}</MyText>
                                    </View>
                                }
                            </View>
                        )
                    }
                </View>
            </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    imageInner: {
        // backgroundColor: 'blue',
        resizeMode: "contain",
    },
    accordion: {
        // backgroundColor: 'yellow',
        paddingBottom: 20,
    },
    header: {
        marginLeft: 42,
        // backgroundColor: 'red',
        flex: 1,
    },
    map: {
        marginRight: 10,
        width: 50,
        height: 50,
    },
    row: {
        // backgroundColor: 'purple',
        flexDirection: 'row',
    },
    duration: {
        fontVariant: ['tabular-nums'],
        color: theme.textNoteColor,
    },
    speed: {
        color: theme.textNoteColor,
    },
    name: {
        flex: 1,
        color: theme.textNoteColor,
    },
    timeRow: {
        flexDirection: 'row',
        marginLeft: 60,
        marginBottom: 11,
        marginTop: -10,
    },
    matchTitle: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
    },
    matchContent: {
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
    },
    playerList: {
        flex: 1,
        // flexWrap: 'wrap',
        // paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    versus: {
        opacity: 0,
        marginLeft: 32,
        width: 20,
        marginVertical: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    versusText: {
        color: theme.textNoteColor,
        fontSize: 12,
    },
}));

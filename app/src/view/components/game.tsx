import {Image, ImageBackground, Platform, StyleSheet, Text, View} from 'react-native';
import {formatAgo, getMatchTeamsWithFreeForAll, getString, isMatchFreeForAll} from '@nex/data';
import React, {useEffect} from 'react';
import {Player, PlayerSkeleton} from './player';
import MyListAccordion from './accordion';
import {IMatch, IPlayer} from "@nex/data/api";
import { getMapImage, getMapName } from "../../helper/maps";
import {TextLoader} from "./loader/text-loader";
import {ImageLoader} from "./loader/image-loader";
import {ViewLoader} from "./loader/view-loader";
import {groupBy, min, minBy, sortBy} from 'lodash';
import {differenceInSeconds} from "date-fns";
import { MyText } from './my-text';
import {makeVariants, useAppTheme, useTheme} from "../../theming";
import {FontAwesome5} from "@expo/vector-icons";
import {sameUser, sameUserNull, UserIdBase} from "../../helper/user";
import {createStylesheet} from '../../theming-new';
import {getLeaderboardOrGameType} from '@nex/data';
import {getTranslation} from '../../helper/translate';
import {hasRecDict} from '../../api/recording';
import {useLazyApi} from '../../hooks/use-lazy-api';
import {AoeSpeed, getSpeedFactor} from '../../helper/speed';
import {appConfig} from "@nex/dataset";

interface IGameProps {
    match: IMatch;
    expanded?: boolean;
    user?: UserIdBase;
    highlightedUsers?: UserIdBase[];
}

const formatDuration = (durationInSeconds: number) => {
    if (!durationInSeconds) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(durationInSeconds / 60) % 60).toString();
    const hours = Math.abs(Math.floor(durationInSeconds / 60 / 60)).toString();
    return `${hours.length < 2 ? hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} h`;
};

export function Game({match, user, highlightedUsers, expanded = false}: IGameProps) {
    const theme = useAppTheme();
    const styles = useStyles();

    const canDownloadRecDict = useLazyApi(
        {},
        hasRecDict, match
    );

    useEffect(() => {
        if (!match) return;
        if (!expanded) return;
        if (Platform.OS !== 'web') return;
        if (canDownloadRecDict.loading || canDownloadRecDict.touched || canDownloadRecDict.error) return;
        canDownloadRecDict.reload();
    }, [match, expanded])

    if (match == null) {
        const playersInTeam1 = Array(3).fill(0);
        const playersInTeam2 = Array(3).fill(0);
        return (
            <View>
                <MyListAccordion
                    style={styles.accordion}
                    expanded={expanded}
                    left={props => (
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
                    )}
                >
                    <View style={styles.playerList}>
                        {
                            playersInTeam1.map((player, i) => <PlayerSkeleton key={i}/>)
                        }
                        <ViewLoader style={[styles.versus, {backgroundColor: '#ECE9ED'}]}/>
                        {
                            playersInTeam2.map((player, i) => <PlayerSkeleton key={i}/>)
                        }
                    </View>
                </MyListAccordion>
            </View>
        );
    }

    const freeForALl = isMatchFreeForAll(match);
    const teams = getMatchTeamsWithFreeForAll(match);

    // const teams = Object.entries(groupBy(match.players, p => p.team));

    let duration: string = '';
    if (match.started) {
        const finished = match.finished || new Date();
        duration = formatDuration(differenceInSeconds(finished, match.started) * getSpeedFactor(match.speed as AoeSpeed));
    }
    if (appConfig.game !== 'aoe2de') duration = '';

    const checkRecAvailability = () => {
        if (Platform.OS !== 'web') return;
        if (appConfig.game !== 'aoe2de') return;
        if (canDownloadRecDict.loading || canDownloadRecDict.touched || canDownloadRecDict.error) return;
        canDownloadRecDict.reload();
    };

    const canDownloadRec = (player: IPlayer) => {
        return canDownloadRecDict.data?.includes(player.profile_id);
    };

    // console.log('MATCH', match);

    return (
        <MyListAccordion
            style={styles.accordion}
            onPress={checkRecAvailability}
            expanded={expanded}
            expandable={true}
            left={props => (
                <View style={styles.row}>

                    <ImageBackground fadeDuration={0}
                                     source={getMapImage(match.map_type)}
                                     imageStyle={styles.imageInner}
                                     style={styles.map}>
                        {
                            match.players.some(p => sameUserNull(p, user) && p.won === true && (freeForALl || p.team != -1)) &&
                            <FontAwesome5 name="crown" size={14} style={{marginLeft: -7,marginTop:-4}} color="goldenrod" />
                        }
                        {
                            user == null && (match.players.some(p => p.won != null)) &&
                            <Image fadeDuration={0} source={require('../../../assets/other/SkullCrown.png')} style={{marginLeft: -6,marginTop:-4, width: 17, height: 17}} />
                        }
                        {
                            match.players.some(p => sameUserNull(p, user) && p.won === false && (freeForALl || p.team != -1)) &&
                            <FontAwesome5 name="skull" size={14} style={{marginLeft: -6,marginTop:-4}} color="grey" />
                        }
                    </ImageBackground>

                    <View style={styles.header}>
                        <MyText numberOfLines={1} style={styles.matchTitle}>
                            {getMapName(match.map_type)} - {match.match_id}
                            {
                                match.server &&
                                <MyText> - {match.server}</MyText>
                            }
                        </MyText>
                        <MyText numberOfLines={1} style={styles.matchContent}>
                            {getLeaderboardOrGameType(match.leaderboard_id, match.game_type)}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.matchContent}>
                            {
                                match.finished === null &&
                                <MyText>{duration}{expanded}</MyText>
                            }
                            {
                                (match.finished || match.finished === undefined) &&
                                <MyText>{match.started ? formatAgo(match.started) : 'none'}</MyText>
                            }
                        </MyText>
                    </View>
                </View>
            )}
        >
            <View style={styles.playerList}>
                {
                    appConfig.game === 'aoe2de' &&
                    <View style={[styles.timeRow, {alignItems: 'center'}]}>
                        <FontAwesome5 name="clock" size={11.5} color={theme.textNoteColor}/>
                        <MyText style={styles.duration}> {duration}   </MyText>
                        <FontAwesome5 name="running" size={11.5} color={theme.textNoteColor}/>
                        <MyText style={styles.speed}> {getString('speed', match.speed)}   </MyText>
                        {/*{*/}
                        {/*    __DEV__ &&*/}
                        {/*    <>*/}
                        {/*        <FontAwesome5 name="database" size={11.5} color={theme.textNoteColor}/>*/}
                        {/*        <MyText style={styles.speed}> {match.source}</MyText>*/}
                        {/*    </>*/}
                        {/*}*/}
                        {/*{*/}
                        {/*    !__DEV__ && match.name !== 'AUTOMATCH' &&*/}
                        {/*    <>*/}
                        {/*        <MyText style={styles.name} numberOfLines={1}> {match.name}</MyText>*/}
                        {/*    </>*/}
                        {/*} */}
                        {
                            match.name !== 'AUTOMATCH' &&
                            <>
                                <MyText style={styles.name} numberOfLines={1}> {match.name}</MyText>
                            </>
                        }
                    </View>
                }
                {
                    sortBy(teams, ([team, players], i) => min(players.map(p => p.color))).map(([team, players], i) =>
                        <View key={team}>
                            {
                                sortBy(players, p => p.color).map((player, j) => <Player key={j} highlight={highlightedUsers?.some(hu => sameUser(hu, player))} match={match} player={player} freeForALl={freeForALl} canDownloadRec={canDownloadRec(player)}/>)
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
        </MyListAccordion>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    imageInner: appConfig.game === 'aoe2de' ? {
        // backgroundColor: 'blue',
        resizeMode: "contain",
    } : {
        resizeMode: "contain",
        // borderColor: '#3A506A',
        borderColor: '#C19049',
        borderWidth: 1.2,
    },
    accordion: {
        // backgroundColor: 'yellow',
        paddingBottom: 20,
    },
    header: {
        // backgroundColor: 'red',
        flex: 1,
    },
    map: appConfig.game === 'aoe2de' ? {
        marginRight: 10,
        width: 50,
        height: 50,
    } : {
        marginRight: 10,
        width: 50,
        height: 50,
        // transform: [{ scale: 0.9 }, { translateX: -7 }, { translateY: 6 }, { rotate: "-45deg" }],
        transform: [{ scale: 1.06 }, { translateX: -5 }, { translateY: 4 }],
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
        fontWeight: '700',
        flex: 1,
    },
    matchContent: {
        flex: 1,
    },
    playerList: {
        flex: 1,
        paddingTop: 20,
    },
    versus: {
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

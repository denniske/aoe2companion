import {Image, ImageBackground, Platform, StyleSheet, Text, View} from 'react-native';
import {getString} from '../../helper/strings';
import {formatAgo, IPlayer} from '@nex/data';
import React, {useEffect} from 'react';
import {Player, PlayerSkeleton} from './player';
import MyListAccordion from './accordion';
import {IMatch} from "@nex/data";
import { getMapImage, getMapName } from "../../helper/maps";
import {TextLoader} from "./loader/text-loader";
import {ImageLoader} from "./loader/image-loader";
import {ViewLoader} from "./loader/view-loader";
import {groupBy, min, minBy, sortBy} from "lodash-es";
import {differenceInSeconds} from "date-fns";
import { MyText } from './my-text';
import {makeVariants, useAppTheme, useTheme} from "../../theming";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import {sameUser, sameUserNull, UserIdBase} from "../../helper/user";
import {createStylesheet} from '../../theming-new';
import {getLeaderboardOrGameType} from '@nex/data';
import {getTranslation} from '../../helper/translate';
import {hasRecDict} from '../../api/recording';
import {useLazyApi} from '../../hooks/use-lazy-api';

interface IGameProps {
    data: IMatch;
    expanded?: boolean;
    user?: UserIdBase;
    highlightedUsers?: UserIdBase[];
}

const formatDuration = (start: Date, finish: Date) => {
    const diffTime = differenceInSeconds(finish, start);
    if (!diffTime) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(diffTime / 60) % 60).toString();
    const hours = Math.abs(Math.floor(diffTime / 60 / 60)).toString();
    return `${hours.length < 2 ? hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} h`;
};


function matchIsFreeForAll(match: IMatch) {
    return match.players.filter(p => p.team === -1).length >= match.players.length-1;
}

export function Game({data, user, highlightedUsers, expanded = false}: IGameProps) {
    const theme = useAppTheme();
    const styles = useStyles();

    const canDownloadRecDict = useLazyApi(
        {},
        hasRecDict, data
    );

    useEffect(() => {
        if (!data) return;
        if (!expanded) return;
        if (Platform.OS !== 'web') return;
        if (canDownloadRecDict.loading || canDownloadRecDict.touched || canDownloadRecDict.error) return;
        canDownloadRecDict.reload();
    }, [data, expanded])

    if (data == null) {
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

    const freeForALl = matchIsFreeForAll(data);

    let teamIndex = 5;
    const teams = Object.entries(groupBy(data.players, p => {
        if (freeForALl) return -1;
        if (p.team != -1) return p.team;
        return teamIndex++;
    }));

    // const teams = Object.entries(groupBy(data.players, p => p.team));

    let duration: string = '';
    if (data.started) {
        const finished = data.finished || new Date();
        duration = formatDuration(data.started, finished);
    }

    const checkRecAvailability = () => {
        if (Platform.OS !== 'web') return;
        if (canDownloadRecDict.loading || canDownloadRecDict.touched || canDownloadRecDict.error) return;
        canDownloadRecDict.reload();
    };

    const canDownloadRec = (player: IPlayer) => {
        return canDownloadRecDict.data?.includes(player.profile_id);
    };

    return (
        <MyListAccordion
            style={styles.accordion}
            onPress={checkRecAvailability}
            expanded={expanded}
            expandable={true}
            left={props => (
                <View style={styles.row}>

                    <ImageBackground fadeDuration={0}
                                     source={getMapImage(data.map_type)}
                                     imageStyle={styles.imageInner}
                                     style={styles.map}>
                        {
                            data.players.some(p => sameUserNull(p, user) && p.won === true && (freeForALl || p.team != -1)) &&
                            <IconFA5 name="crown" size={14} style={{marginLeft: -7,marginTop:-4}} color="goldenrod" />
                        }
                        {
                            user == null && (data.players.some(p => p.won != null)) &&
                            <Image fadeDuration={0} source={require('../../../assets/other/SkullCrown.png')} style={{marginLeft: -6,marginTop:-4, width: 17, height: 17}} />
                        }
                        {
                            data.players.some(p => sameUserNull(p, user) && p.won === false && (freeForALl || p.team != -1)) &&
                            <IconFA5 name="skull" size={14} style={{marginLeft: -6,marginTop:-4}} color="grey" />
                        }
                    </ImageBackground>

                    <View style={styles.header}>
                        <MyText numberOfLines={1} style={styles.matchTitle}>
                            {getMapName(data.map_type)} - {data.match_id}
                            {
                                data.server &&
                                <MyText> - {data.server}</MyText>
                            }
                        </MyText>
                        <MyText numberOfLines={1} style={styles.matchContent}>
                            {getLeaderboardOrGameType(data.leaderboard_id, data.game_type)}
                        </MyText>
                        <MyText numberOfLines={1} style={styles.matchContent}>
                            {
                                !data.finished &&
                                <MyText>{duration}{expanded}</MyText>
                            }
                            {
                                data.finished &&
                                <MyText>{data.started ? formatAgo(data.started) : 'none'}</MyText>
                            }
                        </MyText>
                    </View>
                </View>
            )}
        >
            <View style={styles.playerList}>
                <View style={[styles.timeRow, {alignItems: 'center'}]}>
                    <IconFA5 name="clock" size={11.5} color={theme.textNoteColor}/>
                    <MyText style={styles.duration}> {duration}   </MyText>
                    <IconFA5 name="running" size={11.5} color={theme.textNoteColor}/>
                    <MyText style={styles.speed}> {getString('speed', data.speed)}   </MyText>
                    {/*{*/}
                    {/*    __DEV__ &&*/}
                    {/*    <>*/}
                    {/*        <IconFA5 name="database" size={11.5} color={theme.textNoteColor}/>*/}
                    {/*        <MyText style={styles.speed}> {data.source}</MyText>*/}
                    {/*    </>*/}
                    {/*}*/}
                    {/*{*/}
                    {/*    !__DEV__ && data.name !== 'AUTOMATCH' &&*/}
                    {/*    <>*/}
                    {/*        <MyText style={styles.name} numberOfLines={1}> {data.name}</MyText>*/}
                    {/*    </>*/}
                    {/*} */}
                    {
                        data.name !== 'AUTOMATCH' &&
                        <>
                            <MyText style={styles.name} numberOfLines={1}> {data.name}</MyText>
                        </>
                    }
                </View>
                {
                    sortBy(teams, ([team, players], i) => min(players.map(p => p.color))).map(([team, players], i) =>
                        <View key={team}>
                            {
                                sortBy(players, p => p.color).map((player, j) => <Player key={j} highlight={highlightedUsers?.some(hu => sameUser(hu, player))} match={data} player={player} freeForALl={freeForALl} canDownloadRec={canDownloadRec(player)}/>)
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
    imageInner: {
        // backgroundColor: 'blue',
        resizeMode: "contain",
    },
    accordion: {
        // backgroundColor: 'yellow',
        paddingBottom: 20,
    },
    header: {
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

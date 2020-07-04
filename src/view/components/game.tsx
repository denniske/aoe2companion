import {Image, StyleSheet, Text, View} from 'react-native';
import {getString} from '../../helper/strings';
import {formatAgo} from '../../helper/util';
import React from 'react';
import {Player, PlayerSkeleton} from './player';
import MyListAccordion from './accordion';
import {IMatch} from "../../helper/data";
import {getMapImage} from "../../helper/maps";
import {TextLoader} from "../loader/text-loader";
import {ImageLoader} from "../loader/image-loader";
import {ViewLoader} from "../loader/view-loader";
import {groupBy} from "lodash-es";

interface IGameProps {
    data: IMatch;
    expanded: boolean;
}

export function Game({data, expanded}: IGameProps) {
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

    const teams = Object.entries(groupBy(data.players, p => p.team));

    return (
        <MyListAccordion
            style={styles.accordion}
            expanded={expanded}
            left={props => (
                <View style={styles.row}>
                    <Image style={styles.map} source={getMapImage(data.map_type)}/>
                    <View style={styles.header}>
                        <Text numberOfLines={1} style={styles.matchTitle}>
                            {getString('map_type', data.map_type)} - {data.match_id} - {data.server}
                        </Text>
                        <Text numberOfLines={1} style={styles.matchContent}>
                            {getString('leaderboard', data.leaderboard_id)}
                        </Text>
                        <Text numberOfLines={1} style={styles.matchContent}>
                            {data.started ? formatAgo(data.started) : 'none'}
                        </Text>
                    </View>
                </View>
            )}
        >
            <View style={styles.playerList}>
                {
                    teams.map(([team, players], i) =>
                        <View key={team}>
                            {
                                players.map((player, j) => <Player key={j} player={player}/>)
                            }
                            {
                                i < teams.length-1 &&
                                <View style={styles.row}>
                                    {/*<View style={styles.versus2}/>*/}
                                    <View style={styles.versus}>
                                        <Text style={styles.versusText}>VS</Text>
                                    </View>
                                    <View style={styles.versus2}/>
                                </View>
                            }
                        </View>
                    )
                }
            </View>
        </MyListAccordion>
    );
}

const styles = StyleSheet.create({
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
    matchTitle: {
        fontWeight: 'bold',
        flex: 1,
        // paddingVertical: 2,
    },
    matchContent: {
        flex: 1,
        // marginVertical: 2,
    },
    playerList: {
        flex: 1,
        paddingTop: 20,
        // backgroundColor: 'purple'
    },
    versus: {
        // borderRadius: 10000,
        // backgroundColor: 'grey',
        // color: 'white',
        // width: 25,
        // height: 20,
        // color: 'black',
        margin: 10,
        marginLeft: 35,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    versus2: {
        // borderRadius: 10000,
        // backgroundColor: 'grey',
        // backgroundColor: '#999',
        color: 'white',
        // width: 25,
        flex: 1,
        height: 1,
        margin: 10,
        // justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    versusText: {
        // color: 'white',
        color: '#666',
        fontSize: 12,
    },
    // versus: {
    //     borderRadius: 10000,
    //     backgroundColor: 'grey',
    //     color: 'white',
    //     width: 25,
    //     height: 25,
    //     margin: 10,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     alignSelf: 'center'
    // },
    // versusText: {
    //     color: 'white',
    //     fontSize: 12,
    // },
});

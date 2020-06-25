import {Image, StyleSheet, Text, View} from 'react-native';
import { getString } from '../../helper/strings';
import { formatAgo } from '../../helper/util';
import React, { useState } from 'react';
import { Player } from './player';
import MyListAccordion from './accordion';
import ContentLoader, { Rect } from 'react-content-loader/native';
import OverlayContainer from './overlay-container';
import {IMatch} from "../../helper/data";
import {getCivIcon} from "../../helper/civs";
import {getMapImage} from "../../helper/maps";

interface IGameProps {
    data: IMatch;
    expanded: boolean;
}

const MyLoader = ({expanded}: any) => {
    if (expanded) {
        return (
                <ContentLoader viewBox="0 0 350 300" width={350} height={300}>
                    <Rect x="0" y={0 * 20 + 3} rx="3" ry="3" width="200" height="15"/>
                    <Rect x="0" y={1 * 20 + 3} rx="3" ry="3" width="150" height="15"/>
                    <Rect x="0" y={2 * 20 + 3} rx="3" ry="3" width="100" height="15"/>
                    <Rect x="326" y={15} rx="3" ry="3" width="25" height="25"/>

                    <Rect x="0" y={0 * 26 + 74} rx="3" ry="3" width="170" height="15"/>
                    <Rect x="0" y={1 * 26 + 74} rx="3" ry="3" width="170" height="15"/>
                    <Rect x="0" y={2 * 26 + 74} rx="3" ry="3" width="170" height="15"/>
                    <Rect x="235" y={0 * 26 + 74} rx="3" ry="3" width={350-235} height="15"/>
                    <Rect x="235" y={1 * 26 + 74} rx="3" ry="3" width={350-235} height="15"/>
                    <Rect x="235" y={2 * 26 + 74} rx="3" ry="3" width={350-235} height="15"/>
                    <Rect x="155" y={155} rx="3" ry="3" width="25" height="25"/>
                    <Rect x="0" y={0 * 26 + 198} rx="3" ry="3" width="170" height="15"/>
                    <Rect x="0" y={1 * 26 + 198} rx="3" ry="3" width="170" height="15"/>
                    <Rect x="0" y={2 * 26 + 198} rx="3" ry="3" width="170" height="15"/>
                    <Rect x="235" y={0 * 26 + 198} rx="3" ry="3" width={350-235} height="15"/>
                    <Rect x="235" y={1 * 26 + 198} rx="3" ry="3" width={350-235} height="15"/>
                    <Rect x="235" y={2 * 26 + 198} rx="3" ry="3" width={350-235} height="15"/>
                </ContentLoader>
        );
    } else {
        return (
                <ContentLoader viewBox="0 0 350 65" width={350} height={65}>
                    <Rect x="0" y={0 * 20 + 3} rx="3" ry="3" width="200" height="15"/>
                    <Rect x="0" y={1 * 20 + 3} rx="3" ry="3" width="150" height="15"/>
                    <Rect x="0" y={2 * 20 + 3} rx="3" ry="3" width="100" height="15"/>
                    <Rect x="326" y={15} rx="3" ry="3" width="25" height="25"/>
                </ContentLoader>
        );
    }
};

export function Game({data, expanded}: IGameProps) {
    if (!data) {
        return <View><MyLoader expanded={expanded}/></View>;
    }

    const playersInTeam1 = data.players.filter(p => p.team == 1);
    const playersInTeam2 = data.players.filter(p => p.team == 2);

    return (
            // <OverlayContainer behind={<MyLoader expanded={expanded}/>} front={

                        <View>
                            <MyListAccordion
                                    expanded={expanded}
                                    left={props => (
                                            <View style={styles.row}>
                                                <Image style={styles.map} source={getMapImage(data.map_type)} />
                                                <View>
                                                    <Text style={styles.matchTitle}>{getString('map_type', data.map_type)} - {data.match_id} - {data.server}</Text>
                                                    <Text>{getString('leaderboard', data.leaderboard_id)}</Text>
                                                    <Text>{data.started ? formatAgo(data.started):'none'}</Text>
                                                </View>
                                            </View>
                                    )}
                            >
                                <View>
                                    {
                                        playersInTeam1.map((v, i) =>
                                                <Player key={playersInTeam1[i].profile_id} player={playersInTeam1[i]}/>
                                        )
                                    }

                                    <View style={styles.versus}>
                                        <Text style={styles.versusText}>VS</Text>
                                    </View>

                                    {
                                        playersInTeam2.map((v, i) =>
                                                <Player key={playersInTeam2[i].profile_id} player={playersInTeam2[i]}/>
                                        )
                                    }
                                </View>
                            </MyListAccordion>
                        </View>

            // }></OverlayContainer>

    );
}

const styles = StyleSheet.create({
    map: {
        marginRight: 10,
        width: 50,
        height: 50,
    },
    row: {
        flexDirection: 'row',
    },
    matchTitle: {
        fontWeight: 'bold',
    },
    versus: {
        borderRadius: 10000,
        backgroundColor: 'grey',
        color: 'white',
        width: 25,
        height: 25,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    versusText: {
        color: 'white',
        fontSize: 12,
    },
});

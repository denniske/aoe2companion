import { StyleSheet, Text, View } from 'react-native';
import { getString } from '../../helper/strings';
import { formatAgo } from '../../helper/util';
import React, { useState } from 'react';
import { Player } from './player';
import MyListAccordion from './accordion';

interface IGameProps {
    data: IMatch;
    expanded: boolean;
}

export function Game({data, expanded}: IGameProps) {
    const playersInTeam1 = data.players.filter(p => p.team == 1);
    const playersInTeam2 = data.players.filter(p => p.team == 2);

    return (

            <View>
                <MyListAccordion
                        expanded={expanded}
                        left={props => (
                                <View>
                                    <Text style={styles.matchTitle}>{getString('map_type', data.map_type)} - {data.match_id} - {data.server}</Text>
                                    <Text>{getString('leaderboard', data.leaderboard_id)}</Text>
                                    <Text>{data.started ? formatAgo(data.started):'none'}</Text>
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
    );
}

const styles = StyleSheet.create({
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

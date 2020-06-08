import { StyleSheet, Text, View } from 'react-native';
import { getString } from '../../helper/strings';
import { formatAgo } from '../../helper/util';
import React from 'react';
import { Player } from './player';

interface IGameProps {
    data: IMatch;
}

export function Game({data}: IGameProps) {
    const playersInTeam1 = data.players.filter(p => p.team == 1);
    const playersInTeam2 = data.players.filter(p => p.team == 2);

    return (
            <View>
                <Text style={styles.matchTitle}>{getString('map_type', data.map_type)} - {data.match_id} - {data.server}</Text>
                <Text>{getString('leaderboard', data.leaderboard_id)}</Text>
                <Text>{data.started ? formatAgo(data.started):'none'}</Text>

                <Text/>

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
                <Text/>
                <Text/>
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

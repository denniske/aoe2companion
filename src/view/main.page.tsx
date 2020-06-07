import React, { useEffect, useState } from 'react';
import { Button, Image, Picker, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { formatAgo } from '../service/util';
import { getCivIcon } from '../service/civs';
import { getPlayerBackgroundColor } from '../service/colors';
import { fetchLastMatch } from '../api/lastmatch';
import { getString } from '../service/strings';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { RouteProp } from '@react-navigation/native';
import Header from './header';
import Constants from 'expo-constants';

interface IPlayerProps {
    player: IPlayer;
}

interface IGameProps {
    data: ILastMatch;
}

export function Player({player}: IPlayerProps) {
    const boxStyle = StyleSheet.flatten([styles.square, {backgroundColor: getPlayerBackgroundColor(player.color)}]);

    return (
            <View style={styles.player}>
                <View style={boxStyle}>
                    <Text>{player.color}</Text>
                </View>

                <Text style={styles.playerName}> {player.rating} {player.name}</Text>

                <Image style={styles.civIcon} source={getCivIcon(player.civ)}/>
                <Text> {getString('civ', player.civ)}</Text>
            </View>
    );
}

export function Game({data}: IGameProps) {
    const playersInTeam1 = data.players.filter(p => p.team == 1);
    const playersInTeam2 = data.players.filter(p => p.team == 2);

    return (
            <View>
                <Text>{getString('leaderboard', data.leaderboard_id)}</Text>
                <Text>{getString('map_type', data.map_type)} - {data.match_id} - {data.server}</Text>
                <Text>{formatAgo(data.started)}</Text>
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
            </View>
    );
}

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Main'>;
    route: RouteProp<RootStackParamList, 'Main'>;
};

export default function MainPage({navigation}: Props) {

    console.log("navigation1", navigation);

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(null as unknown as ILastMatch);

    const game = 'aoe2de';
    const steam_id = '76561197995781128';
    const profile_id = '209525';

    const loadData = async () => {
        const lastMatch = await fetchLastMatch(game, profile_id);
        setData(lastMatch);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
            <SafeAreaView style={styles.container}>

                {/*<Header/>*/}

                <View style={styles.content}>
                    <Text/>
                    <Button
                            title="Go to Jane's profile"
                            onPress={() =>
                                    navigation.navigate('Name', {name: 'Jane'})
                            }
                    />

                    <Text/>

                    <Text>AoE II Companion</Text>
                    <Text/>
                    {
                        data &&
                        <Game data={data}/>
                    }
                </View>

            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    square: {
        flexGrow: 0,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'red',
        flexDirection: 'row',
        marginRight: 3
    },
    playerName: {
        width: 150,
    },
    civIcon: {
        width: 20,
        height: 20,
    },
    player: {
        flexDirection: 'row',
        padding: 3
    },
    versus: {
        borderRadius: 10000,
        backgroundColor: 'grey',
        color: 'white',
        width: 30,
        height: 30,
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    versusText: {
        color: 'white',
    },
    container: {
        marginTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignSelf: 'center',
    },
});

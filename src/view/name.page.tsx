import React, { useEffect, useState } from 'react';
import { fetchLastMatch } from '../api/lastmatch';
import { Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Game } from './main.page';
import { fetchLeaderboard } from '../api/leaderboard';
import { formatAgo } from '../helper/util';
import Constants from 'expo-constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Link, RouteProp } from '@react-navigation/native';

interface IPlayerProps {
    player: ILeaderboardPlayer;
}

function Player({player}: IPlayerProps) {

    const doSomething = () => {
        console.log("Do Something");
    };

    const _onPressButton = () => {
        alert('You tapped the button!')
    };

    return (


            <TouchableHighlight onPress={_onPressButton} underlayColor="white">
                <View style={styles.row}>
                    <Text style={styles.cellRating}>{player.rating}</Text>
                    <Text style={styles.cellCountry}>{player.country}</Text>
                    <Text style={styles.cellName}>{player.name}</Text>
                    <Text style={styles.cellGames}>{player.games}</Text>
                    <Text style={styles.cellLastMatch}>{formatAgo(player.last_match)}</Text>
                    {/*<Button title="asd" onPress={doSomething}></Button>*/}
                </View>
            </TouchableHighlight>

    )
}


type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Name'>;
    route: RouteProp<RootStackParamList, 'Name'>;
};

export default function NamePage({navigation, route}: Props) {
    console.log("navigation2", navigation);
    console.log("route2", route);
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(null as unknown as ILeaderboard);
    const [text, setText] = useState('rogge');

    const game = 'aoe2de';
    const steam_id = '76561197995781128';
    const leaderboard_id = '4';
    // const search = 'rogge';

    const loadData = async () => {
        const leaderboard = await fetchLeaderboard(game, leaderboard_id, { count: 50, search: text });
        setData(leaderboard);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [text]);

    return (
            <View style={styles.container}>
                <Text>Enter your AoE username to track your games:</Text>

                <TextInput
                        style={{height: 50}}
                        placeholder="username"
                        onChangeText={text => setText(text)}
                        defaultValue={text}
                />

                <View style={styles.headerRow}>
                    <Text style={styles.cellRating}>Elo</Text>
                    <Text style={styles.cellCountry}> </Text>
                    <Text style={styles.cellName}>Name</Text>
                    <Text style={styles.cellGames}>Games</Text>
                    <Text style={styles.cellLastMatch}>Last Match</Text>
                </View>

                {
                    data &&
                    <FlatList
                        data={data.leaderboard}
                        renderItem={({ item }) => <Player player={item}/>}
                        keyExtractor={(item, index) => index.toString()}
                    />
                }

                {/*{*/}
                {/*    data && data.leaderboard.map((player, i) =>*/}
                {/*            <Player key={i} player={player}/>*/}
                {/*    )*/}
                {/*}*/}

            </View>
    );
}

const styles = StyleSheet.create({
    button: {
        marginBottom: 30,
        width: 260,
        alignItems: 'center',
        backgroundColor: '#2196F3'
    },
    buttonText: {
        textAlign: 'center',
        padding: 20,
        color: 'white'
    },
    cellRating: {
        width: 40,
    },
    cellCountry: {
        width: 30,
    },
    cellName: {
        width: 110,
    },
    cellGames: {
        width: 60,
    },
    cellLastMatch: {
        width: 110,
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: 3,
        padding: 3,
        borderRadius: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 3,
        borderColor: '#CCC',
        borderWidth: 1,
        padding: 3,
        borderRadius: 5,
        backgroundColor: '#EEE',
        // borderBottomColor: '#CCC',
        // borderBottomWidth: 1,
    },
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

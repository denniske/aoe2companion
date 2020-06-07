import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, Modal, Picker, SafeAreaView, ScrollView, StyleSheet, Text, TextStyle, TouchableHighlight, View } from 'react-native';
import { formatAgo } from '../service/util';
import { getCivIcon } from '../service/civs';
import { getPlayerBackgroundColor } from '../service/colors';
import { fetchLastMatch } from '../api/lastmatch';
import { getString } from '../service/strings';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Link, RouteProp } from '@react-navigation/native';
import Header from './header';
import Constants from 'expo-constants';
import { printUserId } from '../service/user';
import { fetchMatches } from '../api/matches';
import { AppSettings } from '../service/constants';
import { fetchLeaderboard } from '../api/leaderboard';
import Profile, { IProfile } from './profile';

interface IPlayerProps {
    player: IPlayer;
}

interface IGameProps {
    data: IMatch;
}

export function Player({player}: IPlayerProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const boxStyle = StyleSheet.flatten([styles.square, {backgroundColor: getPlayerBackgroundColor(player.color)}]);

    const isCurrentPlayer = player.steam_id === AppSettings.steam_id || player.profile_id === AppSettings.profile_id;
    const playerNameStyle = StyleSheet.flatten([styles.playerName, {textDecorationLine: isCurrentPlayer ? 'underline':'none'}]) as TextStyle;
    // const playerNameStyle = StyleSheet.flatten([styles.playerName, {fontWeight: isCurrentPlayer ? 'bold':'normal'}]) as TextStyle;

    const openRatingModal = () => {
        setModalVisible(true);
    };

    return (
            <View style={styles.player}>

                <Modal
                        animationType="none"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            alert("Modal has been closed.");
                        }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Rating Graph</Text>

                            <TouchableHighlight
                                    style={{...styles.openButton, backgroundColor: "#2196F3"}}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}
                            >
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                <Text style={styles.playerWon}>{player.won ? '👑':''}</Text>

                <View style={boxStyle}>
                    <Text>{player.color}</Text>
                </View>

                <TouchableHighlight onPress={openRatingModal} underlayColor="white">
                    <Text style={styles.playerRating}>{player.rating}</Text>
                </TouchableHighlight>


                <Link to={'/profile/' + printUserId(player) + '/' + player.name} style={playerNameStyle}>{player.name}</Link>


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



type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Main'>;
    route: RouteProp<RootStackParamList, 'Main'>;
};

export default function MainPage({navigation}: Props) {

    console.log("navigation1", navigation);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null as unknown as IMatch[]);

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profile, setProfile] = useState(null as unknown as IProfile);

    const game = 'aoe2de';
    const steam_id = '76561197995781128';
    const profile_id = 209525;

    const loadData = async () => {
        setLoading(true);
        // const lastMatch = await fetchLastMatch(game, profile_id);
        const lastMatch = await fetchMatches(game, profile_id, 0, 10);
        setData(lastMatch);
        setLoading(false);
    };

    const loadProfile = async () => {
        setLoadingProfile(true);

        let leaderboards = await Promise.all([
            fetchLeaderboard(game, '0', { count: 1, profile_id }),
            fetchLeaderboard(game, '1', { count: 1, profile_id }),
            fetchLeaderboard(game, '2', { count: 1, profile_id }),
            fetchLeaderboard(game, '3', { count: 1, profile_id }),
            fetchLeaderboard(game, '4', { count: 1, profile_id }),
        ]);

        const leaderboardInfos = leaderboards.flatMap(l => l.leaderboard);
        leaderboardInfos.sort((a, b) => b.last_match.getTime() - a.last_match.getTime());
        const mostRecentLeaderboard = leaderboardInfos[0];

        setProfile({
            clan: mostRecentLeaderboard.clan,
            country: mostRecentLeaderboard.country,
            icon: mostRecentLeaderboard.icon,
            name: mostRecentLeaderboard.name,
            profile_id: mostRecentLeaderboard.profile_id,
            steam_id: mostRecentLeaderboard.steam_id,
            games: leaderboardInfos.map(l => l.games).reduce((pv, cv) => pv + cv, 0),
            drops: leaderboardInfos.map(l => l.drops).reduce((pv, cv) => pv + cv, 0),
            leaderboards: leaderboards,
        });

        setLoadingProfile(false);
    };

    useEffect(() => {
        loadData();
        loadProfile();
    }, []);

    return (
            <View style={styles.container}>

                {/*<ScrollView>*/}
                    <View style={styles.content}>

                        {
                            profile &&
                            <Profile data={profile} />
                        }

                        {
                            data &&
                            <FlatList
                                    // onRefresh={loadData}
                                    // refreshing={loading}
                                data={data}
                                renderItem={({item}) => <Game data={item}/>}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        }
                    </View>
                {/*</ScrollView>*/}

            </View>
    );
}

const styles = StyleSheet.create({
    matchTitle: {
        fontWeight: 'bold',
    },
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
    playerWon: {
        // marginLeft: 5,
        width: 25,
    },
    playerRating: {
        marginLeft: 5,
        width: 35,
        // textDecorationLine: 'underline',
    },
    playerName: {
        marginLeft: 5,
        width: 140,
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
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    content: {
        flex: 1,
        alignSelf: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

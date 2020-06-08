import React, { useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TextStyle, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import { formatAgo } from '../helper/util';
import { getCivIcon } from '../helper/civs';
import { getPlayerBackgroundColor } from '../helper/colors';
import { getString } from '../helper/strings';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { Link, RouteProp } from '@react-navigation/native';
import { printUserId } from '../helper/user';
import { fetchMatches } from '../api/matches';
import { AppSettings } from '../helper/constants';
import Profile from './profile';
import Rating from './rating';
import { useApi } from '../hooks/use-api';
import { loadRatingHistories } from '../service/rating';
import { loadProfile } from '../service/profile';

interface IPlayerProps {
    player: IPlayer;
}

interface IGameProps {
    data: IMatch;
}

export function Player({player}: IPlayerProps) {
    const [modalVisible, setModalVisible] = useState(false);
    // const rating = useApi(loadRatingHistories, 'aoe2de', player.steam_id);

    const boxStyle = StyleSheet.flatten([styles.square, {backgroundColor: getPlayerBackgroundColor(player.color)}]);

    const isCurrentPlayer = player.steam_id === AppSettings.steam_id || player.profile_id === AppSettings.profile_id;
    const playerNameStyle = StyleSheet.flatten([styles.playerName, {textDecorationLine: isCurrentPlayer ? 'underline':'none'}]) as TextStyle;
    // const playerNameStyle = StyleSheet.flatten([styles.playerName, {fontWeight: isCurrentPlayer ? 'bold':'normal'}]) as TextStyle;

    const openRatingModal = () => {
        setModalVisible(true);
    };

    const closeRatingModal = () => {
        setModalVisible(false);
    };

    return (
            <View style={styles.player}>
                <Modal
                        animationType="none"
                        transparent={true}
                        visible={modalVisible}
                >
                    <TouchableWithoutFeedback onPress={closeRatingModal}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TouchableHighlight style={styles.modalCloseIcon} onPress={closeRatingModal} underlayColor="white">
                                    <Text>❌</Text>
                                </TouchableHighlight>
                                <Text style={styles.modalText}>{player.name}</Text>
                                {/*<Rating ratingHistories={rating.result}/>*/}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
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
    const game = 'aoe2de';
    const steam_id = '76561197995781128';
    const profile_id = 209525;

    const rating = useApi(loadRatingHistories, 'aoe2de', steam_id);
    const profile = useApi(loadProfile, 'aoe2de', profile_id);
    const matches = useApi(fetchMatches, game, profile_id, 0, 10);

    const parentData = matches.result ? ['profile', 'rating', ...matches.result]:['profile', 'rating'];

    return (
            <View style={styles.container}>
                <View style={styles.content}>

                    <FlatList
                            onRefresh={() => { rating.reload(); profile.reload(); matches.reload(); }}
                            refreshing={rating.loading || profile.loading || matches.loading}
                            style={styles.list}
                            data={parentData}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    case 'rating':
                                        // if (rating.result == null) return <Text>...</Text>;
                                        return <Rating ratingHistories={rating.result}/>;
                                    case 'profile':
                                        if (profile.result == null) return <Text>...</Text>;
                                        return <Profile data={profile.result}/>;
                                    default:
                                        return <Game data={item as IMatch}/>;
                                }

                            }}
                            keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    list: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
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
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    content: {
        flex: 1,
        // alignSelf: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 22,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 0,
        backgroundColor: "white",
        borderRadius: 5,
        padding: 15,
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
        textAlign: "center",
        color: 'black',
    },
    modalHeader: {
        flexDirection: 'row',
        backgroundColor: 'yellow'
    },
    modalCloseIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    }
});

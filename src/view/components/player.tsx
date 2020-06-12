import React, { useState } from 'react';
import { useLazyApi } from '../../hooks/use-lazy-api';
import { loadRatingHistories } from '../../service/rating';
import { Image, Modal, StyleSheet, Text, TextStyle, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import { getPlayerBackgroundColor } from '../../helper/colors';
import { AppSettings } from '../../helper/constants';
import Rating from '../rating';
import { Link } from '@react-navigation/native';
import { composeUserId, composeUserIdFromParts } from '../../helper/user';
import { getCivIcon } from '../../helper/civs';
import { getString } from '../../helper/strings';

interface IPlayerProps {
    player: IPlayer;
}

export function Player({player}: IPlayerProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const rating = useLazyApi(loadRatingHistories, 'aoe2de', player.steam_id);

    const boxStyle = StyleSheet.flatten([styles.square, {backgroundColor: getPlayerBackgroundColor(player.color)}]);

    const isCurrentPlayer = player.steam_id === AppSettings.steam_id || player.profile_id === AppSettings.profile_id;
    const playerNameStyle = StyleSheet.flatten([styles.playerName, {textDecorationLine: isCurrentPlayer ? 'underline':'none'}]) as TextStyle;

    const openRatingModal = () => {
        setModalVisible(true);
        rating.reload();
    };

    const closeRatingModal = () => {
        setModalVisible(false);
    };

    return (
            <View style={styles.player}>
                <Modal animationType="none" transparent={true} visible={modalVisible}>
                    <TouchableWithoutFeedback onPress={closeRatingModal}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TouchableHighlight style={styles.modalCloseIcon} onPress={closeRatingModal} underlayColor="white">
                                    <Text>❌</Text>
                                </TouchableHighlight>
                                <Text style={styles.modalText}>{player.name}</Text>
                                <Rating ratingHistories={rating.data}/>
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

                <Link to={'/user/' + composeUserIdFromParts(player.steam_id, player.profile_id) + '/' + player.name} style={playerNameStyle}>{player.name}</Link>

                <Image style={styles.civIcon} source={getCivIcon(player.civ)}/>
                <Text> {getString('civ', player.civ)}</Text>
            </View>
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
    playerWon: {
        width: 25,
    },
    playerRating: {
        marginLeft: 5,
        width: 35,
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

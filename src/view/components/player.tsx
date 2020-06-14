import React, { useState } from 'react';
import { useLazyApi } from '../../hooks/use-lazy-api';
import { loadRatingHistories } from '../../service/rating';
import { Image, Modal, StyleSheet, Text, TextStyle, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import { getPlayerBackgroundColor } from '../../helper/colors';
import { AppSettings } from '../../helper/constants';
import Rating from './rating';
import { useNavigation } from '@react-navigation/native';
import { userIdFromBase } from '../../helper/user';
import { getCivIcon } from '../../helper/civs';
import { getString } from '../../helper/strings';
import { RootStackProp } from '../../../App';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface IPlayerProps {
    player: IPlayer;
}

export function Player({player}: IPlayerProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const rating = useLazyApi(loadRatingHistories, 'aoe2de', userIdFromBase(player));

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

    const navigation = useNavigation<RootStackProp>();

    const gotoPlayer = () => {
        navigation.push('User', {
            id: userIdFromBase(player),
            name: player.name,
        });
    };

    return (
            <View style={styles.player}>
                <Modal animationType="none" transparent={true} visible={modalVisible}>
                    <TouchableWithoutFeedback onPress={closeRatingModal}>
                        <View style={styles.centeredView}>
                            <TouchableWithoutFeedback onPress={() => {}}>
                            <View style={styles.modalView}>
                                <TouchableHighlight style={styles.modalCloseIcon} onPress={closeRatingModal} underlayColor="white">
                                    <Icon name={'close'} size={24}/>
                                </TouchableHighlight>
                                <Text style={styles.modalText} numberOfLines={1}>{player.name}</Text>
                                <Rating ratingHistories={rating.data}/>
                            </View>
                            </TouchableWithoutFeedback>
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

                <TouchableHighlight onPress={gotoPlayer}>
                    <Text style={playerNameStyle}>{player.name}</Text>
                </TouchableHighlight>

                <Image style={styles.countryIcon} source={getCivIcon(player.civ)}/>
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
    countryIcon: {
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
        paddingVertical: 3,
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

import React, {useState} from 'react';
import {useLazyApi} from '../../hooks/use-lazy-api';
import {loadRatingHistories} from '../../service/rating';
import {
    Image, Modal, StyleSheet, Text, TextStyle, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';
import {getPlayerBackgroundColor} from '../../helper/colors';
import {AppSettings} from '../../helper/constants';
import Rating from './rating';
import {useNavigation} from '@react-navigation/native';
import {userIdFromBase} from '../../helper/user';
import {civs, getCivIconByIndex} from '../../helper/civs';
import {getString} from '../../helper/strings';
import {RootStackProp} from '../../../App';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {IPlayer} from "../../helper/data";
import {TextLoader} from "../loader/text-loader";
import {ImageLoader} from "../loader/image-loader";
import {ViewLoader} from "../loader/view-loader";

interface IPlayerProps {
    player: IPlayer;
}

export function PlayerSkeleton() {
    return (
        <View style={styles.player}>
            <TextLoader style={styles.playerWonCol}/>

            <TextLoader style={styles.squareCol}>
            </TextLoader>

            <TextLoader style={styles.playerRatingCol}/>

            <TextLoader style={styles.playerNameCol}/>

            <View style={styles.row}>
                {/*<ImageLoader style={styles.countryIcon}/>*/}
                <TextLoader style={{flex: 1}}/>
            </View>
        </View>
    );
}

export function Player({player}: IPlayerProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const rating = useLazyApi(loadRatingHistories, 'aoe2de', userIdFromBase(player));

    const boxStyle = StyleSheet.flatten([styles.square, {backgroundColor: getPlayerBackgroundColor(player.color)}]);

    const isCurrentPlayer = player.steam_id === AppSettings.steam_id || player.profile_id === AppSettings.profile_id;
    const playerNameStyle = StyleSheet.flatten([{textDecorationLine: isCurrentPlayer ? 'underline' : 'none'}]) as TextStyle;

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
                        <TouchableWithoutFeedback onPress={() => {
                        }}>
                            <View style={styles.modalView}>
                                <TouchableHighlight style={styles.modalCloseIcon} onPress={closeRatingModal}
                                                    underlayColor="white">
                                    <Icon name={'close'} size={24}/>
                                </TouchableHighlight>
                                <Text style={styles.modalText} numberOfLines={1}>{player.name}</Text>
                                <Rating ratingHistories={rating.data}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <View style={styles.playerWonCol}>
                <Text>{player.won ? '👑' : ''}</Text>
            </View>

            <View style={styles.squareCol}>
                <View style={boxStyle}>
                    <Text>{player.color}</Text>
                </View>
            </View>

            <TouchableHighlight style={styles.playerRatingCol} onPress={openRatingModal} underlayColor="white">
                <Text>{player.rating}</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.playerNameCol} onPress={gotoPlayer}>
                <Text style={playerNameStyle}>{player.name}</Text>
            </TouchableHighlight>

            <TouchableOpacity onPress={() => navigation.push('Civ', {civ: civs[player.civ]})}>
                <View style={styles.row}>
                    <Image style={styles.countryIcon} source={getCivIconByIndex(player.civ)}/>
                    <Text> {getString('civ', player.civ)}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    squareCol: {
        marginLeft: 5,
        width: 20,
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
    },
    playerWonCol: {
        marginLeft: 3,
        width: 22,
    },
    playerRatingCol: {
        marginLeft: 7,
        width: 35,
    },
    playerNameCol: {
        marginLeft: 5,
        flex: 1,
    },
    row: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        // backgroundColor: 'blue',
    },
    countryIcon: {
        width: 20,
        height: 20,
    },
    player: {
        flexDirection: 'row',
        padding: 3,
        // backgroundColor: 'red',
        alignItems: 'center',
        // borderColor: 'black',
        // borderWidth: 1,
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
        // backgroundColor: 'yellow'
    },
    modalCloseIcon: {
        position: 'absolute',
        right: 15,
        top: 15,
    }
});

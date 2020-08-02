import React, {useState} from 'react';
import {useLazyApi} from '../../hooks/use-lazy-api';
import {loadRatingHistories} from '../../service/rating';
import {
    Image, Modal, StyleSheet, Text, TextStyle, TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';
import {getPlayerBackgroundColor} from '../../helper/colors';
import Rating from './rating';
import {useNavigation} from '@react-navigation/native';
import {sameUserNull, userIdFromBase} from '../../helper/user';
import {civs, getCivIconByIndex} from '../../helper/civs';
import {getString} from '../../helper/strings';
import {RootStackProp} from '../../../App';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {IPlayer} from "../../helper/data";
import {TextLoader} from "./loader/text-loader";
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import {MyText} from "./my-text";
import {useSelector} from "../../redux/reducer";
import {ITheme, makeVariants, useTheme} from "../../theming";
import SimpleModal from "./simple-modal";

interface IPlayerProps {
    player: IPlayer;
}

export function PlayerSkeleton() {
    const styles = useTheme(variants);
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
    const styles = useTheme(variants);
    const auth = useSelector(state => state.auth);
    // const [modalVisible, setModalVisible] = useState(false);
    // const rating = useLazyApi({}, loadRatingHistories, 'aoe2de', userIdFromBase(player));

    const boxStyle = [styles.square, {backgroundColor: getPlayerBackgroundColor(player.color)}];

    const isCurrentPlayer = sameUserNull(player, auth);
    const playerNameStyle = [{textDecorationLine: isCurrentPlayer ? 'underline' : 'none'}] as TextStyle;

    // const openRatingModal = () => {
    //     setModalVisible(true);
    //     rating.reload();
    // };

    // const closeRatingModal = () => {
    //     setModalVisible(false);
    // };

    const navigation = useNavigation<RootStackProp>();

    const gotoPlayer = () => {
        navigation.push('User', {
            id: userIdFromBase(player),
            name: player.name,
        });
    };

    return (
        <View style={styles.player}>
            {/*<SimpleModal title={player.name} visible={modalVisible} onClose={closeRatingModal}>*/}
            {/*    <Rating ratingHistories={rating.data}/>*/}
            {/*</SimpleModal>*/}

            <TouchableOpacity style={styles.playerCol} onPress={gotoPlayer}>

                <View style={styles.playerWonCol}>
                    {
                        player.won &&
                        <IconFA5 name="crown" size={14} style={{}} color="goldenrod" />
                    }
                </View>

                <View style={styles.squareCol}>
                    <View style={boxStyle}>
                        <MyText style={styles.squareText}>{player.color}</MyText>
                    </View>
                </View>

                <MyText style={styles.playerRatingCol}>{player.rating}</MyText>
                <MyText style={[styles.playerNameCol, playerNameStyle]} numberOfLines={1}>{player.name}</MyText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.civCol} onPress={() => navigation.push('Civ', {civ: civs[player.civ]})}>
                <View style={styles.row}>
                    <Image style={styles.countryIcon} fadeDuration={0} source={getCivIconByIndex(player.civ) as any}/>
                    <MyText> {getString('civ', player.civ)}</MyText>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const getStyles = (theme: ITheme) =>
    StyleSheet.create({
        squareText: {
            color: '#333',
        },
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
            borderColor: '#333',
            backgroundColor: 'red',
            flexDirection: 'row',
        },
        playerWonCol: {
            marginLeft: 3,
            width: 22,
        },
        playerRatingCol: {
            marginLeft: 7,
            width: 38,
            letterSpacing: -0.5,
            fontVariant: ['tabular-nums'],
        },
        playerCol: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 5,
            flex: 1,
            paddingVertical: 3,
        },
        civCol: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 5,
            paddingVertical: 3,
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
            // padding: 3,
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

const variants = makeVariants(getStyles);


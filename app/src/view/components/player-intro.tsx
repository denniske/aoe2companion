import React, {useEffect, useState} from 'react';
import {Image, Linking, Platform, StyleSheet, TextStyle, TouchableOpacity, View} from 'react-native';
import {getPlayerBackgroundColorBright} from '../../helper/colors';
import {useNavigation} from '@react-navigation/native';
import {userIdFromBase} from '../../helper/user';
import {
    civDict,
    civList,
    civs,
    getCivNameById,
    IMatch,
    isBirthday,
    isVerifiedPlayer,
    moProfileId,
    noop
} from '@nex/data';
import {RootStackProp} from '../../../App';
import {getSlotTypeName, IPlayer} from "@nex/data";
import {TextLoader} from "./loader/text-loader";
import {MyText} from "./my-text";
import {createStylesheet} from '../../theming-new';
import {getUnitIcon} from "../../helper/units";


interface IPlayerProps {
    match: IMatch;
    player: IPlayer;
    highlight?: boolean;
    freeForALl?: boolean;
    canDownloadRec?: boolean;
    order: number;
}

export function PlayerSkeleton() {
    const styles = useStyles();
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

export function PlayerIntro({match, player, highlight, order}: IPlayerProps) {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    // console.log('player', player);

    const newCivStyle = [styles.newCiv, {backgroundColor: getPlayerBackgroundColorBright(player.color)}];
    const boxStyle = [styles.square, {backgroundColor: getPlayerBackgroundColorBright(player.color)}];
    const playerNameStyle = [{ fontSize: 18, fontWeight: 'bold', color: 'white', textDecorationLine: highlight ? 'underline' : 'none'}] as TextStyle;
    const containerStyle = [{ borderColor: getPlayerBackgroundColorBright(player.color)}];

    const winRate = player.wins / player.games * 100;

    return (
        <View style={[styles.player, containerStyle]}>
            {
                order == 0 &&
                <View style={styles.newCivCol}>
                    <View style={newCivStyle}>
                        <MyText style={styles.newCivText}>{getCivNameById(civList[player.civ].name)}</MyText>
                    </View>
                </View>
            }
            {
                order == 0 &&
                <View style={styles.squareCol}>
                    <View style={boxStyle}>
                        <MyText style={styles.squareText}>{player.color}</MyText>
                    </View>
                </View>
            }
            {
                order == 0 &&
                <Image fadeDuration={0} style={[styles.unitIcon, { transform: [{rotateY: '180deg'}] }]} source={getUnitIcon(civList[player.civ].uniqueUnits[0], player.color) as any}/>
            }
            <View style={styles.data}>

                <MyText style={styles.playerNameCol} numberOfLines={1}>
                    {player.slot_type != 1 ? getSlotTypeName(player.slot_type) : player.name}
                </MyText>

                <MyText style={styles.playerNameCol}>{player.rating}</MyText>
                <MyText style={styles.playerNameCol}>{winRate.toFixed(0)}% - {player.wins}W {player.games-player.wins}L</MyText>

                {/*<BorderText style={styles.playerNameCol}>R | {player.rating}</BorderText>*/}
                {/*<BorderText style={styles.playerNameCol}>{winRate.toFixed(0)}% | {player.wins}W {player.games-player.wins}L</BorderText>*/}

            </View>
            {
                order == 1 &&
                <Image fadeDuration={0} style={styles.unitIcon} source={getUnitIcon(civList[player.civ].uniqueUnits[0], player.color) as any}/>
            }
            {
                order == 1 &&
                <View style={[styles.squareCol, { right: 0 }]}>
                    <View style={boxStyle}>
                        <MyText style={styles.squareText}>{player.color}</MyText>
                    </View>
                </View>
            }
            {
                order == 1 &&
                <View style={[styles.newCivCol, { right: 0 }]}>
                    <View style={newCivStyle}>
                        <MyText style={styles.newCivText}>{getCivNameById(civList[player.civ].name)}</MyText>
                    </View>
                </View>
            }
        </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    verifiedIcon: {
        marginLeft: 5,
        color: theme.linkColor,
    },
    skullIcon: {
        marginLeft: 2,
    },
    squareText: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
        paddingBottom: 2,
        paddingRight: 1,
    },
    newCivText: {
        color: '#333',
        fontSize: 10,
        fontWeight: 'bold',
        paddingBottom: 2,
        paddingRight: 1,
    },
    newCivCol: {
        position: "absolute",
        zIndex: 100,
        bottom: 0,
        // width: 20,
        // flex: 1,
        height: '100%',
        // backgroundColor: 'yellow',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    newCiv: {
        flexGrow: 0,
        paddingHorizontal: 4,
        // width: 20,
        // height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        // borderWidth: 1,
        // borderColor: '#333',
        backgroundColor: 'red',
        flexDirection: 'row',
    },
    squareCol: {
        position: "absolute",
        zIndex: 100,
        width: 20,
        flex: 1,
        height: '100%',
        background: 'yellow',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    square: {
        flexGrow: 0,
        width: 20,
        // height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        // borderWidth: 1,
        // borderColor: '#333',
        backgroundColor: 'red',
        flexDirection: 'row',
    },
    playerWonCol: {
        opacity: 0,
        marginLeft: 3,
        width: 22,
    },
    playerRecCol: {
        opacity: 0,
        marginLeft: 4,
        width: 16,
    },
    playerRatingCol: {
        marginLeft: 7,
        width: 48,
        letterSpacing: -0.5,
        fontVariant: ['tabular-nums'],
        fontWeight: 'bold',
    },
    playerCol: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 2,
        flex: 1,
        paddingVertical: 3,
    },
    civCol: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        paddingVertical: 3,
        fontWeight: 'bold',
        width: 120,
    },
    playerNameCol: {
        paddingHorizontal: 3,
        marginLeft: 5,
        flex: 1,
        paddingVertical: 1,
        fontWeight: 'bold',
        fontFamily: 'Roboto',
        color: '#DDD',
        // backgroundColor: 'blue',
    },
    playerNameColBirthday: {
        marginLeft: 5,
        flex: 0,
    },
    row: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        // width: 180,
        flex: 1,
        // backgroundColor: 'blue',
    },
    unitIcon: {
        // zIndex: 10,
        // marginRight: 30,
        width: 65,
        height: 65,
        alignSelf: 'flex-end',
    },
    countryIcon: {
        width: 24,
        height: 24,
        marginRight: 4,
    },
    player: {
        // position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#444',
        borderWidth: 3,
        borderColor: '#000',
        marginHorizontal: 20,
        marginVertical: 2,
        minWidth: 180,
    },
    data: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        // backgroundColor: 'yellow',
        width: 200,
        padding: 10,
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
}));

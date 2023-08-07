import React, {useEffect, useState} from 'react';
import {Image, Linking, Platform, StyleSheet, TextStyle, TouchableOpacity, View} from 'react-native';
import {getPlayerBackgroundColor} from '../../helper/colors';
import {useNavigation} from '@react-navigation/native';
import {userIdFromBase} from '../../helper/user';
import {civs, civsAoeNet, getCivName, getCivNameById, isBirthday, isVerifiedPlayer, moProfileId, noop} from '@nex/data';
import {RootStackProp} from '../../../App2';
import {getSlotTypeName, IPlayer, IMatch} from "@nex/data/api";
import {TextLoader} from "./loader/text-loader";
import {FontAwesome5} from "@expo/vector-icons";
import {MyText} from "./my-text";
import {getCivIconByIndex} from "../../helper/civs";
import {createStylesheet} from '../../theming-new';
import {openLink} from "../../helper/url";
import {appConfig} from "@nex/dataset";


interface IPlayerProps {
    match: IMatch;
    player: IPlayer;
    highlight?: boolean;
    freeForALl?: boolean;
    canDownloadRec?: boolean;
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

function signed(number: number) {
    if (number == null || number === 0) return '';
    return number > 0 ? '↑' + number : '↓' + Math.abs(number);
}

export function Player({match, player, highlight, freeForALl, canDownloadRec}: IPlayerProps) {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    const boxStyle = [styles.square, {backgroundColor: getPlayerBackgroundColor(player.color)}];
    const playerNameStyle = [{textDecorationLine: highlight ? 'underline' : 'none'}] as TextStyle;
    const playerRatingDiffStyle = [{color: player.rating_diff > 0 ? '#22c55e' : '#ef4444'}] as TextStyle;

    const gotoPlayer = () => {
        navigation.push('User', {
            id: userIdFromBase(player),
            name: player.name,
        });
    };

    const downloadRec = async () => {
        const url = `https://aoe.ms/replay/?gameId=${match.match_id}&profileId=${player.profile_id}`;
        await openLink(url);
    };

    return (
        <View style={styles.player}>
            <TouchableOpacity style={styles.playerCol} disabled={player.slot_type != 1} onPress={gotoPlayer}>
                <View style={styles.playerWonCol}>
                    {
                        player.won === true && (freeForALl || player.team != -1) &&
                        <FontAwesome5 name="crown" size={14} color="goldenrod" />
                    }
                    {
                        player.won === false && (freeForALl || player.team != -1) &&
                        <FontAwesome5 name="skull" size={14} style={styles.skullIcon} color="grey" />
                    }
                </View>

                {
                    appConfig.game === 'aoe2de' &&
                    <View style={styles.squareCol}>
                        <View style={boxStyle}>
                            <MyText style={styles.squareText}>{player.color}</MyText>
                        </View>
                    </View>
                }

                <MyText style={styles.playerRatingCol}>{player.rating}</MyText>

                {
                    player.profile_id === moProfileId && isBirthday() &&
                    <MyText style={[styles.playerNameColBirthday]} numberOfLines={1}>
                        🥳
                    </MyText>
                }
                <MyText style={styles.playerNameCol} numberOfLines={1}>
                    <MyText style={playerNameStyle}>
                        {player.slot_type != 1 ? getSlotTypeName(player.slot_type) : player.name}
                    </MyText>
                    {
                        player.slot_type === 1 && isVerifiedPlayer(player.profile_id) &&
                        <> <FontAwesome5 solid name="check-circle" size={14} style={styles.verifiedIcon} /></>
                    }
                </MyText>
            </TouchableOpacity>

            <MyText style={[styles.playerRatingCol, playerRatingDiffStyle]}>{signed(player.rating_diff)}</MyText>

            {
                Platform.OS === 'web' && appConfig.game === 'aoe2de' &&
                <>
                    {
                        canDownloadRec &&
                        <TouchableOpacity style={styles.playerRecCol} onPress={downloadRec}>
                            <FontAwesome5 name="cloud-download-alt" size={14} color="grey" />
                        </TouchableOpacity>
                    }
                    {
                        !canDownloadRec &&
                        <View style={styles.playerRecCol}></View>
                    }
                </>
            }

            <TouchableOpacity style={styles.civCol} onPress={() => player.civ < 10000 && navigation.push('Civ', {civ: civsAoeNet[player.civ]})}>
                <View style={appConfig.game === 'aoe2de' ? styles.row : styles.row4}>
                    <Image fadeDuration={0} style={styles.countryIcon} source={getCivIconByIndex(player.civ) as any}/>
                    <MyText numberOfLines={1} style={styles.text}>{getCivName(player.civ)}</MyText>
                </View>
            </TouchableOpacity>
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
        // backgroundColor: 'yellow',
        lineHeight: 18,
    },
    text: {
        flex: 1,
        lineHeight: 18,
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
    playerRecCol: {
        marginLeft: 4,
        width: 16,
    },
    playerRatingCol: {
        marginLeft: 7,
        width: 38,
        letterSpacing: -0.5,
        fontVariant: ['tabular-nums'],
        lineHeight: 18,
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
    },
    playerNameCol: {
        marginLeft: 5,
        flex: 1,
        lineHeight: 18,
    },
    playerNameColBirthday: {
        marginLeft: 5,
        flex: 0,
    },
    row: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        // backgroundColor: 'blue',
    },
    row4: {
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: 150,
        // backgroundColor: 'blue',
    },
    countryIcon: appConfig.game === 'aoe2de' ? {
        width: 20,
        height: 20,
        marginRight: 4,
    } : {
        width: 36,
        height: 20,
        marginRight: 8,
        marginTop: 1,
    },
    player: {
        flexDirection: 'row',
        alignItems: 'center',
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

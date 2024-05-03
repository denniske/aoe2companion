import { FontAwesome5 } from '@expo/vector-icons';
import { getCivIdByEnum, isBirthday, isVerifiedPlayer, moProfileId } from '@nex/data';
import { appConfig } from '@nex/dataset';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TextStyle, TouchableOpacity, View } from 'react-native';

import { TextLoader } from './loader/text-loader';
import { MyText } from './my-text';
import { GAME_VARIANT_AOE2ROR, IMatchNew, IPlayerNew } from '../../api/helper/api.types';
import { getCivIcon } from '../../helper/civs';
import { openLink } from '../../helper/url';
import { createStylesheet } from '../../theming-new';

interface IPlayerProps {
    match: IMatchNew;
    player: IPlayerNew;
    highlight?: boolean;
    freeForALl?: boolean;
    canDownloadRec?: boolean;
}

export function PlayerSkeleton() {
    const styles = useStyles();
    return (
        <View style={styles.player}>
            <TextLoader style={styles.playerWonCol} />

            <TextLoader style={styles.squareCol} />

            <TextLoader style={styles.playerRatingCol} />

            <TextLoader style={styles.playerNameCol} />

            <View style={styles.row}>
                {/*<ImageLoader style={styles.countryIcon}/>*/}
                <TextLoader style={{ flex: 1 }} />
            </View>
        </View>
    );
}

function signed(number: number) {
    if (number == null || number === 0) return '';
    return number > 0 ? '↑' + number : '↓' + Math.abs(number);
}

export function Player({ match, player, highlight, freeForALl, canDownloadRec }: IPlayerProps) {
    const styles = useStyles();

    const boxStyle = [styles.square, { backgroundColor: player.colorHex }];
    const playerNameStyle = [{ textDecorationLine: highlight ? 'underline' : 'none' }] as TextStyle;
    const playerRatingDiffStyle = [{ color: player.ratingDiff > 0 ? '#22c55e' : '#ef4444' }] as TextStyle;

    const gotoPlayer = () => {
        router.push(`/matches/users/${player.profileId}?name=${player.name}`);
    };

    const gotoCiv = () => {
        if (match.gameVariant === GAME_VARIANT_AOE2ROR) return;
        router.push(`/explore/civilizations/${getCivIdByEnum(player.civ)}`);
    };

    const downloadRec = async () => {
        const url = `https://aoe.ms/replay/?gameId=${match.matchId}&profileId=${player.profileId}`;
        await openLink(url);
    };

    return (
        <View style={styles.player}>
            <TouchableOpacity style={styles.playerCol} disabled={player.status != 0} onPress={gotoPlayer}>
                <View style={styles.playerWonCol}>
                    {player.won === true && (freeForALl || player.team != -1) && <FontAwesome5 name="crown" size={14} color="goldenrod" />}
                    {player.won === false && (freeForALl || player.team != -1) && (
                        <FontAwesome5 name="skull" size={14} style={styles.skullIcon} color="grey" />
                    )}
                </View>

                {appConfig.game === 'aoe2de' && (
                    <View style={styles.squareCol}>
                        <View style={boxStyle}>
                            <MyText style={styles.squareText}>{player.color}</MyText>
                        </View>
                    </View>
                )}

                <MyText style={styles.playerRatingCol}>{player.rating}</MyText>

                {player.profileId === moProfileId && isBirthday() && (
                    <MyText style={[styles.playerNameColBirthday]} numberOfLines={1}>
                        🥳
                    </MyText>
                )}
                <MyText style={styles.playerNameCol} numberOfLines={1}>
                    <MyText style={playerNameStyle}>{player.name}</MyText>
                    {player.status === 0 && isVerifiedPlayer(player.profileId) && (
                        <>
                            {' '}
                            <FontAwesome5 solid name="check-circle" size={14} style={styles.verifiedIcon} />
                        </>
                    )}
                </MyText>
            </TouchableOpacity>

            <MyText style={[styles.playerRatingCol, playerRatingDiffStyle]}>{signed(player.ratingDiff)}</MyText>

            {Platform.OS === 'web' && appConfig.game === 'aoe2de' && (
                <>
                    {canDownloadRec && (
                        <TouchableOpacity style={styles.playerRecCol} onPress={downloadRec}>
                            <FontAwesome5 name="cloud-download-alt" size={14} color="grey" />
                        </TouchableOpacity>
                    )}
                    {!canDownloadRec && <View style={styles.playerRecCol} />}
                </>
            )}

            <TouchableOpacity style={styles.civCol} onPress={gotoCiv}>
                <View style={appConfig.game === 'aoe2de' ? styles.row : styles.row4}>
                    <Image style={styles.countryIcon} source={getCivIcon(player) as any} />
                    <MyText numberOfLines={1} style={styles.text}>
                        {player.civName}
                    </MyText>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
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
        countryIcon:
            appConfig.game === 'aoe2de'
                ? {
                      width: 20,
                      height: 20,
                      marginRight: 4,
                  }
                : {
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
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalView: {
            margin: 0,
            backgroundColor: 'white',
            borderRadius: 5,
            padding: 15,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        modalText: {
            paddingVertical: 3,
            marginBottom: 15,
            textAlign: 'center',
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
        },
    })
);

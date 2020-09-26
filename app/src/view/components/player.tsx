import React from 'react';
import {Image, StyleSheet, TextStyle, TouchableOpacity, View} from 'react-native';
import {getPlayerBackgroundColor} from '../../helper/colors';
import {useNavigation} from '@react-navigation/native';
import {userIdFromBase} from '../../helper/user';
import {civs} from '@nex/data';
import {getString} from '../../helper/strings';
import {RootStackProp} from '../../../App';
import {getSlotTypeName, IPlayer} from "../../helper/data";
import {TextLoader} from "./loader/text-loader";
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import {MyText} from "./my-text";
import {ITheme, makeVariants, useTheme} from "../../theming";
import {getCivIconByIndex} from "../../helper/civs";

interface IPlayerProps {
    player: IPlayer;
    highlight?: boolean;
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

export function Player({player, highlight}: IPlayerProps) {
    const styles = useTheme(variants);
    const navigation = useNavigation<RootStackProp>();

    const boxStyle = [styles.square, {backgroundColor: getPlayerBackgroundColor(player.color)}];
    const playerNameStyle = [{textDecorationLine: highlight ? 'underline' : 'none'}] as TextStyle;

    const gotoPlayer = () => {
        navigation.push('User', {
            id: userIdFromBase(player),
            name: player.name,
        });
    };

    return (
        <View style={styles.player}>
            <TouchableOpacity style={styles.playerCol} onPress={gotoPlayer}>
                <View style={styles.playerWonCol}>
                    {
                        player.won === true && player.team != -1 &&
                        <IconFA5 name="crown" size={14} color="goldenrod" />
                    }
                    {
                        player.won === false && player.team != -1 &&
                        <IconFA5 name="skull" size={14} style={styles.skullIcon} color="grey" />
                    }
                </View>

                <View style={styles.squareCol}>
                    <View style={boxStyle}>
                        <MyText style={styles.squareText}>{player.color}</MyText>
                    </View>
                </View>

                <MyText style={styles.playerRatingCol}>{player.rating}</MyText>
                <MyText style={[styles.playerNameCol, playerNameStyle]} numberOfLines={1}>
                    {player.slot_type != 1 ? getSlotTypeName(player.slot_type) : player.name}
                </MyText>
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
        skullIcon: {
            marginLeft: 2,
        },
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
    });

const variants = makeVariants(getStyles);

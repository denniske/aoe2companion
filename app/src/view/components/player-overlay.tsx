import React from 'react';
import {Linking, StyleSheet, TextStyle, TouchableOpacity, View} from 'react-native';
import {getPlayerBackgroundColor} from '../../helper/colors';
import {useNavigation} from '@react-navigation/native';
import {userIdFromBase} from '../../helper/user';
import {
    civs, getCivNameById, getSlotTypeName, IMatch, IPlayer, isBirthday, isVerifiedPlayer, moProfileId
} from '@nex/data';
import {RootStackProp} from '../../../App';
import {TextLoader} from "./loader/text-loader";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MyText} from "./my-text";
import {createStylesheet} from '../../theming-new';
import {BorderText} from './border-text';


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

export function PlayerOverlay({match, player, highlight, freeForALl, canDownloadRec}: IPlayerProps) {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();

    const boxStyle = [styles.square, {backgroundColor: getPlayerBackgroundColor(player.color)}];
    const playerNameStyle = [{ fontSize: 18, fontWeight: 'bold', color: getPlayerBackgroundColor(player.color), textDecorationLine: highlight ? 'underline' : 'none'}] as TextStyle;

    const gotoPlayer = () => {
        navigation.push('User', {
            id: userIdFromBase(player),
            name: player.name,
        });
    };

    return (
        <View style={styles.player}>
            <TouchableOpacity style={styles.playerCol} disabled={player.slot_type != 1} onPress={gotoPlayer}>
                {/*<View style={styles.playerWonCol}>*/}
                {/*    {*/}
                {/*        player.won === true && (freeForALl || player.team != -1) &&*/}
                {/*        <IconFA5 name="crown" size={14} color="goldenrod" />*/}
                {/*    }*/}
                {/*    {*/}
                {/*        player.won === false && (freeForALl || player.team != -1) &&*/}
                {/*        <IconFA5 name="skull" size={14} style={styles.skullIcon} color="grey" />*/}
                {/*    }*/}
                {/*</View>*/}

                <View style={styles.squareCol}>
                    <View style={boxStyle}>
                        <MyText style={styles.squareText}>{player.color}</MyText>
                    </View>
                </View>

                <BorderText style={[styles.playerRatingCol, playerNameStyle]}>{player.rating}</BorderText>
                {
                    player.profile_id === moProfileId && isBirthday() &&
                    <MyText style={[styles.playerNameColBirthday]} numberOfLines={1}>
                        🥳
                    </MyText>
                }
                <MyText style={styles.playerNameCol} numberOfLines={1}>
                    <BorderText style={playerNameStyle} numberOfLines={1}>
                        {player.slot_type != 1 ? getSlotTypeName(player.slot_type) : player.name}
                    </BorderText>
                    {
                        player.slot_type === 1 && isVerifiedPlayer(player.profile_id) &&
                        <> <Icon solid name="check-circle" size={14} style={styles.verifiedIcon} /></>
                    }
                </MyText>
            </TouchableOpacity>

            {/*{*/}
            {/*    canDownloadRec &&*/}
            {/*    <TouchableOpacity style={styles.playerRecCol} onPress={downloadRec}>*/}
            {/*        <IconFA5 name="cloud-download-alt" size={14} color="grey" />*/}
            {/*    </TouchableOpacity>*/}
            {/*}*/}

            <TouchableOpacity style={styles.civCol} onPress={() => navigation.push('Civ', {civ: civs[player.civ]})}>
                <View style={styles.row}>
                    {/*<Image fadeDuration={0} style={styles.unitIcon} source={getUnitIcon(civList[player.civ].uniqueUnits[0]) as any}/>*/}
                    {/*<Image fadeDuration={0} style={styles.countryIcon} source={getCivIconByIndex(player.civ) as any}/>*/}
                    <BorderText style={[playerNameStyle, {flex: 1}]} numberOfLines={1}>{getCivNameById(civs[player.civ])}</BorderText>
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
        fontWeight: 'bold',
        paddingBottom: 2,
        paddingRight: 1,
    },
    squareCol: {
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
        fontWeight: 'bold',
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
        width: 54,
        height: 54,
        marginRight: 4,
    },
    countryIcon: {
        width: 24,
        height: 24,
        marginRight: 4,
    },
    player: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'yellow',
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

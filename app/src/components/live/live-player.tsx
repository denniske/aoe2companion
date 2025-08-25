import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { IMatchesMatchPlayer2 } from '../../api/helper/api.types';
import { useSelector } from '../../redux/reducer';
import { useAppTheme } from '../../theming';
import { createStylesheet } from '../../theming-new';
import { MyText } from '../../view/components/my-text';
import { appConfig } from '@nex/dataset';
import { Text } from '@app/components/text';
import { aoe2PlayerColors } from '@app/helper/colors';

interface IPlayerProps {
    player: IMatchesMatchPlayer2 | null;
}

export function LivePlayer({ player }: IPlayerProps) {
    const theme = useAppTheme();
    const styles = useStyles();

    const gotoPlayer = () => {
        if (player == null) return;
        router.push(`/matches/users/${player.profileId}?name=${player.name}`);
    };

    if (player == null) {
        return (
            <View style={styles.player}>
                <MyText style={styles.playerRatingCol} />
                <MyText style={styles.playerNameCol} numberOfLines={1} />
                <MyText style={styles.playerGamesCol}>
                    <FontAwesome5 name="fist-raised" size={14} style={{}} color={theme.textNoteColor} />
                </MyText>
                <MyText style={styles.playerWonCol}>
                    <FontAwesome5 name="crown" size={14} style={{}} color={theme.textNoteColor} />
                </MyText>
                <MyText style={styles.playerWonCol}>
                    <FontAwesome5 name="plug" size={14} style={{}} color={theme.textNoteColor} />
                </MyText>
            </View>
        );
    }

    const playerColor = aoe2PlayerColors[player.colorHex] ?? player.colorHex;

    return (
        <TouchableOpacity style={styles.player} onPress={gotoPlayer}>
            {appConfig.game === 'aoe2' && (
                <View className="w-5 h-5 items-center justify-center" style={{ backgroundColor: playerColor }}>
                    <Text variant="title" className="text-sm" color="text-white">
                        {player.color}
                    </Text>
                </View>
            )}
            <MyText style={styles.playerRatingCol}>{player.rating}</MyText>
            <MyText style={styles.playerNameCol} numberOfLines={1}>
                {player.name}
            </MyText>
            <MyText style={styles.playerGamesCol}>{!!player.games && player.games + ''}</MyText>
            <MyText style={styles.playerWonCol}>{!!player.games && !!player.wins && ((player.wins / player.games) * 100).toFixed(0) + ' %'}</MyText>
            <MyText style={styles.playerWonCol}>{!!player.games && !!player.drops && ((player.drops / player.games) * 100).toFixed(0) + ' %'}</MyText>
        </TouchableOpacity>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        playerGamesCol: {
            marginLeft: 7,
            width: 38,
            textAlign: 'right',
            fontVariant: ['tabular-nums'],
        },
        playerWonCol: {
            marginLeft: 7,
            width: 45,
            textAlign: 'right',
            fontVariant: ['tabular-nums'],
        },
        playerCountryCol: {
            marginLeft: 7,
            width: 21,
            fontVariant: ['tabular-nums'],
        },
        playerRatingCol: {
            marginLeft: 7,
            width: 35,
            letterSpacing: -0.5,
            fontVariant: ['tabular-nums'],
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
            width: 21,
            height: 15,
        },
        player: {
            flexDirection: 'row',
            alignItems: 'center',
            // backgroundColor: 'red',
        },
    })
);

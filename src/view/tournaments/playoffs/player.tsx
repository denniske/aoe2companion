import { StyleSheet, View } from 'react-native';
import { Image } from '@/src/components/uniwind/image';
import { EventPlayer } from 'liquipedia';
import { MyText } from '../../components/my-text';
import { createStylesheet } from '../../../theming-new';
import { CountryImage } from '../../components/country-image';
import { getCivIconLocal } from '../../../helper/civs';
import { civAbbrEnumListData } from '@nex/dataset';
import { capitalize } from 'lodash';
import { FC } from 'react';

interface EventPlayerWithCiv extends EventPlayer {
    civ?: string;
}

export const PlayoffPlayer: FC<{ player: EventPlayerWithCiv; reverse?: boolean }> = ({ player, reverse = false }) => {
    const styles = useStyles();

    // console.log('==============> PlayoffPlayer', player.civ, player.civilization);

    const civ = player.civ ? capitalize(player.civ) : player.civilization ? civAbbrEnumListData[player.civilization] : undefined;

    return (
        <View style={[styles.player, reverse && { flexDirection: 'row-reverse' }]}>
            {player.country && <CountryImage country={player.country.code} style={{}} />}
            {player.name && (
                <MyText style={styles.playerName} numberOfLines={1}>
                    {player.name}
                </MyText>
            )}
            {(civ ?? player.civilization) && (
                <Image
                    source={getCivIconLocal(civ ?? player.civilization)}
                    style={[styles.civImage, !player.name && styles.civImageLarge]}
                    alt={player.civilization}
                />
            )}
        </View>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        player: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        civImage: {
            width: 15,
            height: 15,
        },
        civImageLarge: {
            width: 30,
            height: 30,
        },
        playerName: {
            flexShrink: 1,
            fontSize: 12,
        },
    } as const)
);

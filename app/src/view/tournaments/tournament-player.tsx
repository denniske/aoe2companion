import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { createStylesheet } from '../../theming-new';
import { CountryImage } from '../components/country-image';
import { MyText } from '../components/my-text';
import { Player } from 'liquipedia';
import { getVerifiedPlayerBy } from '@nex/data';
import { Image } from 'expo-image';
import { getDifficultyIcon } from '../../helper/difficulties';

export const TournamentPlayer: React.FC<{ playerName: Player['name']; position: number }> = ({ playerName, position }) => {
    const styles = useStyles();
    const player = getVerifiedPlayerBy((verifiedPlayer) => verifiedPlayer.liquipedia === playerName);
    const difficulty = Math.abs(position - 4);

    return (
        <TouchableOpacity style={styles.row} onPress={() => console.log(player)}>
            {player && <CountryImage country={player.country} style={{}} />}
            <MyText style={styles.name} numberOfLines={1}>
                {player?.name ?? playerName}
            </MyText>
            <Image source={getDifficultyIcon(difficulty)} style={styles.difficulty} />
        </TouchableOpacity>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        row: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
        },
        name: {
            fontWeight: 'bold',
        },
        position: {
            fontWeight: '600',
            paddingLeft: 5,
        },
        difficulty: {
            width: 22,
            height: 22,
        },
    })
);

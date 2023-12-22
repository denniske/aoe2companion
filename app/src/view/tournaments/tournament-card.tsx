import { createStylesheet } from '../../theming-new';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { MyText } from '../components/my-text';
import { Image, ImageBackground } from 'expo-image';
import { Tournament } from 'liquipedia';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/core';
import { RootStackProp } from '../../../App2';
import { LinearGradient } from 'expo-linear-gradient';
import { formatPrizePool, formatTier, tournamentStatus } from '../../helper/tournaments';
import { getTranslation } from '../../helper/translate';

export const TournamentCard: React.FC<Tournament> = (tournament) => {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();
    const status = tournamentStatus(tournament);
    const start = tournament.start && format(tournament.start, 'LLL d');
    const end = tournament.end && format(tournament.end, 'LLL d');

    return (
        <TouchableOpacity style={styles.card} key={tournament.name} onPress={() => navigation.push('Tournaments', { tournamentId: tournament.path })}>
            <ImageBackground source={require('../../../assets/textile.jpg')} style={styles.imageBackground} imageStyle={styles.repeatableImage}>
                <LinearGradient colors={['#394766', '#181c29']} style={styles.gradient} />
                <View style={styles.imageContainer}>
                    <Image source={{ uri: tournament.league?.image }} style={styles.image} />
                </View>
            </ImageBackground>
            <View style={styles.cardBody}>
                <MyText style={styles.attributes}>
                    {getTranslation(`tournaments.${status}date`, { start, end })} • {tournament.tier && formatTier(tournament.tier)} •
                    {tournament.prizePool && formatPrizePool(tournament.prizePool)}
                </MyText>
                <MyText style={styles.title}>{tournament.name}</MyText>
            </View>
        </TouchableOpacity>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        card: {
            flex: 1,
            borderRadius: 4,
            position: 'relative',
            gap: 8,
            flexDirection: 'row',
        },
        imageBackground: {
            aspectRatio: 1,
            height: 50,
            overflow: 'hidden',
        },
        repeatableImage: {
            resizeMode: 'repeat',
            width: 200,
            aspectRatio: 1,
        },
        imageContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        image: {
            width: 40,
            aspectRatio: 1,
            resizeMode: 'contain',
        },
        gradient: {
            ...StyleSheet.absoluteFillObject,
            opacity: 0.75,
        },
        title: {
            flex: 1,
            fontWeight: 'bold',
        },
        cardBody: {
            flex: 1,
            gap: 2,
        },
        attributes: {
            fontSize: 11,
            fontWeight: '500',
            color: theme.textNoteColor,
        },
    })
);

import { createStylesheet } from '../../theming-new';
import { View, StyleSheet } from 'react-native';
import { MyText } from '../components/my-text';
import { TournamentDetail } from 'liquipedia';
import { TournamentParticipant } from './tournament-participant';
import { formatCurrency } from 'react-native-format-currency';
import { getDifficultyIcon } from '../../helper/difficulties';
import { Image } from 'expo-image';

const PlaceIcon: React.FC<{ place: string }> = ({ place }) => {
    const styles = useStyles();
    const placeNumber = Number(place.replace(/[^\d\.]+/, ''));
    if (!placeNumber || isNaN(placeNumber)) {
        return null;
    }
    const difficulty = Math.abs(placeNumber - 4);
    const icon = getDifficultyIcon(difficulty);

    return icon && <Image source={icon} style={styles.difficulty} />;
};

export const TournamentPrizes: React.FC<{ prizes: TournamentDetail['prizes'] }> = ({ prizes }) => {
    const styles = useStyles();

    return (
        <View style={styles.container}>
            {prizes.map((prize, index) => (
                <View key={prize.place} style={[styles.prizeRow, index === 0 && styles.prizeRowFirst]}>
                    <View style={styles.cell}>
                        <PlaceIcon place={prize.place} />
                        <MyText style={styles.place}>{prize.place}</MyText>
                    </View>
                    <View style={styles.cell}>{prize.prize && <MyText>{formatCurrency({ ...prize.prize })[0]}</MyText>}</View>

                    <View style={styles.participants}>
                        {prize.participants.map((participant, index) => (
                            <TournamentParticipant key={`${participant.name}-${index}`} participant={participant} bold={false} />
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.skeletonColor,
            borderWidth: 1,
            borderColor: theme.borderColor,
            borderRadius: 4,
            paddingVertical: 8,
        },
        place: {
            fontWeight: '600',
        },
        prizeRow: {
            flexDirection: 'row',
            borderTopWidth: 1,
            borderColor: theme.borderColor,
            paddingTop: 8,
            marginTop: 8,
            paddingHorizontal: 8,
        },
        prizeRowFirst: {
            borderTopWidth: 0,
            paddingTop: 0,
            marginTop: 0,
        },
        cell: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 8,
        },
        participants: {
            width: '50%',
            gap: 4,
        },
        difficulty: {
            width: 22,
            height: 22,
        },
    })
);

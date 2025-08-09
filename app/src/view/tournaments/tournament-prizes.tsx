import { Card } from '@app/components/card';
import { Image } from 'expo-image';
import { TournamentDetail } from 'liquipedia';
import { View, StyleSheet } from 'react-native';
import { formatCurrency } from 'react-native-format-currency';

import { TournamentParticipant } from './tournament-participant';
import { getDifficultyIcon } from '../../helper/difficulties';
import { createStylesheet } from '../../theming-new';
import { MyText } from '../components/my-text';

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

export const TournamentPrizes: React.FC<{ prizes: TournamentDetail['prizes'], onClose: () => void }> = ({ prizes, onClose }) => {
    const styles = useStyles();

    return (
        <Card direction="vertical" className="py-2 px-0 gap-0">
            {prizes.map((prize, index) => (
                <View
                    key={prize.place}
                    className="border-gray-200 dark:border-gray-800"
                    style={[styles.prizeRow, index === 0 && styles.prizeRowFirst]}
                >
                    <View style={styles.cell}>
                        <PlaceIcon place={prize.place} />
                        <MyText style={styles.place}>{prize.place}</MyText>
                    </View>
                    <View style={styles.cell}>{prize.prize && <MyText>{formatCurrency({ ...prize.prize })[0]}</MyText>}</View>

                    <View style={styles.participants}>
                        {prize.participants.map((participant, index) => (
                            <TournamentParticipant key={`${participant.name}-${index}`} onNavigate={onClose} participant={participant} bold={false} />
                        ))}
                    </View>
                </View>
            ))}
        </Card>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        place: {
            fontWeight: '600',
            textAlign: 'center',
        },
        prizeRow: {
            flexDirection: 'row',
            borderTopWidth: 1,
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
    } as const)
);

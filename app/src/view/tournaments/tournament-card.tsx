import { createStylesheet } from '../../theming-new';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { MyText } from '../components/my-text';
import { Image } from 'expo-image';
import { Tournament, TournamentLocationType } from 'liquipedia';
import { TournamentParticipant } from './tournament-participant';
import { formatCurrency } from 'react-native-format-currency';
import { format, isPast } from 'date-fns';
import { CountryImage } from '../components/country-image';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { RootStackProp } from '../../../App2';

export const TournamentCard: React.FC<Tournament> = (tournament) => {
    const styles = useStyles();
    const navigation = useNavigation<RootStackProp>();
    const hasTournamentStarted = isPast(tournament.start ?? new Date());
    const hasTournamentEnded = isPast(tournament.end ?? tournament.start ?? new Date());
    const isOngoing = hasTournamentStarted && !hasTournamentEnded;
    const isUpcoming = !hasTournamentStarted && !hasTournamentEnded;

    return (
        <TouchableOpacity
            style={[styles.card, isOngoing && styles.ongoingCard, isUpcoming && styles.upcomingCard]}
            key={tournament.name}
            onPress={() => navigation.push('Tournaments', { tournamentId: tournament.path })}
        >
            <View style={styles.cardHeader}>
                <Image source={{ uri: tournament.league?.image }} style={styles.image} />
                <MyText style={styles.title}>{tournament.name}</MyText>
            </View>
            <View style={styles.cardBody}>
                {tournament.start && <MyText>{format(tournament.start, 'PPP')}</MyText>}
                {tournament.start && tournament.end && <MyText>-</MyText>}
                {tournament.end && <MyText>{format(tournament.end, 'PPP')}</MyText>}
            </View>
            <View style={styles.cardBody}>
                {tournament.prizePool && (
                    <View style={styles.attribute}>
                        <FontAwesome5 name="money-bill-alt" size={14} style={styles.icon} />
                        <MyText>{formatCurrency({ ...tournament.prizePool, amount: Math.round(tournament.prizePool.amount) })[0]}</MyText>
                    </View>
                )}
                {tournament.participantsCount && (
                    <View style={styles.attribute}>
                        <FontAwesome5 name="users" size={14} style={styles.icon} />
                        <MyText>{tournament.participantsCount}</MyText>
                    </View>
                )}
                {tournament.location && (
                    <View style={styles.attribute}>
                        {tournament.location.country && <CountryImage style={{}} country={tournament.location?.country?.code} />}
                        {tournament.location.type === TournamentLocationType.LAN ? (
                            <MyText>
                                {tournament.location?.type} ({tournament.location?.name})
                            </MyText>
                        ) : (
                            <MyText>{tournament.location?.type}</MyText>
                        )}
                    </View>
                )}
            </View>
            {tournament.participants.length > 0 && (
                <View style={styles.cardFooter}>
                    {tournament.participants.map((participant, index) => (
                        <TournamentParticipant key={participant.name} participant={participant} position={index + 1} />
                    ))}
                </View>
            )}
        </TouchableOpacity>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        card: {
            flex: 1,
            backgroundColor: theme.skeletonColor,
            borderRadius: 4,
            elevation: 4,
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            position: 'relative',
            paddingVertical: 12,
            paddingHorizontal: 15,
            gap: 15,
        },
        ongoingCard: {
            backgroundColor: theme.backgroundColor,
        },
        upcomingCard: {
            backgroundColor: theme.backgroundColor,
        },
        cardHeader: {
            flexDirection: 'row',
            gap: 12,
            alignItems: 'center',
        },
        image: {
            width: 30,
            height: 30,
            resizeMode: 'contain',
        },
        title: {
            fontSize: 16,
            flex: 1,
            fontWeight: 'bold',
        },
        cardBody: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        cardFooter: {
            flexDirection: 'row',
        },
        icon: {
            color: theme.textColor,
        },
        attribute: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
    })
);

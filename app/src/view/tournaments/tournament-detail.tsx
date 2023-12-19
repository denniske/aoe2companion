import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTournament } from '../../api/tournaments';
import { createStylesheet } from '../../theming-new';
import { MyText } from '../components/my-text';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import MyListAccordion from '../components/accordion';
import { useState } from 'react';
import { PlayoffRound } from './playoffs/round';
import { TournamentMarkdown } from './tournament-markdown';
import { Tag } from '../components/tag';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../../App2';
import { StackNavigationProp } from '@react-navigation/stack';
import { TournamentMaps } from './tournament-maps';
import { TournamentParticipants } from './tournament-participants';
import { GroupParticipant } from './playoffs/group-participant';
import { PlayoffMatch } from './playoffs/match';
import { TournamentPrizes } from './tournament-prizes';
import { formatCurrency } from 'react-native-format-currency';
import { getTranslation } from '../../helper/translate';

export const TournamentDetail: React.FC<{ id: string }> = ({ id }) => {
    const styles = useStyles();
    const { data: tournament, isFetching, refetch } = useTournament(id);
    const [playoffRoundWidth, setPlayoffRoundWidth] = useState(0);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Tournaments'>>();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        >
            {tournament ? (
                <>
                    <View style={styles.tabsContainer}>
                        {tournament.tabs.map((tabs, index) => (
                            <View style={styles.tabRow} key={index}>
                                {tabs.map((tab) => (
                                    <TouchableOpacity
                                        onPress={() => navigation.setParams({ tournamentId: tab.path })}
                                        key={tab.path}
                                        disabled={tab.active}
                                    >
                                        <Tag selected={tab.active}>{tab.name}</Tag>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                    </View>

                    <View style={styles.description}>
                        <View style={styles.dates}>
                            {tournament.start && <MyText>{format(tournament.start, 'PPP')}</MyText>}
                            {tournament.start && tournament.end && <MyText>-</MyText>}
                            {tournament.end && <MyText>{format(tournament.end, 'PPP')}</MyText>}
                        </View>
                        <TournamentMarkdown>{tournament.description}</TournamentMarkdown>
                    </View>

                    {(tournament.schedule.length || tournament.scheduleNote) && (
                        <MyListAccordion
                            style={styles.accordion}
                            expandable={true}
                            left={() => <MyText style={styles.header}>Schedule</MyText>}
                            children={
                                <View style={styles.container}>
                                    <View style={styles.schedule}>
                                        {tournament.schedule.map((event) => (
                                            <View key={event.date.toISOString()} style={styles.event}>
                                                <MyText>{format(event.date, 'PPP')}</MyText>
                                                <View style={styles.participants}>
                                                    {event.participants.map((participant, index) => (
                                                        <View
                                                            key={`${participant.name}-${index}`}
                                                            style={[styles.participant, index === 1 && { flexDirection: 'row-reverse' }]}
                                                        >
                                                            {participant.image && (
                                                                <Image source={{ uri: participant.image }} style={styles.participantImage} />
                                                            )}
                                                            <MyText>{participant.name}</MyText>
                                                            <MyText>{participant.score}</MyText>
                                                        </View>
                                                    ))}
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                    {tournament.scheduleNote && <TournamentMarkdown>{tournament.scheduleNote}</TournamentMarkdown>}
                                </View>
                            }
                        />
                    )}

                    {tournament.broadcastTalent && (
                        <MyListAccordion
                            style={styles.accordion}
                            expandable={true}
                            left={() => <MyText style={styles.header}>Broadcast Talent</MyText>}
                            children={
                                <View style={styles.container}>
                                    <TournamentMarkdown>{tournament.broadcastTalent}</TournamentMarkdown>
                                </View>
                            }
                        />
                    )}

                    {tournament.format && (
                        <MyListAccordion
                            style={styles.accordion}
                            expandable={true}
                            left={() => <MyText style={styles.header}>Format</MyText>}
                            children={
                                <View style={styles.container}>
                                    <TournamentMarkdown>{tournament.format}</TournamentMarkdown>
                                </View>
                            }
                        />
                    )}

                    {tournament.prizes.length > 0 && (
                        <MyListAccordion
                            style={styles.accordion}
                            expandable={true}
                            left={() => <MyText style={styles.header}>Prize Pool</MyText>}
                            children={
                                <View style={styles.container}>
                                    {tournament.prizePool && (
                                        <MyText style={styles.prizePoolText}>
                                            {getTranslation('tournaments.prizemoney', { amount: formatCurrency({ ...tournament.prizePool })[0] })}
                                        </MyText>
                                    )}
                                    <TournamentPrizes prizes={tournament.prizes} />
                                </View>
                            }
                        />
                    )}

                    {tournament.rules && (
                        <MyListAccordion
                            style={styles.accordion}
                            expandable={true}
                            left={() => <MyText style={styles.header}>Rules</MyText>}
                            children={
                                <View style={styles.container}>
                                    <TournamentMarkdown>{tournament.rules}</TournamentMarkdown>
                                </View>
                            }
                        />
                    )}

                    {tournament.participants.length > 0 && (
                        <MyListAccordion
                            style={styles.accordion}
                            expandable={true}
                            left={() => <MyText style={styles.header}>Participants</MyText>}
                            children={
                                <TournamentParticipants participants={tournament.participants} participantsNote={tournament.participantsNote} />
                            }
                        />
                    )}

                    {tournament.maps.length > 0 && (
                        <MyListAccordion
                            style={styles.accordion}
                            expandable={true}
                            left={() => <MyText style={styles.header}>Maps</MyText>}
                            children={<TournamentMaps maps={tournament.maps} />}
                        />
                    )}

                    {tournament.groups.length > 0 && (
                        <MyListAccordion
                            style={styles.accordion}
                            expandable={true}
                            left={() => <MyText style={styles.header}>Group Stage</MyText>}
                            children={
                                <View style={styles.groups}>
                                    {tournament.groups.map((group, index) => (
                                        <View style={styles.group} key={index}>
                                            <View style={styles.groupDetails}>
                                                <MyText style={styles.groupName}>{group.name}</MyText>
                                                {group.participants.map((participant) => (
                                                    <GroupParticipant participant={participant} key={participant.name} />
                                                ))}
                                            </View>

                                            <View style={styles.groupRounds}>
                                                {group.rounds.map((round) => (
                                                    <PlayoffRound round={round} width="50%" key={round.name} />
                                                ))}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            }
                        />
                    )}

                    {tournament.results.length > 0 && (
                        <MyListAccordion
                            style={styles.accordion}
                            expandable={true}
                            left={() => <MyText style={styles.header}>Results</MyText>}
                            children={
                                <View style={styles.container}>
                                    {tournament.results.map((result, index) => (
                                        <PlayoffMatch key={index} match={result} />
                                    ))}
                                </View>
                            }
                        />
                    )}

                    {tournament.playoffs.length > 0 && (
                        <MyListAccordion
                            style={styles.accordion}
                            expandable={true}
                            left={() => <MyText style={styles.header}>Playoffs</MyText>}
                            children={
                                <ScrollView
                                    style={styles.playoffs}
                                    horizontal
                                    onLayout={(e) => setPlayoffRoundWidth(e.nativeEvent.layout.width / 2)}
                                    snapToInterval={playoffRoundWidth}
                                    contentContainerStyle={styles.playoffsContent}
                                >
                                    {tournament.playoffs.map((playoffRow, index) => (
                                        <View style={styles.playoffRow} key={index}>
                                            {playoffRow.map((playoffRound) => (
                                                <PlayoffRound round={playoffRound} width={playoffRoundWidth} key={playoffRound.name} />
                                            ))}
                                        </View>
                                    ))}
                                </ScrollView>
                            }
                        />
                    )}
                </>
            ) : isFetching ? (
                <MyText>Loading... Please Wait!</MyText>
            ) : null}
        </ScrollView>
    );
};

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        tabsContainer: {
            gap: 8,
        },
        description: {
            paddingVertical: 20,
        },
        dates: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        accordion: {
            borderColor: 'black',
            borderTopWidth: 1,
            paddingBottom: 15,
            paddingTop: 15,
            gap: 5,
        },
        tabRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
        },
        container: {
            flex: 1,
        },
        contentContainer: {
            padding: 10,
        },
        event: {
            flex: 1,
            backgroundColor: theme.backgroundColor,
            borderRadius: 4,
            elevation: 4,
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            paddingVertical: 8,
            paddingHorizontal: 12,
            gap: 15,
        },
        participants: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        participant: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        participantImage: {
            height: 20,
            width: 45,
            resizeMode: 'contain',
        },
        text: {
            fontSize: 14,
            color: theme.textColor,
        },
        header: {
            fontWeight: 'bold',
            fontSize: 18,
        },
        schedule: {
            gap: 8,
            flex: 1,
        },
        playoffs: {
            marginHorizontal: -10,
        },
        playoffsContent: {
            gap: 20,
            flexDirection: 'column',
        },
        playoffRow: {
            flexDirection: 'row',
        },
        groups: {
            flex: 1,
        },
        group: {
            flex: 1,
        },
        groupDetails: {
            borderColor: theme.borderColor,
            borderWidth: 1,
            backgroundColor: theme.skeletonColor,
            borderRadius: 5,
            overflow: 'hidden',
            marginBottom: 15,
        },
        groupName: {
            fontWeight: 'bold',
            fontSize: 16,
            paddingHorizontal: 15,
            paddingVertical: 10,
        },
        groupRounds: {
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: 25,
            rowGap: 10,
        },
        prizePoolText: {
            paddingVertical: 10,
        },
    })
);

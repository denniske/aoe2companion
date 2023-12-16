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

                    <TournamentMarkdown>{tournament.description}</TournamentMarkdown>
                    <TournamentMarkdown>{tournament.format}</TournamentMarkdown>
                    <TournamentMarkdown>{tournament.rules}</TournamentMarkdown>

                    {tournament.schedule.length > 0 && (
                        <MyListAccordion
                            left={() => <MyText style={styles.header}>Schedule</MyText>}
                            children={
                                <View style={styles.schedule}>
                                    {tournament.schedule.map((event) => (
                                        <View key={event.date.toISOString()} style={styles.event}>
                                            <MyText>{format(event.date, 'PPP')}</MyText>
                                            <View style={styles.participants}>
                                                {event.participants.map((participant, index) => (
                                                    <View
                                                        key={participant.name}
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
                            }
                        />
                    )}

                    {tournament.playoffs.length > 0 && (
                        <>
                            <MyText style={styles.header}>Playoffs</MyText>
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
                        </>
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
        tabRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
        },
        container: {
            flex: 1,
        },
        contentContainer: {
            gap: 8,
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
    })
);

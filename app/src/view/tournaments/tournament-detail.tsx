import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRefreshControl, useTournament } from '../../api/tournaments';
import { createStylesheet } from '../../theming-new';
import { MyText } from '../components/my-text';
import { format } from 'date-fns';
import { Image, ImageBackground } from 'expo-image';
import MyListAccordion from '../components/accordion';
import { Fragment, useState } from 'react';
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
import { PlayoffParticipant } from './playoffs/participant';
import { LinearGradient } from 'expo-linear-gradient';
import { usePaperTheme, useAppTheme } from '../../../src/theming';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { Slider } from '../components/slider';
import { formatPrizePool, formatTier } from '../../helper/tournaments';
import { flagEmojiDict } from '../../helper/flags';
import { TournamentType } from 'liquipedia';
import { Button } from '../components/button';

export const TournamentDetail: React.FC<{ id: string }> = ({ id }) => {
    const styles = useStyles();
    const { data: tournament, ...query } = useTournament(id);
    const [playoffRoundWidth, setPlayoffRoundWidth] = useState(0);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Tournaments'>>();
    const refreshControlProps = useRefreshControl(query);
    const [title, subtitle] = tournament?.name.split(': ') ?? [];
    const theme = useAppTheme();
    const { dark } = usePaperTheme();
    const [isNavbarTransparent, setIsNavbarTransparent] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const countryCode = tournament?.location?.country?.code;

    return (
        <View style={styles.container}>
            <View style={[styles.navbar, isNavbarTransparent && styles.transparentNavbar]}>
                <View style={styles.navbarItemLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <FontAwesome5Icon name="angle-left" size={24} color={isNavbarTransparent ? 'white' : theme.textColor} />
                    </TouchableOpacity>
                </View>
                {tournament?.league?.image && (
                    <Image
                        source={{ uri: tournament?.league?.image }}
                        style={[styles.navbarImage, activeSlide === 0 && isNavbarTransparent && styles.transparentItem]}
                    />
                )}
                <View style={styles.navbarItemRight} />
            </View>
            <ScrollView
                style={styles.container}
                contentContainerStyle={tournament && styles.contentContainer}
                refreshControl={<RefreshControl {...refreshControlProps} />}
                onScroll={(event) => setIsNavbarTransparent(event.nativeEvent.contentOffset.y < 200)}
                scrollEventThrottle={24}
            >
                {tournament ? (
                    <>
                        <ImageBackground source={require('../../../assets/hero.jpg')} style={styles.hero}>
                            <LinearGradient
                                style={styles.heroBackground}
                                locations={[0.75, 1]}
                                colors={['rgba(0, 0, 0, 0.5)', dark ? 'rgba(0, 0, 0, 0)' : theme.backgroundColor]}
                            />
                            <Slider
                                setActiveSlide={setActiveSlide}
                                slides={[
                                    <View style={styles.heroContent}>
                                        {tournament?.league?.image && <Image source={{ uri: tournament?.league?.image }} style={styles.heroImage} />}
                                        {title && <MyText style={styles.heroTitle}>{title}</MyText>}
                                        {subtitle && <MyText style={styles.heroSubtitle}>{subtitle}</MyText>}
                                        <MyText style={styles.heroDate}>
                                            {tournament.start && format(tournament.start, 'LLL d')}
                                            {tournament.start && tournament.end && ' - '}
                                            {tournament.end && format(tournament.end, 'LLL d')}
                                        </MyText>
                                    </View>,
                                    <View style={[styles.heroContent, styles.heroContentCentered]}>
                                        {title && <MyText style={styles.heroTitle}>{title}</MyText>}

                                        {[TournamentType.Individual, TournamentType.Team].includes(tournament.type) && tournament.organizer && (
                                            <MyText style={styles.heroAttribute}>
                                                {tournament.type === TournamentType.Individual
                                                    ? getTranslation('tournaments.playerscount', { count: tournament.participantsCount })
                                                    : getTranslation('tournaments.teamscount', { count: tournament.participantsCount })}
                                            </MyText>
                                        )}
                                        {tournament.organizer && (
                                            <MyText style={styles.heroAttribute}>
                                                {getTranslation('tournaments.organizer', { organizer: tournament.organizer })}
                                            </MyText>
                                        )}
                                        {tournament.venue && (
                                            <MyText style={styles.heroAttribute}>
                                                {getTranslation('tournaments.venue', { venue: tournament.venue })}
                                            </MyText>
                                        )}
                                        <View style={styles.heroTags}>
                                            {tournament.tier && <Tag>{formatTier(tournament.tier)}</Tag>}
                                            {tournament.prizePool && <Tag>{formatPrizePool(tournament.prizePool)}</Tag>}
                                            {tournament.location && (
                                                <Tag>
                                                    {countryCode ? `${flagEmojiDict[countryCode]} ` : ''}
                                                    {tournament.location.name}
                                                </Tag>
                                            )}
                                        </View>
                                    </View>,
                                    <View style={[styles.heroContent, styles.heroContentCentered]}>
                                        <TournamentMarkdown textAlign="center" color="white">
                                            {tournament.description}
                                        </TournamentMarkdown>
                                    </View>,
                                    tournament?.tabs.length && tournament.league?.name && (
                                        <View style={styles.heroContent}>
                                            <View style={styles.tabsContainer}>
                                                {tournament?.tabs.map((tabs, index) => (
                                                    <View style={[styles.tabRow]} key={index}>
                                                        {tabs.map((tab) => (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    navigation.setParams({ tournamentId: tab.path });
                                                                }}
                                                                key={tab.path}
                                                                disabled={tab.active}
                                                            >
                                                                <Tag size="small" selected={tab.active}>
                                                                    {tab.name}
                                                                </Tag>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </View>
                                                ))}
                                            </View>

                                            {tournament.league?.name && (
                                                <View style={styles.series}>
                                                    <MyText style={styles.seriesText}>{getTranslation('tournaments.series')}</MyText>
                                                    <Button
                                                        size="small"
                                                        onPress={() =>
                                                            tournament.league?.path &&
                                                            navigation.push('Tournaments', { league: tournament.league.path })
                                                        }
                                                    >
                                                        {tournament.league.name}
                                                    </Button>
                                                </View>
                                            )}
                                        </View>
                                    ),
                                ]}
                            ></Slider>
                        </ImageBackground>

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
                                                    <MyText style={styles.eventDate}>{format(event.date, 'PPP')}</MyText>

                                                    <View style={styles.participants}>
                                                        {event.participants.map((participant, index) => {
                                                            const otherParticipant = event.participants[Math.abs(index - 1)];
                                                            const winner =
                                                                participant.score &&
                                                                otherParticipant.score &&
                                                                participant.score > otherParticipant.score;
                                                            return (
                                                                <Fragment key={`${participant.name}-${index}`}>
                                                                    <View
                                                                        style={[styles.participant, index === 1 && { flexDirection: 'row-reverse' }]}
                                                                    >
                                                                        <PlayoffParticipant
                                                                            reversed={index === 1}
                                                                            participant={participant}
                                                                            winner={!!winner}
                                                                        />
                                                                        <MyText>{participant.score}</MyText>
                                                                    </View>
                                                                    {index === 0 && (
                                                                        <View style={styles.participantVersus}>
                                                                            {event.format ? <MyText>{event.format}</MyText> : <MyText>:</MyText>}
                                                                        </View>
                                                                    )}
                                                                </Fragment>
                                                            );
                                                        })}
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
                                                    {group.participants.map((participant, participantIndex) => (
                                                        <GroupParticipant participant={participant} key={`${participant.name}-${participantIndex}`} />
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
                                    <View style={styles.playoffs} onLayout={(e) => setPlayoffRoundWidth(e.nativeEvent.layout.width / 2)}>
                                        {tournament.playoffs.map((playoffRow, index) => (
                                            <View style={styles.playoffRowContainer} key={index}>
                                                {playoffRow.name && playoffRow.name !== 'Playoffs' && (
                                                    <MyText style={styles.playoffRowText}>{playoffRow.name}</MyText>
                                                )}
                                                <ScrollView
                                                    style={styles.playoffRow}
                                                    horizontal
                                                    snapToInterval={playoffRoundWidth}
                                                    contentContainerStyle={styles.playoffsContent}
                                                >
                                                    {playoffRow.rounds.map((playoffRound) => (
                                                        <PlayoffRound round={playoffRound} width={playoffRoundWidth} key={playoffRound.name} />
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        ))}
                                    </View>
                                }
                            />
                        )}
                    </>
                ) : null}
            </ScrollView>
        </View>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        navbar: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.backgroundColor,
        },
        navbarImage: {
            height: 30,
            aspectRatio: 1,
            resizeMode: 'contain',
            shadowColor: 'white',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            elevation: 5,
            overflow: 'visible',
        },
        transparentNavbar: {
            backgroundColor: 'transparent',
        },
        navbarItemLeft: {
            flex: 1,
        },
        navbarItemRight: {
            flex: 1,
            alignItems: 'flex-end',
        },
        transparentItem: {
            opacity: 0,
        },
        contentContainer: {
            padding: 10,
            backgroundColor: darkMode === 'dark' ? '#181C29' : theme.backgroundColor,
        },
        hero: {
            margin: -10,
            height: 250,
            marginBottom: 10,
        },
        heroBackground: {
            ...StyleSheet.absoluteFillObject,
        },
        heroContent: {
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingTop: 20,
            shadowColor: 'white',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            elevation: 5,
        },
        heroContentCentered: {
            paddingTop: 0,
            paddingBottom: 10,
            justifyContent: 'center',
            gap: 4,
        },
        heroTags: {
            flexDirection: 'row',
            gap: 8,
            paddingTop: 6,
            paddingBottom: 6,
        },
        heroAttribute: {
            color: 'white',
            fontSize: 12,
            fontWeight: '500',
        },
        heroImage: {
            height: 100,
            aspectRatio: 1,
            resizeMode: 'contain',
            shadowColor: 'white',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 5,
            overflow: 'visible',
        },
        heroTitle: {
            color: 'white',
            fontSize: 18,
            fontWeight: '600',
            paddingTop: 10,
        },
        heroSubtitle: {
            color: 'white',
            fontSize: 15,
            fontWeight: '500',
            paddingTop: 4,
        },
        heroDate: {
            paddingTop: 4,
            color: '#BBB',
        },
        tabsContainer: {
            gap: 8,
            paddingTop: 30,
        },
        tabRow: {
            gap: 2,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
        },
        series: {
            paddingTop: 20,
            gap: 8,
            alignItems: 'center',
        },
        seriesText: {
            color: 'white',
            fontSize: 15,
            fontWeight: '500',
        },
        description: {
            paddingVertical: 20,
        },
        dates: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        accordion: {
            borderColor: theme.borderColor,
            borderTopWidth: 1,
            paddingBottom: 15,
            paddingTop: 15,
            gap: 5,
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
        eventDate: {
            fontWeight: '600',
            fontSize: 16,
        },
        participants: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        participantVersus: {
            alignItems: 'center',
            flex: 1,
        },
        participant: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            flex: 1,
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
            width: '100%',
            gap: 24,
        },
        playoffRowContainer: {
            width: '100%',
            gap: 8,
        },
        playoffRowText: {
            fontSize: 18,
            fontWeight: '500',
        },
        playoffRow: {
            marginHorizontal: -10,
        },
        playoffsContent: {
            gap: 20,
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

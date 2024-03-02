import { useRefreshControl, useTournament, useTournamentMatches } from '@app/api/tournaments';
import { Icon } from '@app/components/icon';
import { ScrollView } from '@app/components/scroll-view';
import { flagEmojiDict } from '@app/helper/flags';
import { formatPrizePool, formatTier } from '@app/helper/tournaments';
import { getTranslation } from '@app/helper/translate';
import tw from '@app/tailwind';
import { usePaperTheme, useAppTheme } from '@app/theming';
import { createStylesheet } from '@app/theming-new';
import MyListAccordion from '@app/view/components/accordion';
import { Button } from '@app/view/components/button';
import { MyText } from '@app/view/components/my-text';
import { Slider } from '@app/view/components/slider';
import { Tag } from '@app/view/components/tag';
import { GroupParticipant } from '@app/view/tournaments/playoffs/group-participant';
import { PlayoffMatch } from '@app/view/tournaments/playoffs/match';
import { PlayoffParticipant } from '@app/view/tournaments/playoffs/participant';
import { PlayoffRound } from '@app/view/tournaments/playoffs/round';
import { TournamentMaps } from '@app/view/tournaments/tournament-maps';
import { TournamentMarkdown } from '@app/view/tournaments/tournament-markdown';
import { TournamentParticipants } from '@app/view/tournaments/tournament-participants';
import { TournamentPrizes } from '@app/view/tournaments/tournament-prizes';
import { format } from 'date-fns';
import { Image, ImageBackground, ImageStyle } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { TournamentType } from 'liquipedia';
import { Fragment, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { formatCurrency } from 'react-native-format-currency';

export default function TournamentDetail() {
    const params = useLocalSearchParams<{ id: string[] }>();
    const id = typeof params.id === 'string' ? params.id : params.id?.join('/') ?? '';

    const styles = useStyles();
    const { data: tournament, ...query } = useTournament(id);
    const [playoffRoundWidth, setPlayoffRoundWidth] = useState(0);
    const refreshControlProps = useRefreshControl(query);
    const [title, subtitle] = tournament?.name.split(': ') ?? [];
    const theme = useAppTheme();
    const { dark } = usePaperTheme();
    const [isNavbarTransparent, setIsNavbarTransparent] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const countryCode = tournament?.location?.country?.code;

    const { data: tournamentMatches } = useTournamentMatches();
    const liveOrUpcomingMatches = tournamentMatches?.filter((tournamentMatch) => tournamentMatch.tournament.name === tournament?.name);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.navbar} className={isNavbarTransparent ? 'bg-transparent' : 'bg-gold-50 dark:bg-blue-950'}>
                <View style={styles.navbarItemLeft}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Icon icon="angle-left" size={22} color={isNavbarTransparent ? 'text-white' : 'default'} />
                    </TouchableOpacity>
                </View>
                {tournament?.league?.image && (
                    <Image
                        source={{ uri: tournament?.league?.image }}
                        style={[styles.navbarImage as ImageStyle, (activeSlide === 0 && isNavbarTransparent && styles.transparentItem) as ImageStyle]}
                    />
                )}
                <View style={styles.navbarItemRight} />
            </View>
            <ScrollView
                style={styles.container}
                className={tournament && 'bg-gold-50 dark:bg-blue-950'}
                contentContainerStyle={tournament && 'p-2.5'}
                refreshControl={<RefreshControl {...refreshControlProps} />}
                onScroll={(event) => setIsNavbarTransparent(event.nativeEvent.contentOffset.y < 200)}
                scrollEventThrottle={24}
            >
                {tournament ? (
                    <>
                        <ImageBackground source={require('../../../../assets/hero.jpg')} style={styles.hero}>
                            <LinearGradient
                                style={styles.heroBackground}
                                locations={[0.75, 1]}
                                colors={['rgba(0, 0, 0, 0.5)', tw.style('bg-gold-50 dark:bg-blue-950').backgroundColor as string]}
                            />
                            <Slider
                                setActiveSlide={setActiveSlide}
                                slides={[
                                    <View style={styles.heroContent}>
                                        {tournament?.league?.image && (
                                            <Image source={{ uri: tournament?.league?.image }} style={styles.heroImage as ImageStyle} />
                                        )}
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
                                                                    router.setParams({ id: tab.path });
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
                                                            router.push(`/competitive/tournaments?league=${tournament.league.path}`)
                                                        }
                                                    >
                                                        {tournament.league.name}
                                                    </Button>
                                                </View>
                                            )}
                                        </View>
                                    ),
                                ]}
                            />
                        </ImageBackground>

                        {liveOrUpcomingMatches?.length ? (
                            <View style={styles.liveMatches}>
                                <MyText style={styles.header}>{getTranslation('tournaments.livematches')}</MyText>
                                {liveOrUpcomingMatches?.map((match, index) => <PlayoffMatch key={index} match={match} />)}
                            </View>
                        ) : null}
                        {tournament.broadcastTalent && (
                            <MyListAccordion
                                style={styles.accordion}
                                expandable
                                left={() => <MyText style={styles.header}>{getTranslation('tournaments.broadcasttalent')}</MyText>}
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
                                expandable
                                left={() => <MyText style={styles.header}>{getTranslation('tournaments.format')}</MyText>}
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
                                expandable
                                left={() => <MyText style={styles.header}>{getTranslation('tournaments.prizepool')}</MyText>}
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
                                expandable
                                left={() => <MyText style={styles.header}>{getTranslation('tournaments.rules')}</MyText>}
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
                                expandable
                                left={() => <MyText style={styles.header}>{getTranslation('tournaments.participants')}</MyText>}
                                children={
                                    <TournamentParticipants participants={tournament.participants} participantsNote={tournament.participantsNote} />
                                }
                            />
                        )}

                        {tournament.maps.length > 0 && (
                            <MyListAccordion
                                style={styles.accordion}
                                expandable
                                left={() => <MyText style={styles.header}>{getTranslation('tournaments.maps')}</MyText>}
                                children={<TournamentMaps maps={tournament.maps} />}
                            />
                        )}

                        {tournament.groups.length > 0 && (
                            <MyListAccordion
                                style={styles.accordion}
                                expandable
                                left={() => <MyText style={styles.header}>{getTranslation('tournaments.groupstage')}</MyText>}
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

                        {tournament.playoffs.length > 0 && (
                            <MyListAccordion
                                style={styles.accordion}
                                expandable
                                left={() => <MyText style={styles.header}>{getTranslation('tournaments.playoffs')}</MyText>}
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
                                                    contentContainerStyle="gap-5"
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

                        {tournament.results.length > 0 && (
                            <MyListAccordion
                                style={styles.accordion}
                                expandable
                                left={() => (
                                    <MyText style={styles.header}>
                                        {tournament.playoffs.length ? `${getTranslation('tournaments.showmatch')} ` : ''}
                                        {getTranslation('tournaments.results')}
                                    </MyText>
                                )}
                                children={
                                    <View style={styles.container}>
                                        {tournament.results.map((result, index) => (
                                            <PlayoffMatch key={index} match={result} />
                                        ))}
                                    </View>
                                }
                            />
                        )}

                        {(tournament.schedule.length || tournament.scheduleNote) && (
                            <MyListAccordion
                                style={styles.accordion}
                                expandable
                                left={() => <MyText style={styles.header}>{getTranslation('tournaments.fullschedule')}</MyText>}
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
                    </>
                ) : null}
            </ScrollView>
        </View>
    );
}

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
        liveMatches: {
            marginVertical: 20,
            gap: 12,
        },
    })
);

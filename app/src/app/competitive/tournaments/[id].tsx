import { useRefreshControl, useTournament, useTournamentMatches } from '@app/api/tournaments';
import { Button } from '@app/components/button';
import { Card } from '@app/components/card';
import { FlatList } from '@app/components/flat-list';
import { HeaderTitle } from '@app/components/header-title';
import { Icon } from '@app/components/icon';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { flagEmojiDict } from '@app/helper/flags';
import { findFullMatch, formatPrizePool, formatTier, getAllTournamentMatches, getMatches } from '@app/helper/tournaments';
import { getTranslation } from '@app/helper/translate';
import { useFollowedTournament } from '@app/service/followed-tournaments';
import tw from '@app/tailwind';
import { textColors } from '@app/utils/text.util';
import BottomSheet from '@app/view/bottom-sheet';
import PlayerList from '@app/view/components/player-list';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { Slider } from '@app/view/components/slider';
import { Tag } from '@app/view/components/tag';
import { GroupParticipant } from '@app/view/tournaments/playoffs/group-participant';
import { PlayoffRound } from '@app/view/tournaments/playoffs/round';
import { StageCard } from '@app/view/tournaments/stage-card';
import { TournamentMaps } from '@app/view/tournaments/tournament-maps';
import { TournamentMarkdown } from '@app/view/tournaments/tournament-markdown';
import { TournamentMatch } from '@app/view/tournaments/tournament-match';
import { TournamentPrizes } from '@app/view/tournaments/tournament-prizes';
import { getVerifiedPlayerBy } from '@nex/data';
import { format, isPast } from 'date-fns';
import { Image } from 'expo-image';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { GameVersion, TournamentType } from 'liquipedia';
import { orderBy, reverse } from 'lodash';
import { useColorScheme } from 'nativewind';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { formatCurrency } from 'react-native-format-currency';

export default function TournamentDetail() {
    const params = useLocalSearchParams<{ id: string[] }>();
    const id = typeof params.id === 'string' ? params.id : params.id?.join('/') ?? '';
    const { data: tournament, ...query } = useTournament(id);
    const { data: mainTournament } = useTournament(tournament?.tabs[0]?.[0]?.path ?? id, false);
    const refreshControlProps = useRefreshControl(query);
    const [title, subtitle] = tournament?.name.split(': ') ?? [];
    const tournamentImage = tournament?.league?.image ?? mainTournament?.league?.image;
    const [showParticipantsNote, setShowParticipantsNote] = useState(false);
    const [showFormatNote, setShowFormatNote] = useState(false);
    const [visiblePopup, setVisiblePopup] = useState<string>();
    const [playoffRoundWidth, setPlayoffRoundWidth] = useState(0);
    const { data: tournamentMatches } = useTournamentMatches();
    const tournamentTabs =
        tournament?.tabs.filter(
            (tabs) => !tabs.some((tab) => [GameVersion.Age1, GameVersion.Age2, GameVersion.Age3, GameVersion.Age4].includes(tab.name as GameVersion))
        ) ?? [];

    const playoffMatches = getMatches(tournament?.playoffs);
    const groupMatches = getMatches(tournament?.groups);

    const matches = getAllTournamentMatches(tournament);

    const hasResults = tournament?.groups.length || tournament?.playoffs.length || tournament?.results.length;

    const past = isPast(matches[matches.length - 1]?.startTime ?? new Date());
    const filteredMatches = past
        ? matches
        : orderBy(
              matches.filter(
                  (match) =>
                      !isPast(match?.startTime ?? new Date()) ||
                      findFullMatch(
                          {
                              ...match,
                              tournament: { name: tournament?.name ?? '', path: tournament?.path ?? '' },
                              participants: [match.participants[0], match.participants[1] || match.participants[0]],
                          },
                          tournamentMatches
                      )
              ),
              'startTime',
              'desc'
          );
    const start = tournament?.start ?? mainTournament?.start;
    const end = tournament?.end ?? mainTournament?.end;
    const countryCode = tournament?.location?.country?.code;
    const tabs = ['Overview', 'Schedule', 'More Info'];
    useColorScheme();

    if (!tournament) {
        return (
            <ScrollView
                className="flex-1"
                contentContainerStyle={tournament && 'p-4'}
                refreshControl={<RefreshControlThemed {...refreshControlProps} />}
            >
                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                />
            </ScrollView>
        );
    }

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={tournament && 'gap-5 py-4'}
            refreshControl={<RefreshControlThemed {...refreshControlProps} />}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: () => (
                        <View className="flex-1">
                            <HeaderTitle
                                icon={{ uri: tournamentImage }}
                                iconStyle={{ resizeMode: 'contain' }}
                                title={title}
                                subtitle={
                                    <Text variant="label">
                                        {start && format(start, 'LLL d')}
                                        {start && end && ' - '}
                                        {end && format(end, 'LLL d')}
                                        {subtitle && (start || end) && ' - '}
                                        {subtitle && <Text variant="label-sm">{subtitle.replace(tournament?.game ?? '', '').trim()}</Text>}
                                    </Text>
                                }
                            />
                        </View>
                    ),
                    headerRight: () => <FollowHeaderButton id={mainTournament?.path ?? id} />,
                }}
            />

            <Slider
                scrollEnabled={false}
                equalizeHeights={false}
                pagination={(scrollTo, current) => (
                    <View className="rounded-lg overflow-hidden flex-row bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-4 mx-4">
                        {tabs.map((tab, index) => (
                            <Button
                                align="center"
                                key={tab}
                                className={`flex-1 p-2 justify-center ${current === index ? '' : 'bg-transparent'}`}
                                onPress={() => scrollTo(index)}
                                textStyle={tw.style(current === index ? 'text-white' : textColors.subtle)}
                            >
                                {tab}
                            </Button>
                        ))}
                    </View>
                )}
                slides={[
                    <View className="gap-5">
                        {filteredMatches.length ? (
                            <View className="gap-2">
                                <Text variant="header" className="px-4">
                                    {past ? 'Past Matches' : 'Next Scheduled Matches'}
                                </Text>
                                <FlatList
                                    data={filteredMatches ? reverse(filteredMatches) : filteredMatches}
                                    renderItem={(match) => <TournamentMatch style={{ width: 250 }} key={match.index} match={match.item} />}
                                    contentContainerStyle="gap-2 px-4"
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        ) : null}
                        {tournament.participants.length > 0 && (
                            <View className="gap-2">
                                <View className="flex-row items-center justify-between px-4">
                                    <Text variant="header">{getTranslation('tournaments.participants')}</Text>
                                    {tournament.participantsNote && (
                                        <TouchableOpacity onPress={() => setShowParticipantsNote((val) => !val)}>
                                            <Icon prefix="fasr" icon="info-circle" color="brand" />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <PlayerList
                                    selectedUser={(participant) => {
                                        const verifiedPlayer = getVerifiedPlayerBy(
                                            (player) => player.liquipedia === participant.name || player.name === participant.name
                                        );
                                        const playerId = verifiedPlayer?.platforms.rl?.[0];

                                        if (playerId) {
                                            router.navigate(`/matches/users/${playerId}`);
                                        }
                                    }}
                                    variant="horizontal"
                                    list={tournament.participants.map((participant) => ({
                                        profileId: -1,
                                        ...participant,
                                        name: '',
                                        participant: participant.name,
                                    }))}
                                    footer={(player) => (
                                        <View className="flex-row gap-1 items-center">
                                            <Text numberOfLines={1} variant="body-sm" allowFontScaling={false}>
                                                {player?.participant}
                                            </Text>
                                            <Text variant="label-xs" className="-mt-1">
                                                {player?.note}
                                            </Text>
                                        </View>
                                    )}
                                    image={(player) => <Image source={{ uri: player?.image }} className="w-7 h-3.5 my-2" contentFit="contain" />}
                                />

                                {tournament.participantsNote && showParticipantsNote && (
                                    <View className="pb-4 px-4">
                                        <TournamentMarkdown>{tournament.participantsNote}</TournamentMarkdown>
                                    </View>
                                )}
                            </View>
                        )}

                        {tournament.prizePool && (
                            <View className="px-4">
                                <Button align="center" onPress={() => setVisiblePopup('prizepool')}>
                                    View Prizes
                                </Button>
                                <BottomSheet
                                    isActive={visiblePopup === 'prizepool'}
                                    title="Prizes"
                                    closeButton
                                    onClose={() => setVisiblePopup(undefined)}
                                >
                                    <Text className="my-4">
                                        {getTranslation('tournaments.prizemoney', { amount: formatCurrency({ ...tournament.prizePool })[0] })}
                                    </Text>
                                    <TournamentPrizes prizes={tournament.prizes} />
                                </BottomSheet>
                            </View>
                        )}

                        {tournament.maps.length > 0 && (
                            <View className="gap-2">
                                <Text variant="header" className="px-4">
                                    {getTranslation('tournaments.maps')}
                                </Text>
                                <TournamentMaps maps={tournament.maps} />
                            </View>
                        )}

                        {hasResults || tournament.format ? (
                            <View className="gap-2 px-4">
                                <View className="flex-row items-center justify-between">
                                    <Text variant="header">Results</Text>
                                    {tournament.format && hasResults ? (
                                        <TouchableOpacity onPress={() => setShowFormatNote((val) => !val)}>
                                            <Icon prefix="fasr" icon="info-circle" color="brand" />
                                        </TouchableOpacity>
                                    ) : null}
                                </View>
                                {tournament.format && (showFormatNote || !hasResults) ? (
                                    <Card direction="vertical">
                                        <Text variant="label-lg" className="px-2">
                                            {getTranslation('tournaments.format')}
                                        </Text>

                                        <TournamentMarkdown>{tournament.format}</TournamentMarkdown>
                                    </Card>
                                ) : null}

                                {tournament.groups.length > 0 && (
                                    <View>
                                        <StageCard title="Group Stage" matches={groupMatches} onPress={() => setVisiblePopup('group')} />

                                        <BottomSheet
                                            isActive={visiblePopup === 'group'}
                                            title="Group Stage"
                                            closeButton
                                            onClose={() => setVisiblePopup(undefined)}
                                        >
                                            <View className="mt-4">
                                                {tournament.groups.map((group, index) => (
                                                    <View key={index}>
                                                        <Card direction="vertical" className="gap-0 mb-2 px-0 py-0">
                                                            <Text variant="header-xs" className="px-4 py-3">
                                                                {group.name}
                                                            </Text>
                                                            {group.participants.map((participant, participantIndex) => (
                                                                <GroupParticipant
                                                                    participant={participant}
                                                                    key={`${participant.name}-${participantIndex}`}
                                                                />
                                                            ))}
                                                        </Card>

                                                        <View className="flex-row flex-wrap mb-4" style={{ rowGap: 12 }}>
                                                            {group.rounds.map((round) => (
                                                                <PlayoffRound round={round} width="50%" key={round.id} />
                                                            ))}
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </BottomSheet>
                                    </View>
                                )}

                                {tournament.playoffs.length > 0 && (
                                    <View>
                                        <StageCard title="Playoffs" matches={playoffMatches} onPress={() => setVisiblePopup('playoffs')} />

                                        <BottomSheet
                                            isActive={visiblePopup === 'playoffs'}
                                            title="Playoffs"
                                            closeButton
                                            onClose={() => setVisiblePopup(undefined)}
                                        >
                                            <View
                                                className="w-full mt-4 gap-6"
                                                onLayout={(e) => setPlayoffRoundWidth(e.nativeEvent.layout.width / 2)}
                                            >
                                                {tournament.playoffs.map((playoffRow, index) => (
                                                    <View className="w-full gap-2" key={index}>
                                                        {playoffRow.name && playoffRow.name !== 'Playoffs' && (
                                                            <View className="flex-row justify-between">
                                                                <Text variant="label-lg">{playoffRow.name}</Text>
                                                                {playoffRow.advances?.length ? (
                                                                    <Text>
                                                                        {playoffRow.advances.map((player) => player.name).join(', ')}{' '}
                                                                        {playoffRow.advances.length === 1 ? 'advances' : 'advance'}
                                                                    </Text>
                                                                ) : null}
                                                            </View>
                                                        )}
                                                        <ScrollView
                                                            className="-mx-3"
                                                            horizontal
                                                            showsHorizontalScrollIndicator={false}
                                                            snapToInterval={playoffRoundWidth}
                                                            contentContainerStyle="gap-5"
                                                        >
                                                            {playoffRow.rounds.map((playoffRound) => (
                                                                <PlayoffRound round={playoffRound} width={playoffRoundWidth} key={playoffRound.id} />
                                                            ))}
                                                        </ScrollView>
                                                    </View>
                                                ))}
                                            </View>
                                        </BottomSheet>
                                    </View>
                                )}

                                {tournament.results.length > 0 && (
                                    <View>
                                        <StageCard
                                            title={getTranslation('tournaments.showmatch')}
                                            matches={tournament.results}
                                            onPress={() => setVisiblePopup('showmatch')}
                                        />

                                        <BottomSheet
                                            isActive={visiblePopup === 'showmatch'}
                                            title={getTranslation('tournaments.showmatch')}
                                            closeButton
                                            onClose={() => setVisiblePopup(undefined)}
                                        >
                                            <View className="gap-2 mt-4">
                                                <FlatList
                                                    data={tournament.results}
                                                    renderItem={(match) => (
                                                        <TournamentMatch style={{ width: 250 }} key={match.index} match={match.item} />
                                                    )}
                                                    contentContainerStyle="gap-2"
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                />
                                                {tournament.resultsNote && (
                                                    <View className="pt-4">
                                                        <TournamentMarkdown>{tournament.resultsNote}</TournamentMarkdown>
                                                    </View>
                                                )}
                                            </View>
                                        </BottomSheet>
                                    </View>
                                )}
                            </View>
                        ) : null}
                    </View>,
                    <View className="gap-2 px-4">
                        <Text variant="header">{getTranslation('tournaments.fullschedule')}</Text>
                        {!tournament.scheduleNote && tournament.schedule.length === 0 ? <Text>Schedule not available</Text> : null}

                        {tournament.scheduleNote && (
                            <View className="pb-4">
                                <TournamentMarkdown>{tournament.scheduleNote}</TournamentMarkdown>
                            </View>
                        )}

                        <View className="gap-2">
                            {(tournament.schedule.length
                                ? tournament.schedule.map((event) => ({
                                      startTime: event.date,
                                      header: event.round ? { name: event.round, format: event.format } : undefined,
                                      ...event,
                                  }))
                                : matches
                            ).map((event, index) => (
                                <TournamentMatch
                                    style={{ width: '100%' }}
                                    key={`${event.startTime?.toISOString()}-${index.toString()}`}
                                    match={event}
                                />
                            ))}
                        </View>
                    </View>,
                    <View className="gap-5 px-4">
                        {tournamentTabs.length > 0 && (
                            <View className="gap-2">
                                {tournamentTabs.map((tabs, index) => (
                                    <View className="flex-row gap-1 justify-center flex-wrap" key={index}>
                                        {tabs.map((tab) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    router.setParams({ id: encodeURIComponent(tab.path) });
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
                        )}
                        <View className="gap-5">
                            <TournamentMarkdown textAlign="center">{tournament.description}</TournamentMarkdown>

                            <View className="gap-2 items-center">
                                {tournament.organizer && (
                                    <Text variant="label-lg" align="center">
                                        {getTranslation('tournaments.organizer', { organizer: tournament.organizer })}
                                    </Text>
                                )}

                                {tournament.prizePool && (
                                    <Text variant="label-lg" align="center">
                                        Prize Pool - {formatPrizePool(tournament.prizePool)}
                                    </Text>
                                )}

                                {tournament.tier && (
                                    <Text variant="label-lg" align="center">
                                        Tier - {formatTier(tournament.tier)}
                                    </Text>
                                )}

                                {tournament.location && (
                                    <Text variant="label-lg" align="center">
                                        {countryCode ? `${flagEmojiDict[countryCode]} ` : ''}
                                        {tournament.location.name}
                                    </Text>
                                )}

                                {tournament.venue && (
                                    <Text variant="label-lg" align="center">
                                        {getTranslation('tournaments.venue', { venue: tournament.venue })}
                                    </Text>
                                )}

                                {[TournamentType.Individual, TournamentType.Team].includes(tournament.type) && tournament.organizer && (
                                    <Text variant="label-lg" align="center">
                                        {tournament.type === TournamentType.Individual
                                            ? getTranslation('tournaments.playerscount', { count: tournament.participantsCount })
                                            : getTranslation('tournaments.teamscount', { count: tournament.participantsCount })}
                                    </Text>
                                )}

                                {tournament.league?.name && (
                                    <View className="flex-row gap-2 mb-2 items-center">
                                        <Text variant="label-lg" align="center">
                                            {getTranslation('tournaments.series')}
                                        </Text>
                                        <Button
                                            size="small"
                                            onPress={() =>
                                                tournament.league?.path &&
                                                router.push(`/competitive/tournaments/all?league=${tournament.league.path}`)
                                            }
                                        >
                                            {tournament.league.name}
                                        </Button>
                                    </View>
                                )}

                                {tournament.broadcastTalent?.length ? (
                                    <View>
                                        <Button onPress={() => setVisiblePopup('broadcast')}>{getTranslation('tournaments.broadcasttalent')}</Button>

                                        <BottomSheet
                                            closeButton
                                            isActive={visiblePopup === 'broadcast'}
                                            onClose={() => setVisiblePopup(undefined)}
                                            title={getTranslation('tournaments.broadcasttalent')}
                                        >
                                            <Slider
                                                className="mt-4"
                                                pagination={(scrollTo, current) => (
                                                    <View className="rounded-lg overflow-hidden flex-row bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 mb-4">
                                                        {tournament.broadcastTalent?.map((broadcast, index) => (
                                                            <Button
                                                                size="small"
                                                                align="center"
                                                                key={broadcast.name}
                                                                className={`flex-1 p-2 justify-center ${current === index ? '' : 'bg-transparent'}`}
                                                                onPress={() => scrollTo(index)}
                                                                textStyle={tw.style(
                                                                    current === index ? 'text-white' : textColors.subtle,
                                                                    'normal-case'
                                                                )}
                                                            >
                                                                {broadcast.name}
                                                            </Button>
                                                        ))}
                                                    </View>
                                                )}
                                                slides={tournament.broadcastTalent.map((broadcast) => (
                                                    <TournamentMarkdown>{broadcast.content}</TournamentMarkdown>
                                                ))}
                                            />
                                        </BottomSheet>
                                    </View>
                                ) : null}
                            </View>
                            {tournament.rules && (
                                <View className="gap-2">
                                    <Text variant="header">{getTranslation('tournaments.rules')}</Text>
                                    <Card direction="vertical">
                                        <TournamentMarkdown>{tournament.rules}</TournamentMarkdown>
                                    </Card>
                                </View>
                            )}
                        </View>
                    </View>,
                ]}
            />
        </ScrollView>
    );
}

function FollowHeaderButton({ id }: { id: string }) {
    const { toggleFollow, isFollowed } = useFollowedTournament(id);

    return (
        <TouchableOpacity hitSlop={10} onPress={toggleFollow}>
            <Icon prefix={isFollowed ? 'fass' : 'fasr'} icon="heart" size={20} color="text-[#ef4444]" />
        </TouchableOpacity>
    );
}

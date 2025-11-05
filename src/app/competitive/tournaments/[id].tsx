import { useRefreshControl, useTournament, useTournamentMatches, useTournamentPlacements } from '@app/api/tournaments';
import { Button } from '@app/components/button';
import { Card } from '@app/components/card';
import { FlatList } from '@app/components/flat-list';
import { HeaderTitle } from '@app/components/header-title';
import { Icon } from '@app/components/icon';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { flagEmojiDict } from '@app/helper/flags';
import { formatPrizePool, formatTier, getMatches } from '@app/helper/tournaments';
import { useFollowedTournament } from '@app/service/favorite-tournaments';
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
import { format, isValid } from 'date-fns';
import { Image } from '@/src/components/uniwind/image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { GameVersion, TournamentType } from 'liquipedia';
import { useState } from 'react';
import { Linking, TouchableOpacity, View } from 'react-native';
import { formatCurrency } from 'react-native-format-currency';
import { useTranslation } from '@app/helper/translate';
import { useProfilesByLiquipediaNames } from '@app/queries/all';
import compact from 'lodash/compact';
import { uniq } from 'lodash';
import { BottomSheet } from '@app/view/bottom-sheet';


export default function TournamentDetail() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<{ id: string[] }>();
    const id = typeof params.id === 'string' ? params.id : (params.id?.join('/') ?? '');
    const { data: tournament, ...query } = useTournament(id);
    const { data: mainTournament } = useTournament(tournament?.tabs[0]?.[0]?.path ?? id, false);
    const refreshControlProps = useRefreshControl(query);
    const [title, subtitle] = tournament?.name.split(': ') ?? [];
    const tournamentImage = tournament?.league?.image ?? mainTournament?.league?.image;
    const [showParticipantsNote, setShowParticipantsNote] = useState(false);
    const [showFormatNote, setShowFormatNote] = useState(false);
    const [visiblePopup, setVisiblePopup] = useState<string>();
    const [playoffRoundWidth, setPlayoffRoundWidth] = useState(0);
    const { data: tournamentMatches } = useTournamentMatches({ tournamentId: id });
    const { data: tournamentPlacements } = useTournamentPlacements({ tournamentId: id });
    const tournamentTabs =
        tournament?.tabs.filter(
            (tabs) => !tabs.some((tab) => [GameVersion.Age1, GameVersion.Age2, GameVersion.Age3, GameVersion.Age4].includes(tab.name as GameVersion))
        ) ?? [];

    // Not correctly parsed yet, so we use the placements to get the participant names
    // const participantLiquipediaNames2 = tournament?.participants?.map((participant) => participant.name) ?? [];
    // console.log('participantLiquipediaNames2', participantLiquipediaNames2);

    const participantLiquipediaNames = uniq([
        ...compact(tournamentPlacements?.map((placement) => placement.extradata.participantname)),
        ...compact(tournamentPlacements?.map((placement) => placement.opponentname)),
    ]);

    const { data: participantProfiles } = useProfilesByLiquipediaNames(participantLiquipediaNames);

    const nameToProfileIdDict: Record<string, number> = {};
    for (const tournamentPlacement of compact(tournamentPlacements)) {
        const participantProfile = participantProfiles?.find(
            (p) => p.socialLiquipedia === tournamentPlacement.extradata.participantname || p.socialLiquipedia === tournamentPlacement.opponentname
        );
        if (participantProfile?.profileId) {
            nameToProfileIdDict[tournamentPlacement.extradata.participantname] = participantProfile?.profileId;
            nameToProfileIdDict[tournamentPlacement.opponentname] = participantProfile?.profileId;
        }
    }

    const tournamentParticipants = tournament?.participants.map((participant) => {
        return {
            ...participant,
            profileId: nameToProfileIdDict[participant.name],
        };
    });

    const tournamentPrizes = tournament?.prizes.map((prize) => ({
        ...prize,
        participants: prize.participants.map((participant) => {
            return {
                ...participant,
                profileId: nameToProfileIdDict[participant.name],
            };
        }),
    }));

    const playoffMatches = getMatches(tournament?.playoffs);
    const groupMatches = getMatches(tournament?.groups);

    const hasResults = tournament?.groups.length || tournament?.playoffs.length || tournament?.results.length;

    const past = tournamentMatches?.every((t) => t.finished);

    const filteredMatches = past ? tournamentMatches : tournamentMatches.filter((t) => !t.finished);

    const start = tournament?.start ?? mainTournament?.start;
    const end = tournament?.end ?? mainTournament?.end;
    const countryCode = tournament?.location?.country?.code;
    const tabs = [getTranslation('tournaments.overview'), getTranslation('tournaments.schedule'), getTranslation('tournaments.moreinfo')];

    if (!tournament) {
        return (
            <ScrollView
                className="flex-1"
                contentContainerClassName={tournament && 'p-4'}
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

    const validStart = start && isValid(start);
    const validEnd = end && isValid(end);

    return (
        <ScrollView
            className="flex-1"
            contentContainerClassName={tournament && 'gap-5 py-4'}
            refreshControl={<RefreshControlThemed {...refreshControlProps} />}
        >
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: () => (
                        <View className="flex-1">
                            <HeaderTitle
                                icon={{ uri: tournamentImage }}
                                iconContentFit="contain"
                                title={title}
                                subtitle={
                                    <Text variant="label">
                                        {validStart && format(start, 'LLL d')}
                                        {validStart && validEnd && ' - '}
                                        {validEnd && format(end, 'LLL d')}
                                        {subtitle && (validStart || validEnd) && ' - '}
                                        {subtitle && <Text variant="label-sm">{subtitle.replace(tournament?.game ?? '', '').trim()}</Text>}
                                    </Text>
                                }
                            />
                        </View>
                    ),
                    headerRight: () => <HeaderButtons id={mainTournament?.path ?? id} />,
                }}
            />

            <Slider
                tabs={tabs}
                slides={[
                    <View className="gap-5">
                        {filteredMatches.length ? (
                            <View className="gap-2">
                                <Text variant="header" className="px-4">
                                    {past ? getTranslation('tournaments.pastMatches') : getTranslation('tournaments.nextScheduledMatches')}
                                </Text>
                                <FlatList
                                    data={filteredMatches}
                                    renderItem={(match) => <TournamentMatch style={{ width: 250 }} key={match.index} match={match.item} />}
                                    contentContainerClassName="gap-2 px-4"
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
                                        if (participant.profileId) {
                                            router.navigate(`/matches/users/${participant.profileId}`);
                                        }
                                    }}
                                    variant="horizontal"
                                    list={tournamentParticipants?.map((participant) => ({
                                        ...participant,
                                        name: '',
                                        participant: participant.name,
                                    }))}
                                    footer={(player) => (
                                        <View className="flex-row gap-1 items-center">
                                            <Text numberOfLines={1} variant="body-sm" allowFontScaling={false} className={`${player?.profileId ? 'font-bold' : ''}`}>
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
                                    {getTranslation('tournaments.viewPrizes')}
                                </Button>
                                <BottomSheet
                                    isActive={visiblePopup === 'prizepool'}
                                    title={getTranslation('tournaments.prizes')}
                                    closeButton
                                    onClose={() => setVisiblePopup(undefined)}
                                >
                                    <Text className="my-4">
                                        {getTranslation('tournaments.prizemoney', { amount: formatCurrency({ ...tournament.prizePool })[0] })}
                                    </Text>
                                    <TournamentPrizes prizes={tournamentPrizes} onClose={() => setVisiblePopup(undefined)} />
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
                                        <StageCard
                                            title={getTranslation('tournaments.groupstage')}
                                            matches={groupMatches}
                                            onPress={() => setVisiblePopup('group')}
                                        />

                                        <BottomSheet
                                            isActive={visiblePopup === 'group'}
                                            title={getTranslation('tournaments.groupstage')}
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
                                        <StageCard
                                            title={getTranslation('tournaments.playoffs')}
                                            matches={playoffMatches}
                                            onPress={() => setVisiblePopup('playoffs')}
                                        />

                                        <BottomSheet
                                            isActive={visiblePopup === 'playoffs'}
                                            title={getTranslation('tournaments.playoffs')}
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
                                                            contentContainerClassName="gap-5"
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
                                                    contentContainerClassName="gap-2"
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
                        {!tournament.scheduleNote && tournament.schedule.length === 0 ? (
                            <Text>{getTranslation('tournaments.schedulenotavailable')}</Text>
                        ) : null}

                        {tournament.scheduleNote && (
                            <View className="pb-4">
                                <TournamentMarkdown>{tournament.scheduleNote}</TournamentMarkdown>
                            </View>
                        )}

                        <View className="gap-2">
                            {(tournament.schedule.length
                                ? tournament.schedule.map((event) => ({
                                      startTime: isValid(event.date) ? event.date : null,
                                      header: event.round ? { name: event.round, format: event.format } : undefined,
                                      ...event,
                                  }))
                                : tournamentMatches
                            ).map((event, index) => (
                                <TournamentMatch
                                    style={{ width: '100%' }}
                                    key={`${event.startTime?.toISOString()}-${index.toString()}`}
                                    match={event as any}
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
                                                tabs={tournament.broadcastTalent.map((broadcast) => broadcast.name)}
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

function HeaderButtons({ id }: { id: string }) {
    const { toggleFollow, isFollowed } = useFollowedTournament(id);

    const openInBrowser = () => {
        Linking.openURL('https://liquipedia.net/ageofempires/' + id);
    };

    return (
        <View className="flex-row gap-4">
            <TouchableOpacity hitSlop={10} onPress={openInBrowser}>
                <Image style={{ width: 28, height: 20 }} source={require('../../../../assets/icon/liquipedia.png')} />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={10} onPress={toggleFollow}>
                <Icon prefix={isFollowed ? 'fass' : 'fasr'} icon="heart" size={20} color="text-[#ef4444]" />
            </TouchableOpacity>
        </View>
    );
}

import { useRefreshControl, useTournaments, useUpcomingTournaments } from '@app/api/tournaments';
import { Field } from '@app/components/field';
import { SectionList } from '@app/components/section-list';
import { Text } from '@app/components/text';
import { sortByTier, tournamentAbbreviation, tournamentStatus, transformSearch } from '@app/helper/tournaments';
import { getTranslation } from '@app/helper/translate';
import { useAppTheme } from '@app/theming';
import { DismissKeyboard } from '@app/view/components/dismiss-keyboard';
import { TournamentCard } from '@app/view/tournaments/tournament-card';
import { useHeaderHeight } from '@react-navigation/elements';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Tournament, TournamentCategory } from 'liquipedia';
import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import { RootStackParamList } from '../../../App2';

export default function TournamentsList() {
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ league?: string }>();
    const { league } = params;
    const { data: tournaments = [], ...leagueQuery } = useTournaments(league as TournamentCategory | undefined);
    const { data: allTournaments = [], ...allQuery } = useUpcomingTournaments();
    const query = league ? leagueQuery : allQuery;
    const [search, setSearch] = useState('');
    const theme = useAppTheme();
    const subtitleMap = {
        [getTranslation('tournaments.ongoing')]: getTranslation('tournaments.sortedbytier'),
        [getTranslation('tournaments.upcoming')]: getTranslation('tournaments.sortedbydate'),
        [getTranslation('tournaments.recent')]: getTranslation('tournaments.sortedbydate'),
    };
    const filteredTournaments = useMemo(() => {
        if (league) {
            return tournaments ?? [];
        }
        const sections: { title: string; data: Tournament[] }[] = [];
        const ongoing: Tournament[] = [];
        const upcoming: Tournament[] = [];
        const past: Tournament[] = [];

        const filteredTournaments = allTournaments.filter((tournament) => {
            return (
                transformSearch(tournament.name).includes(transformSearch(search)) ||
                tournamentAbbreviation(tournament.name).includes(transformSearch(search))
            );
        });

        filteredTournaments.map((tournament) => {
            const status = tournamentStatus(tournament);

            if (status === 'ongoing') {
                ongoing.push(tournament);
            } else if (status === 'upcoming') {
                upcoming.push(tournament);
            } else {
                past.push(tournament);
            }
        });

        if (ongoing.length > 0) {
            sections.push({
                title: getTranslation('tournaments.ongoing'),
                data: orderBy(ongoing, [sortByTier, (t) => t.end ?? t.start], ['asc', 'asc']),
            });
        }

        if (upcoming.length > 0) {
            sections.push({
                title: getTranslation('tournaments.upcoming'),
                data: orderBy(upcoming, ['start', 'end'], ['asc', 'asc']),
            });
        }

        if (past.length > 0) {
            sections.push({
                title: getTranslation('tournaments.recent'),
                data: orderBy(past, [(t) => t.end ?? t.start, (t) => t.start], ['desc', 'asc']),
            });
        }

        return sections.length > 0 ? sections : query.isFetching ? [] : [{ title: getTranslation('tournaments.noresults'), data: [] }];
    }, [league, allTournaments, tournaments, search, query.isFetching]);

    const refreshControlProps = useRefreshControl(query);

    const listHeader = useMemo(
        () =>
            league ? undefined : (
                <View style={styles.container}>
                    <View style={styles.searchContainer}>
                        <Field type="search" value={search} onChangeText={setSearch} placeholder={getTranslation('tournaments.search')} />
                    </View>
                </View>
            ),
        [search, league, theme]
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', default: 'height' })}
            className="flex-1"
            keyboardVerticalOffset={headerHeight + 36 + insets.top}
        >
            <Stack.Screen options={{ title: league ? decodeURI(league).replaceAll('_', ' ') : getTranslation('tournaments.title') }} />
            <DismissKeyboard>
                <SectionList
                    className="flex-1"
                    {...refreshControlProps}
                    ListHeaderComponent={listHeader}
                    contentContainerStyle="p-4 gap-2.5"
                    sections={filteredTournaments}
                    renderSectionHeader={({ section: { title } }) => (
                        <View className="bg-gold-50 dark:bg-blue-950 pt-2.5 pb-1 flex-row items-center justify-between">
                            <Text variant="header-lg">{title}</Text>
                            {subtitleMap[title] && (
                                <Text color="brand" variant="body-xs">
                                    {subtitleMap[title]}
                                </Text>
                            )}
                        </View>
                    )}
                    keyExtractor={(item) => item.path}
                    renderItem={({ item: tournament }) => <TournamentCard {...tournament} />}
                />
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        gap: 15,
    },
});

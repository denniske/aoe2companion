import { useRefreshControl, useUpcomingTournaments } from '@app/api/tournaments';
import { Button } from '@app/components/button';
import { Field } from '@app/components/field';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { SectionList } from '@app/components/section-list';
import { Text } from '@app/components/text';
import { sortByTier, tournamentAbbreviation, tournamentStatus, transformSearch } from '@app/helper/tournaments';
import { getTranslation } from '@app/helper/translate';
import { useAppTheme } from '@app/theming';
import { DismissKeyboard } from '@app/view/components/dismiss-keyboard';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { TournamentCard } from '@app/view/tournaments/tournament-card';
import { Stack } from 'expo-router';
import { Tournament } from 'liquipedia';
import { orderBy } from 'lodash';
import { useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';


export default function TournamentsList() {
    const { data: allTournaments = [], ...query } = useUpcomingTournaments();
    const [search, setSearch] = useState('');
    const theme = useAppTheme();
    const subtitleMap = {
        [getTranslation('tournaments.ongoing')]: getTranslation('tournaments.sortedbytier'),
        [getTranslation('tournaments.upcoming')]: getTranslation('tournaments.sortedbydate'),
        [getTranslation('tournaments.recent')]: getTranslation('tournaments.sortedbydate'),
    };
    const filteredTournaments = useMemo(() => {
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

        return sections.length > 0
            ? sections
            : query.isFetching || Platform.OS === 'web'
              ? []
              : [{ title: getTranslation('tournaments.noresults'), data: [] }];
    }, [allTournaments, search, query.isFetching]);

    const refreshControlProps = useRefreshControl(query);

    const listHeader = useMemo(
        () => (
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <Field type="search" value={search} onChangeText={setSearch} placeholder={getTranslation('tournaments.search')} />
                </View>
            </View>
        ),
        [search, theme]
    );

    return (
        <KeyboardAvoidingView>
            <Stack.Screen
                options={{
                    title: getTranslation('tournaments.title'),
                    headerRight: () => (
                        <Button size="small" href="/competitive/tournaments/all">
                            View All
                        </Button>
                    ),
                }}
            />
            <DismissKeyboard>
                <SectionList
                    ListEmptyComponent={
                        Platform.OS === 'web' ? (
                            <View className="items-center gap-4">
                                <Text variant="label-lg">{getTranslation('tournaments.noweb')}</Text>
                                <Button href="https://liquipedia.net/ageofempires/Portal:Tournaments">
                                    {getTranslation('tournaments.gotoliquipedia')}
                                </Button>
                            </View>
                        ) : null
                    }
                    className="flex-1"
                    refreshControl={<RefreshControlThemed {...refreshControlProps} />}
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

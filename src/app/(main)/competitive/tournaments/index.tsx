import { useRefreshControl, useUpcomingTournaments } from '@app/api/tournaments';
import { Button } from '@app/components/button';
import { Field } from '@app/components/field';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { SectionList } from '@app/components/section-list';
import { Text } from '@app/components/text';
import { sortByTier, tournamentAbbreviation, tournamentStatus, transformSearch } from '@app/helper/tournaments';
import { useAppTheme } from '@app/theming';
import { DismissKeyboard } from '@app/view/components/dismiss-keyboard';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { TournamentCard } from '@app/view/tournaments/tournament-card';
import { Stack } from 'expo-router';
import { Tournament } from 'liquipedia';
import { orderBy } from 'lodash';
import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';


export default function TournamentsList() {
    const getTranslation = useTranslation();
    const { data: allTournaments = [], ...query } = useUpcomingTournaments();
    const [search, setSearch] = useState('');
    const theme = useAppTheme();
    // Keys are bound to locals first: React Compiler cannot lower a computed key
    // that is a call expression, and bails out on the whole component.
    const ongoingTitle = getTranslation('tournaments.ongoing');
    const upcomingTitle = getTranslation('tournaments.upcoming');
    const recentTitle = getTranslation('tournaments.recent');
    const subtitleMap = {
        [ongoingTitle]: getTranslation('tournaments.sortedbytier'),
        [upcomingTitle]: getTranslation('tournaments.sortedbydate'),
        [recentTitle]: getTranslation('tournaments.sortedbydate'),
    };
    const sections: { title: string; data: Tournament[] }[] = [];
    const ongoing: Tournament[] = [];
    const upcoming: Tournament[] = [];
    const past: Tournament[] = [];

    const matchingTournaments = allTournaments.filter((tournament) => {
        return (
            transformSearch(tournament.name).includes(transformSearch(search)) ||
            tournamentAbbreviation(tournament.name).includes(transformSearch(search))
        );
    });

    matchingTournaments.forEach((tournament) => {
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

    const filteredTournaments =
        sections.length > 0
            ? sections
            : query.isFetching || Platform.OS === 'web'
              ? []
              : [{ title: getTranslation('tournaments.noresults'), data: [] }];

    const refreshControlProps = useRefreshControl(query);

    const listHeader = (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Field type="search" value={search} onChangeText={setSearch} placeholder={getTranslation('tournaments.search')} />
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView>
            <Stack.Screen
                options={{
                    title: getTranslation('tournaments.title'),
                    headerRight: () => (
                        <Button size="small" href="/competitive/tournaments/all">
                            {getTranslation('home.viewAll')}
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
                    contentContainerClassName="p-4 gap-2.5"
                    sections={filteredTournaments}
                    renderSectionHeader={({ section: { title } }) => (
                        // The sticky background has to be wider than the cards it covers,
                        // otherwise their borders and shadows show past its edges as they
                        // scroll underneath. Bleed past the list's p-4 and re-add it here.
                        <View className="bg-gold-50 dark:bg-blue-950 pt-2.5 pb-1 flex-row items-center justify-between -mx-4 px-4">
                            <Text variant="header-lg">{title}</Text>
                            {!!(subtitleMap[title]) && (
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

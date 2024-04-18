import { useRefreshControl, useTournaments } from '@app/api/tournaments';
import { Button } from '@app/components/button';
import { Dropdown } from '@app/components/dropdown';
import { Field } from '@app/components/field';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { SectionList } from '@app/components/section-list';
import { Text } from '@app/components/text';
import { formatTier, formatTierShort, sortedTiers, tournamentAbbreviation, transformSearch } from '@app/helper/tournaments';
import { getTranslation } from '@app/helper/translate';
import { useAppTheme } from '@app/theming';
import { DismissKeyboard } from '@app/view/components/dismiss-keyboard';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { TournamentCard } from '@app/view/tournaments/tournament-card';
import { Stack, useLocalSearchParams } from 'expo-router';
import { TournamentCategory } from 'liquipedia';
import { useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function AllTournaments() {
    const params = useLocalSearchParams<{ league?: string }>();
    const { league } = params;
    const [category, setCategory] = useState<TournamentCategory>(sortedTiers[0]);
    const { data: tournaments = [], ...query } = useTournaments((league as TournamentCategory) || category);
    const [search, setSearch] = useState('');
    const theme = useAppTheme();
    const subtitleMap = {
        [getTranslation('tournaments.ongoing')]: getTranslation('tournaments.sortedbytier'),
        [getTranslation('tournaments.upcoming')]: getTranslation('tournaments.sortedbydate'),
        [getTranslation('tournaments.recent')]: getTranslation('tournaments.sortedbydate'),
    };
    const filteredTournaments = useMemo(() => {
        const filteredTournaments = tournaments
            .map((tournamentsSection) => {
                return {
                    ...tournamentsSection,
                    data: tournamentsSection.data.filter(
                        (tournament) =>
                            transformSearch(tournament.name).includes(transformSearch(search)) ||
                            tournamentAbbreviation(tournament.name).includes(transformSearch(search))
                    ),
                };
            })
            .filter((tournamentSection) => tournamentSection.data.length);

        return filteredTournaments.length > 0
            ? filteredTournaments
            : query.isFetching || Platform.OS === 'web'
              ? []
              : [{ title: getTranslation('tournaments.noresults'), data: [] }];
    }, [league, tournaments, search, query.isFetching]);

    const refreshControlProps = useRefreshControl(query);

    const listHeader = useMemo(
        () =>
            league ? undefined : (
                <View style={styles.container}>
                    <View style={styles.searchContainer}>
                        <Dropdown
                            style={{ minWidth: 100 }}
                            onChange={setCategory}
                            options={sortedTiers.map((tier) => ({ value: tier, label: formatTier(tier), abbreviated: formatTierShort(category) }))}
                            value={category}
                        />
                        <Field
                            className="flex-1"
                            type="search"
                            value={search}
                            onChangeText={setSearch}
                            placeholder={`Search ${formatTier(category)} Tournaments`}
                        />
                    </View>
                </View>
            ),
        [search, league, theme, setCategory, category, setSearch, formatTier, sortedTiers]
    );

    return (
        <KeyboardAvoidingView>
            <Stack.Screen options={{ title: league ? decodeURI(league).replaceAll('_', ' ') : getTranslation('tournaments.alltitle') }} />
            <DismissKeyboard>
                <SectionList
                    ListHeaderComponentStyle={{ zIndex: 100 }}
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
        flexDirection: 'row',
        gap: 8,
    },
});

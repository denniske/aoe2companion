import { useRefreshControl, useTournaments } from '@app/api/tournaments';
import { Dropdown } from '@app/components/dropdown';
import { Field } from '@app/components/field';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { SectionList } from '@app/components/section-list';
import { Text } from '@app/components/text';
import {
    formatTier,
    formatTierShort,
    sortedTiers,
    tournamentAbbreviation,
    tournamentStatus,
    transformSearch,
} from '@app/helper/tournaments';
import { useAppTheme } from '@app/theming';
import { DismissKeyboard } from '@app/view/components/dismiss-keyboard';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { TournamentCard } from '@app/view/tournaments/tournament-card';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Tournament, TournamentCategory } from '@app/api/liquipedia.types';
import { orderBy } from 'lodash';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';

export default function AllTournaments() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<{ league?: string }>();
    const { league } = params;
    const [category, setCategory] = useState<TournamentCategory>(sortedTiers[0]);
    const { data: tournaments = [], ...query } = useTournaments(league ? { series: league } : { category });
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
    const matchingTournaments = tournaments.filter(
        (tournament) =>
            transformSearch(tournament.name).includes(transformSearch(search)) ||
            tournamentAbbreviation(tournament.name).includes(transformSearch(search))
    );
    const byStatus: Record<ReturnType<typeof tournamentStatus>, Tournament[]> = { ongoing: [], upcoming: [], past: [] };
    matchingTournaments.forEach((tournament) => byStatus[tournamentStatus(tournament)].push(tournament));
    const sections = [
        { title: ongoingTitle, data: orderBy(byStatus.ongoing, [(t) => t.end ?? t.start], ['asc']) },
        { title: upcomingTitle, data: orderBy(byStatus.upcoming, ['start', 'end'], ['asc', 'asc']) },
        { title: recentTitle, data: orderBy(byStatus.past, [(t) => t.end ?? t.start], ['desc']) },
    ].filter((section) => section.data.length);

    const filteredTournaments =
        sections.length > 0
            ? sections
            : query.isFetching
              ? []
              : [{ title: getTranslation('tournaments.noresults'), data: [] }];

    const refreshControlProps = useRefreshControl(query);

    const listHeader = league ? undefined : (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Dropdown
                    style={{ minWidth: 100, height: 45 }}
                    onChange={setCategory}
                    options={sortedTiers.map((tier) => ({ value: tier, label: formatTier(tier), abbreviated: formatTierShort(category) }))}
                    value={category}
                />
                <Field
                    containerClassName="flex-1"
                    type="search"
                    value={search}
                    onChangeText={setSearch}
                    placeholder={getTranslation('tournaments.searchTierTournaments', { tier: formatTierShort(category) })}
                />
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView>
            <Stack.Screen options={{ title: league ? decodeURIComponent(league).replaceAll('_', ' ') : getTranslation('tournaments.alltitle') }} />
            <DismissKeyboard>
                <SectionList
                    ListHeaderComponentStyle={{ zIndex: 100 }}
                    className="flex-1"
                    refreshControl={<RefreshControlThemed {...refreshControlProps} />}
                    ListHeaderComponent={listHeader}
                    contentContainerClassName="p-4 gap-2.5 flex-grow"
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
        flexDirection: 'row',
        gap: 8,
    },
});

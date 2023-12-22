import { useRefreshControl, useTournaments, useUpcomingTournaments } from '../../api/tournaments';
import { createStylesheet } from '../../theming-new';
import { KeyboardAvoidingView, Platform, SectionList, StyleSheet, TextInput, View } from 'react-native';
import { TournamentCard } from './tournament-card';
import { Tournament, TournamentCategory } from 'liquipedia';
import { useMemo, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/core';
import { RootStackParamList } from '../../../App2';
import { MyText } from '../components/my-text';
import { getTranslation } from '../../helper/translate';
import { DismissKeyboard } from '../components/dismiss-keyboard';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { orderBy } from 'lodash';
import { sortByTier, tournamentAbbreviation, tournamentStatus, transformSearch } from '../../helper/tournaments';
import { useAppTheme } from '../../theming';

export const TournamentsList: React.FC = () => {
    const styles = useStyles();
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const { params = {} } = useRoute<RouteProp<RootStackParamList, 'Tournaments'>>();
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
        const sections: Array<{ title: string; data: Tournament[] }> = [];
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
                        <TextInput
                            placeholderTextColor={theme.textNoteColor}
                            autoCorrect={false}
                            value={search}
                            onChangeText={setSearch}
                            style={styles.search}
                            placeholder={getTranslation('tournaments.search')}
                        />
                    </View>
                </View>
            ),
        [search, league]
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', default: 'height' })}
            style={[styles.screen, styles.container]}
            keyboardVerticalOffset={headerHeight + 36 + insets.top}
        >
            <DismissKeyboard>
                <SectionList
                    style={styles.container}
                    {...refreshControlProps}
                    ListHeaderComponent={listHeader}
                    contentContainerStyle={styles.contentContainer}
                    sections={filteredTournaments}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.headerContainer}>
                            <MyText style={styles.header}>{title}</MyText>
                            {subtitleMap[title] && <MyText style={styles.subtitle}>{subtitleMap[title]}</MyText>}
                        </View>
                    )}
                    keyExtractor={(item) => item.path}
                    renderItem={({ item: tournament }) => <TournamentCard {...tournament} />}
                />
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        screen: {
            backgroundColor: darkMode === 'dark' ? '#181C29' : theme.backgroundColor,
        },
        container: {
            flex: 1,
        },
        contentContainer: {
            gap: 10,
            padding: 15,
        },
        headerContainer: {
            backgroundColor: darkMode === 'dark' ? '#181C29' : theme.backgroundColor,
            paddingTop: 10,
            paddingBottom: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        header: {
            fontSize: 20,
            fontWeight: '600',
        },
        subtitle: {
            fontSize: 10,
        },
        searchContainer: {
            gap: 15,
            paddingTop: 15,
        },
        search: {
            borderColor: theme.borderColor,
            borderWidth: 1,
            padding: 10,
            borderRadius: 4,
            color: theme.textColor,
        },
    })
);

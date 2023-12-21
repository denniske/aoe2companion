import { useAllTournaments, useRefreshControl, useTournaments } from '../../api/tournaments';
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
import { isPast } from 'date-fns';

const transformSearch = (string: string) => string.toLowerCase().replace(/\'/g, '').replace(/\W/g, ' ').replace(/ +/g, ' ');
const tournamentAbbreviation = (string: string) =>
    string
        .match(/\b([A-Z0-9])/g)
        ?.join('')
        .toLowerCase() ?? '';

export const TournamentsList: React.FC = () => {
    const styles = useStyles();
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const { params = {} } = useRoute<RouteProp<RootStackParamList, 'Tournaments'>>();
    const { league } = params;
    const { data: tournaments = [], ...leagueQuery } = useTournaments(league as TournamentCategory | undefined);
    const { data: allTournaments = [], ...allQuery } = useAllTournaments();
    const query = league ? leagueQuery : allQuery;
    const [search, setSearch] = useState('');
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
            const hasTournamentStarted = isPast(tournament.start ?? new Date());
            const hasTournamentEnded = isPast(tournament.end ?? tournament.start ?? new Date());
            const isOngoing = hasTournamentStarted && !hasTournamentEnded;
            const isUpcoming = !hasTournamentStarted && !hasTournamentEnded;
            if (isOngoing) {
                ongoing.push(tournament);
            } else if (isUpcoming) {
                upcoming.push(tournament);
            } else {
                past.push(tournament);
            }
        });

        if (ongoing.length > 0) {
            sections.push({ title: getTranslation('tournaments.ongoing'), data: ongoing });
        }

        if (upcoming.length > 0) {
            sections.push({ title: getTranslation('tournaments.upcoming'), data: upcoming });
        }

        if (past.length > 0) {
            sections.push({ title: getTranslation('tournaments.past'), data: past });
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
            gap: 8,
            padding: 15,
        },
        headerContainer: {
            backgroundColor: darkMode === 'dark' ? '#181C29' : theme.backgroundColor,
            paddingTop: 10,
            paddingBottom: 5,
        },
        header: {
            fontSize: 20,
            fontWeight: '600',
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

import { useRefreshControl, useTournaments } from '../../api/tournaments';
import { createStylesheet } from '../../theming-new';
import { KeyboardAvoidingView, Platform, SectionList, StyleSheet, TextInput, View } from 'react-native';
import { TournamentCard } from './tournament-card';
import { Age2TournamentCategory, TournamentCategory } from 'liquipedia';
import { useMemo, useState } from 'react';
import { Tag } from '../components/tag';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { startCase } from 'lodash';
import { RouteProp, useRoute } from '@react-navigation/core';
import { RootStackParamList } from '../../../App2';
import { MyText } from '../components/my-text';
import { getTranslation } from '../../helper/translate';
import { DismissKeyboard } from '../components/dismiss-keyboard';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const transformSearch = (string: string) => string.toLowerCase().replace(/\'/g, '').replace(/\W/g, ' ').replace(/ +/g, ' ');
const tournamentAbbreviation = (string: string) =>
    string
        .match(/\b([A-Z0-9])/g)
        ?.join('')
        .toLowerCase() ?? '';

export const TournamentsList: React.FC = () => {
    const categories = Object.values(Age2TournamentCategory);
    const styles = useStyles();
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();
    const { params = {} } = useRoute<RouteProp<RootStackParamList, 'Tournaments'>>();
    const { league } = params;
    const [selectedCategory, setSelectedCategory] = useState<TournamentCategory | undefined>(
        (league as TournamentCategory | undefined) ?? Age2TournamentCategory.TierS
    );
    const { data: tournaments = [], ...query } = useTournaments(selectedCategory);
    const [search, setSearch] = useState('');
    const filteredTournaments = useMemo(() => {
        const sections = tournaments
            ?.map((tournamentSection) => ({
                ...tournamentSection,
                data: tournamentSection.data.filter((tournament) => {
                    return (
                        transformSearch(tournament.name).includes(transformSearch(search)) ||
                        tournamentAbbreviation(tournament.name).includes(transformSearch(search))
                    );
                }),
            }))
            .filter((tournamentSection) => tournamentSection.data.length);
        return sections.length > 0
            ? sections
            : [{ title: query.isFetching ? getTranslation('tournaments.loading') : getTranslation('tournaments.noresults'), data: [] }];
    }, [tournaments, search, query.isFetching]);

    const refreshControlProps = useRefreshControl(query);

    const listHeader = useMemo(
        () =>
            league ? undefined : (
                <View style={styles.container}>
                    <View style={styles.tagsContainer}>
                        {categories.map((category) => (
                            <TouchableOpacity onPress={() => setSelectedCategory(category)} key={category}>
                                <Tag size="large" selected={category === selectedCategory}>
                                    {startCase(category.split('/').at(-1)?.split('Tournament')[0])}
                                </Tag>
                            </TouchableOpacity>
                        ))}
                    </View>
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
        [search, categories, league]
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', default: 'height' })}
            style={styles.container}
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

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        contentContainer: {
            gap: 8,
            padding: 10,
        },
        tagsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
            justifyContent: 'center',
        },
        headerContainer: {
            backgroundColor: theme.lightBorderColor,
            paddingVertical: 10,
            marginHorizontal: -10,
            paddingHorizontal: 10,
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

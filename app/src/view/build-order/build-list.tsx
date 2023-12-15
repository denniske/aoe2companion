import BuildCard from '../components/build-order/build-card';
import { head, reverse, sortBy } from 'lodash';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import { createStylesheet } from '../../theming-new';
import { buildsData } from '../../../../data/src/data/builds';
import { useBuildFilters, useFavoritedBuilds } from '../../service/storage';
import { BuildFilters } from '../components/build-order/build-filters';
import { MyText } from '../components/my-text';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { getTranslation } from '../../helper/translate';
import { DismissKeyboard } from '../components/dismiss-keyboard';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const transformSearch = (string: string) => string.toLowerCase().replace(/\W/g, ' ').replace(/ +/g, ' ');

export const BuildListPage = () => {
    const styles = useStyles();
    const { favoriteIds, favorites, toggleFavorite, refetch } = useFavoritedBuilds();
    const buildFilters = useBuildFilters();
    const { civilization, buildType, difficulty } = buildFilters.filters;
    const [search, setSearch] = useState('');
    const headerHeight = useHeaderHeight();
    const insets = useSafeAreaInsets();

    const formattedBuilds = (buildType === 'favorites' ? favorites : buildsData).map((build) => ({
        ...build,
        avg_rating: build.avg_rating ?? 0,
        number_of_ratings: build.number_of_ratings ?? 0,
        favorited: favoriteIds.includes(build.id),
        toggleFavorite: () => toggleFavorite(build.id),
    }));
    const sortedBuilds = reverse(sortBy(formattedBuilds, ['avg_rating', 'number_of_ratings']));

    const filteredBuilds = sortedBuilds.filter(
        (build) =>
            (civilization === 'all' || build.civilization === civilization) &&
            (buildType === 'all' || buildType === 'favorites' || build.attributes.includes(buildType)) &&
            (difficulty === 'all' || difficulty === build.difficulty) &&
            transformSearch(build.title).includes(transformSearch(search))
    );

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    if (buildFilters.loading) {
        return null;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', default: 'height' })}
            style={styles.container}
            keyboardVerticalOffset={headerHeight + 36 + insets.top}
        >
            <DismissKeyboard>
                <View style={styles.container}>
                    <BuildFilters builds={buildsData} {...buildFilters} />

                    <View style={styles.searchContainer}>
                        <TextInput autoCorrect={false} value={search} onChangeText={setSearch} style={styles.search} placeholder="Search builds" />
                    </View>

                    <FlatList
                        initialNumToRender={5}
                        snapToInterval={150}
                        getItemLayout={(_, index) => ({
                            length: 150,
                            offset: 150 * index,
                            index,
                        })}
                        style={styles.container}
                        data={filteredBuilds}
                        renderItem={({ item }) => <BuildCard {...item} />}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.contentContainer}
                        ListEmptyComponent={<MyText>{getTranslation('builds.noResults')}</MyText>}
                    />
                </View>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        contentContainer: {
            gap: 15,
            paddingHorizontal: 10,
            paddingVertical: 5,
        },
        searchContainer: {
            gap: 15,
            padding: 10,
        },
        search: {
            borderColor: theme.borderColor,
            borderWidth: 1,
            padding: 10,
            borderRadius: 4,
        },
    })
);

import { Field } from '@app/components/field';
import { getTranslation } from '@app/helper/translate';
import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { reverse, sortBy } from 'lodash';
import { useCallback, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { buildsData } from '../../../../../data/src/data/builds';
import { useBuildFilters, useFavoritedBuilds } from '../../../service/storage';
import BuildCard from '../../../view/components/build-order/build-card';
import { BuildFilters } from '../../../view/components/build-order/build-filters';
import { DismissKeyboard } from '../../../view/components/dismiss-keyboard';
import { MyText } from '../../../view/components/my-text';

const transformSearch = (string: string) => string.toLowerCase().replace(/\W/g, ' ').replace(/ +/g, ' ');

export default function BuildListPage() {
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
            className="flex-1"
            keyboardVerticalOffset={headerHeight + 36 + insets.top}
        >
            <Stack.Screen options={{ title: getTranslation('builds.title') }} />
            <DismissKeyboard>
                <View className="flex-1">
                    <BuildFilters builds={buildsData} {...buildFilters} />

                    <View className="pb-4 px-4">
                        <Field autoCorrect={false} value={search} onChangeText={setSearch} placeholder={getTranslation('builds.search')} />
                    </View>

                    <FlatList
                        initialNumToRender={5}
                        snapToInterval={150}
                        getItemLayout={(_, index) => ({
                            length: 150,
                            offset: 150 * index,
                            index,
                        })}
                        className="flex-1"
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
}

const styles = StyleSheet.create({
    contentContainer: {
        gap: 15,
        paddingHorizontal: 16,
        paddingVertical: 5,
    },
});

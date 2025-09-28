import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { reverse, sortBy, startCase } from 'lodash';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';

import { buildsData } from '../../../../data/src/data/builds';
import { useBuildFilters, useFavoritedBuilds } from '../../../service/storage';
import BuildCard from '../../../view/components/build-order/build-card';
import { BuildFilters } from '../../../view/components/build-order/build-filters';
import { DismissKeyboard } from '../../../view/components/dismiss-keyboard';
import { MyText } from '../../../view/components/my-text';
import { useTranslation } from '@app/helper/translate';
import { HeaderTitle } from '@app/components/header-title';
import { getUnitIcon } from '@app/helper/units';
import { getUnitName } from '@/data';

const transformSearch = (string: string) => string.toLowerCase().replace(/\W/g, ' ').replace(/ +/g, ' ');

export default function BuildListPage() {
    const getTranslation = useTranslation();
    const { favoriteIds, favorites, toggleFavorite, refetch } = useFavoritedBuilds();
    const buildFilters = useBuildFilters();
    const { civilization, buildType, difficulty } = buildFilters.filters;
    const [search, setSearch] = useState('');

    const publishedBuilds = buildsData.filter((build) => build.status !== 'draft');

    const formattedBuilds = (buildType === 'favorites' ? favorites : publishedBuilds).map((build) => ({
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
            (transformSearch(build.title).includes(transformSearch(search)) ||
                transformSearch(build.civilization).includes(transformSearch(search)) ||
                build.attributes.some((attribute) => transformSearch(startCase(attribute)).includes(transformSearch(search))))
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
        <KeyboardAvoidingView>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <HeaderTitle
                            align="center"
                            title={getTranslation('builds.title')}
                            subtitle={'https://buildorderguide.com/'}
                            subtitleLink={'https://buildorderguide.com/'}
                        />
                    ),
                }}
            />
            <DismissKeyboard>
                <View className="flex-1">
                    <BuildFilters builds={buildsData} {...buildFilters} />

                    <View className="pb-4 px-4">
                        <Field
                            type="search"
                            value={search}
                            onChangeText={setSearch}
                            placeholder={getTranslation('builds.search')}
                            onSubmitEditing={() => {
                                const topResult = filteredBuilds[0];
                                if (topResult) {
                                    router.navigate(`/explore/build-orders/${topResult.id}`);
                                }
                            }}
                        />
                    </View>

                    <FlatList
                        className="flex-1"
                        data={filteredBuilds}
                        renderItem={({ item }) => <BuildCard {...item} />}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle="gap-4 px-4 py-1.5"
                        ListEmptyComponent={<MyText>{getTranslation('builds.noResults')}</MyText>}
                    />
                </View>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { useFocusEffect } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { BuildFilters } from '../../../view/components/build-order/build-filters';
import { DismissKeyboard } from '../../../view/components/dismiss-keyboard';
import { MyText } from '../../../view/components/my-text';
import { useTranslation } from '@app/helper/translate';
import { HeaderTitle } from '@app/components/header-title';
import { useInfiniteBuilds } from '@app/queries/all';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import FlatListLoadingIndicator from '@app/view/components/flat-list-loading-indicator';
import { BuildCard } from '@app/view/components/build-order/build-card';
import { usePrefData } from '@app/queries/prefs';
import useDebounce from '@app/hooks/use-debounce';
import { useFavoritedBuilds } from '@app/service/favorite-builds';

export default function BuildListPage() {
    const getTranslation = useTranslation();
    const { favoriteIds, toggleFavorite } = useFavoritedBuilds();
    const { civilization, buildType, difficulty } = usePrefData((state) => state?.buildFilter) || {};
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 250);
    const [refetching, setRefetching] = useState(false);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, error } = useInfiniteBuilds({
        build_ids: buildType === 'favorites' ? favoriteIds : undefined,
        civilization,
        attribute: !buildType || buildType === 'favorites' ? '' : buildType,
        difficulty: difficulty?.toString(),
        search: debouncedSearch,
    })
    const filteredBuilds = data?.pages?.flatMap((p) => p.builds); // || Array(15).fill(null);

    const onEndReached = async () => {
        if (!hasNextPage || isFetchingNextPage) return;
        fetchNextPage();
    };

    const _renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return <FlatListLoadingIndicator />;
    };

    const onRefresh = async () => {
        setRefetching(true);
        await refetch();
        setRefetching(false);
    };

    return (
        <KeyboardAvoidingView>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <HeaderTitle
                            align="center"
                            title={getTranslation('builds.title')}
                            subtitle={'buildorderguide.com'}
                            subtitleLink={'https://buildorderguide.com'}
                        />
                    ),
                }}
            />
            <DismissKeyboard>
                <View className="flex-1">
                    <BuildFilters />

                    <View className="pb-4 px-4">
                        <Field
                            type="search"
                            value={search}
                            onChangeText={setSearch}
                            placeholder={getTranslation('builds.search')}
                            onSubmitEditing={() => {
                                const topResult = filteredBuilds?.[0];
                                if (topResult) {
                                    router.navigate(`/explore/build-orders/${topResult.id}`);
                                }
                            }}
                        />
                    </View>

                    <FlatList
                        className="flex-1"
                        data={filteredBuilds || []}
                        renderItem={
                            ({ item }) => <BuildCard
                                {...item}
                                favorited={favoriteIds.includes(item.id)}
                                toggleFavorite={() => toggleFavorite(item.id)}
                            />
                        }
                        ListFooterComponent={_renderFooter}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.1}
                        keyExtractor={(item) => item.id}
                        refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={refetching} />}
                        contentContainerStyle="gap-4 px-4 pt-1.5"
                        ListEmptyComponent={<MyText>{getTranslation('builds.noResults')}</MyText>}
                    />
                </View>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

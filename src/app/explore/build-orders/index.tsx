import { Field } from '@app/components/field';
import { FlatList } from '@app/components/flat-list';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { router, Stack } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, Platform } from 'react-native';
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
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { useBreakpoints } from '@app/hooks/use-breakpoints';
import { Button } from '@app/components/button';

export default function BuildListPage() {
    const getTranslation = useTranslation();
    const { isMedium, isLarge } = useBreakpoints();
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
    });
    const filteredBuilds = useMemo(() => {
        const builds = data?.pages?.flatMap((p) => p.builds) ?? [];

        if (isLarge) {
            const remainder = builds.length % 3;
            if (remainder) {
                builds.length = builds.length + Math.abs(remainder - 3);
            }
        } else if (isMedium) {
            const remainder = builds.length % 2;
            if (remainder) {
                builds.length = builds.length + Math.abs(remainder - 2);
            }
        }

        return builds;
    }, [data]); // || Array(15).fill(null);

    const onEndReached = async () => {
        if (!hasNextPage || isFetchingNextPage) return;
        fetchNextPage();
    };

    const _renderFooter = () => {
        if (isFetchingNextPage) {
            return <FlatListLoadingIndicator />;
        }

        if (Platform.OS === 'web' && hasNextPage)
            return (
                <View className="pb-6 flex-row justify-center">
                    <Button onPress={onEndReached}>{getTranslation('footer.loadMore')}</Button>
                </View>
            );

        return null;
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
                    title: getTranslation('builds.title'),
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

                    <View className={cn('pb-4', containerClassName)}>
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
                        key={isLarge ? 'large' : isMedium ? 'medium' : 'small'}
                        numColumns={isLarge ? 3 : isMedium ? 2 : 1}
                        className="flex-1"
                        data={filteredBuilds || []}
                        columnWrapperClassName="gap-4"
                        renderItem={({ item }) =>
                            item ? (
                                <BuildCard
                                    {...item}
                                    className={isMedium ? 'flex-1' : undefined}
                                    favorited={favoriteIds.includes(item.id)}
                                    toggleFavorite={() => toggleFavorite(item.id)}
                                />
                            ) : (
                                <View className="flex-1 px-4" />
                            )
                        }
                        ListFooterComponent={_renderFooter}
                        onEndReached={Platform.OS === 'web' ? undefined : onEndReached}
                        onEndReachedThreshold={0.1}
                        keyExtractor={(item, index) => (item ? item.id : index.toString())}
                        refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={refetching} />}
                        contentContainerClassName="gap-4 px-4 pt-1.5"
                        ListEmptyComponent={<MyText>{getTranslation('builds.noResults')}</MyText>}
                    />
                </View>
            </DismissKeyboard>
        </KeyboardAvoidingView>
    );
}

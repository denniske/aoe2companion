import { Field } from '@app/components/field';
import { Text } from '@app/components/text';
import React, { useState } from 'react';
import { FlatList, Platform, View } from 'react-native';
import FlatListLoadingIndicator from './flat-list-loading-indicator';
import PlayerList from './player-list';
import RefreshControlThemed from './refresh-control-themed';
import { IProfilesResultProfile } from '@app/api/helper/api.types';
import useDebounce from '../../hooks/use-debounce';
import { useTranslation } from '@app/helper/translate';
import { useProfilesByProfileIds, useProfilesBySearchInfiniteQuery, useProfilesBySteamId } from '@app/queries/all';
import { compact } from 'lodash';
import { RecentSearches } from './recent-searches';
import { useRecentSearches } from '@app/service/recent-searches';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { Button } from '@app/components/button';

interface ISearchProps {
    title?: string;
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: IProfilesResultProfile) => React.ReactNode;
    initialText?: string;
}

function onlyDigits(str: string) {
    return /^\d+$/.test(str);
}

export default function Search({ title, selectedUser, actionText, action, initialText }: ISearchProps) {
    const { add: addRecentSearch } = useRecentSearches();
    const getTranslation = useTranslation();
    const [text, setText] = useState(initialText ?? '');
    const [reloading, setReloading] = useState(false);
    const flatListRef = React.useRef<FlatList>(null);
    const debouncedText = useDebounce(text, 250);

    const {
        data: userPages,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        refetch,
    } = useProfilesBySearchInfiniteQuery(debouncedText);
    const { data: usersBySteamId, isLoading: isLoadingUsersBySteamId } = useProfilesBySteamId(
        debouncedText,
        onlyDigits(debouncedText)
    );
    const { data: usersByProfileId, isLoading: isLoadingUsersByProfileId } = useProfilesByProfileIds(
        [parseInt(debouncedText)],
        onlyDigits(debouncedText)
    );

    const list = debouncedText.length < 2 ? [] : [...compact(usersByProfileId), ...compact(usersBySteamId), ...compact(userPages?.pages?.flatMap((p) => p.profiles))];

    const onRefresh = async () => {
        setReloading(true); // Needed for smooth animation when refreshing
        await refetch();
        setReloading(false);

        // If user switched to another page the flatlist has been destroyed already
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
    };

    const onEndReached = async () => {
        if (!hasNextPage || isFetchingNextPage) return;
        await fetchNextPage();
    };
    const _renderFooter = () => {
        if (isFetchingNextPage) {
            return <FlatListLoadingIndicator />;
        }

        if (Platform.OS === 'web' && hasNextPage)
            return (
                <View className="pt-2 pb-6 flex-row justify-center">
                    <Button onPress={onEndReached}>{getTranslation('footer.loadMore')}</Button>
                </View>
            );

        return null;
    };

    const onSelectUser = (player: IProfilesResultProfile) => {
        addRecentSearch(player);
        selectedUser?.(player);
    };

    return (
        <View className="flex-1">
            {title && <Text className="pt-4 text-center">{title}</Text>}

            <View className={cn("py-4", containerClassName)}>
                <Field
                    placeholder={getTranslation('search.placeholder')}
                    type="search"
                    autoFocus={!initialText}
                    onChangeText={setText}
                    value={text}
                />
            </View>

            {debouncedText ? (
                <PlayerList
                    flatListRef={flatListRef}
                    actionText={actionText}
                    list={list}
                    action={action}
                    selectedUser={onSelectUser}
                    ListFooterComponent={_renderFooter}
                    ListEmptyComponent={
                        debouncedText.length < 2 ? (
                            <Text color="subtle" align="center">
                                {getTranslation('search.minlength')}
                            </Text>
                        ) : !isFetching ? (
                            <>
                                <Text align="center" variant="header-sm" className="my-3">
                                    {getTranslation('search.nouserfound')}
                                </Text>
                                <Text align="center" className="px-10">
                                    {getTranslation('search.condition.1')}
                                </Text>
                            </>
                        ) : null
                    }
                    onEndReached={Platform.OS === 'web' ? undefined : onEndReached}
                    onEndReachedThreshold={0.1}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={reloading} />}
                />
            ) : (
                <RecentSearches onSelect={onSelectUser} actionText={actionText} action={action} />
            )}
        </View>
    );
}

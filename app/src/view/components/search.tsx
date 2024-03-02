import { Field } from '@app/components/field';
import { Text } from '@app/components/text';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import FlatListLoadingIndicator from './flat-list-loading-indicator';
import PlayerList from './player-list';
import RefreshControlThemed from './refresh-control-themed';
import { IProfilesResultProfile } from '../../api/helper/api.types';
import { getTranslation } from '../../helper/translate';
import useDebounce from '../../hooks/use-debounce';
import { useLazyApi } from '../../hooks/use-lazy-api';
import { loadUser, loadUserByProfileId, loadUserBySteamId } from '../../service/user';

interface ISearchProps {
    title?: string;
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: IProfilesResultProfile) => React.ReactNode;
}

export default function Search({ title, selectedUser, actionText, action }: ISearchProps) {
    const [text, setText] = useState('');
    const [fetchingMore, setFetchingMore] = useState(false);
    const [fetchedAll, setFetchedAll] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [profiles, setProfiles] = useState<any[]>([]);
    const flatListRef = React.useRef<FlatList>(null);
    const debouncedText = useDebounce(text, 250);

    const user = useLazyApi(
        {
            append: (data, newData, args) => {
                data.profiles.push(...newData.profiles);
                data.hasMore = newData.hasMore;
                data.page = newData.page;
                data.count = data.count + newData.count;
                return data;
            },
        },
        loadUser,
        1,
        text
    );

    const userByProfileId = useLazyApi({}, loadUserByProfileId, text);

    const userBySteamId = useLazyApi({}, loadUserBySteamId, text);

    const refresh = async () => {
        if (text.length < 3) {
            user.reset();
            return;
        }
        setFetching(true);
        await Promise.all([userByProfileId.refetch(text.trim()), userBySteamId.refetch(text.trim()), user.refetch(1, text.trim())]);
        setFetching(false);

        // If user switched to another page the flatlist has been destroyed already
        flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
    };

    useEffect(() => {
        if (!fetching) {
            setProfiles(
                user.data
                    ? [
                          ...(userByProfileId.data ? [userByProfileId.data] : []),
                          ...(userBySteamId.data ? [userBySteamId.data] : []),
                          ...(user.data?.profiles ?? []),
                      ]
                    : []
            );

            setFetchedAll(!user.data?.hasMore);
        }
    }, [fetching, user.data, userByProfileId.data, userBySteamId.data]);

    useEffect(() => {
        refresh();
    }, [debouncedText]);

    const list = profiles;

    const onEndReached = async () => {
        if (text.length < 3 || fetchingMore || fetchedAll || user.data == null) return;
        setFetchingMore(true);
        setFetching(true);
        await Promise.all([
            userByProfileId.refetch(text.trim()),
            userBySteamId.refetch(text.trim()),
            user.refetchAppend(user.data?.page + 1, text.trim()),
        ]);
        setFetching(false);
        setFetchingMore(false);
    };

    const _renderFooter = () => {
        if (!fetchingMore) return null;
        return <FlatListLoadingIndicator />;
    };

    return (
        <View className="flex-1">
            {title && <Text className="pt-4 text-center">{title}</Text>}

            <View className="px-4 py-4">
                <Field placeholder={getTranslation('search.placeholder')} type="search" autoFocus onChangeText={setText} value={text} />
            </View>

            <PlayerList
                flatListRef={flatListRef}
                actionText={actionText}
                list={list}
                action={action}
                selectedUser={selectedUser}
                ListFooterComponent={_renderFooter}
                ListEmptyComponent={
                    text.length < 3 ? (
                        <Text color="subtle" align="center">
                            {getTranslation('search.minlength')}
                        </Text>
                    ) : user.touched && !fetching ? (
                        <>
                            <Text align="center" variant="header-sm">
                                {getTranslation('search.nouserfound')}
                            </Text>
                            <Text align="center">{getTranslation('search.condition.1')}</Text>
                        </>
                    ) : null
                }
                onEndReached={fetchedAll ? null : onEndReached}
                onEndReachedThreshold={0.1}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={<RefreshControlThemed refreshing={user.loading} onRefresh={refresh} />}
            />
        </View>
    );
}

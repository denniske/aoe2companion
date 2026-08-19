import React, { useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import { useAppTheme } from '../../../../theming';
import { LiveMatch } from '@app/components/live/live-match';
import { Stack } from 'expo-router';
import { Field } from '@app/components/field';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { FlatList } from '@app/components/flat-list';
import { useTranslation } from '@app/helper/translate';
import { useLobbies } from '@app/api/socket/lobbies';
import { Text } from '@app/components/text';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { Button } from '@app/components/button';
import { Icon } from '@app/components/icon';
import { faExclamationTriangle, faGamepad } from '@fortawesome/free-solid-svg-icons';

export default function LiveLobbiesPage() {
    const getTranslation = useTranslation();
    const [search, setSearch] = useState('');
    const [limit, setLimit] = useState(20);

    // `useLobbies` subscribes while the screen is focused and closes the socket on blur. The screen
    // stays mounted when navigating away, so a plain `useEffect` would keep the socket open forever.
    const { lobbies: data, isLoading: isConnecting } = useLobbies({});

    const filteredData = useMemo(() => {
        const parts = search.toLowerCase().split(' ');
        const filtered = data.filter((match) => {
            if (search === '') return true;
            return parts.every((part) => {
                return (
                    match.name.toLowerCase().includes(part.toLowerCase()) ||
                    match.mapName.toLowerCase().includes(part.toLowerCase()) ||
                    match.gameModeName.toLowerCase().includes(part.toLowerCase()) ||
                    match.server?.toLowerCase().includes(part.toLowerCase()) ||
                    match.players?.some((player) => player?.name?.toLowerCase().includes(part.toLowerCase()))
                );
            });
        });
        return filtered;
    }, [data, search]);

    return (
        <KeyboardAvoidingView>
            <Stack.Screen options={{ title: getTranslation('lobbies.title') }} />

            <View className="flex-1">
                {Platform.OS !== 'web' && (
                    <View className={cn('flex-row items-center justify-center p-4 gap-2', containerClassName)}>
                        <Icon icon={faExclamationTriangle} size={16} />
                        <Text>{getTranslation('lobbies.datausagewarning')}</Text>
                    </View>
                )}

                <View className={cn('gap-2', Platform.OS === 'web' && 'pt-4', containerClassName)}>
                    <Field
                        type="search"
                        placeholder={getTranslation('lobbies.search.placeholder')}
                        onChangeText={(text) => setSearch(text)}
                        value={search}
                    />

                    <Text variant="label">
                        {isConnecting
                            ? getTranslation('lobbies.fetching')
                            : getTranslation(search ? 'lobbies.count.search' : 'lobbies.count', { count: filteredData?.length })}
                    </Text>
                </View>

                <FlatList
                    contentContainerClassName="p-4"
                    data={filteredData.slice(0, limit)}
                    renderItem={({ item, index }) => <LiveMatch data={item} expanded={index === -1} clickable />}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    keyExtractor={(item, index) => (typeof item === 'string' ? item : item.matchId?.toString())}
                    ListFooterComponent={() => (
                        <View className="flex-row items-center justify-center p-4">
                            {filteredData.length > limit && (
                                <View className="py-4 flex-row justify-center">
                                    <Button onPress={() => setLimit(limit + 20)}>{getTranslation('footer.loadMore')}</Button>
                                </View>
                            )}
                        </View>
                    )}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

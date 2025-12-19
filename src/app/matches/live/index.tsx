import { useOngoing } from '@app/api/socket/ongoing';
import { Text } from '@app/components/text';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import { useTranslation } from '@app/helper/translate';
import { getMatchFromOngoingMatch } from '@app/helper/match';
import { MatchCard } from '@app/components/match/match-card';
import { Card } from '@app/components/card';
import { Button } from '@app/components/button';
import { containerClassName, containerPaddingClassName } from '@app/styles';
import { FontAwesome5 } from '@expo/vector-icons';
import cn from 'classnames';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { FlatList } from '@app/components/flat-list';
import { Field } from '@app/components/field';
import useDebounce from '@app/hooks/use-debounce';

export default function LiveAllPage() {
    const getTranslation = useTranslation();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 250);
    const { matches, isLoading: isLoadingOngoing, connected: connectedOngoing, connect: connectOngoing } = useOngoing({});
    const [limit, setLimit] = useState(20);

    const isLoading = isLoadingOngoing;
    const connected = connectedOngoing;
    const connect = async () => {
        await connectOngoing();
    };

    const filteredMatches = useMemo(() => {
        const parts = debouncedSearch.toLowerCase().split(' ');
        const filtered = matches.filter((match) => {
            if (debouncedSearch === '') return true;
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
        return filtered.map((m) => getMatchFromOngoingMatch(m));
    }, [matches, debouncedSearch]);

    const router = useRouter();

    const openMatch = (matchId: number) => {
        router.push(`/matches/${matchId}`);
    };

    const openLobby = (lobbyId: number) => {
        router.push(`/matches/lobbies/${lobbyId}`);
    };

    return (
        <KeyboardAvoidingView>
            <View className="flex-1 gap-4">
                <Stack.Screen options={{ title: getTranslation('ongoing.title') }} />

                {Platform.OS !== 'web' && (
                    <View className={cn('flex-row items-center justify-center p-4 gap-2', containerClassName)}>
                        <FontAwesome5 name="exclamation-triangle" size={14} />
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

                    {!isLoading && connected ? (
                        <Text variant="label">
                            There are {filteredMatches.length} ongoing matches{search ? ' that match your search' : ''}
                        </Text>
                    ) : null}

                    {isLoading && (
                        <Card direction="vertical">
                            <Text className="text-center">{getTranslation('matches.current.loading')}</Text>
                        </Card>
                    )}

                    {!isLoading && !connected && (
                        <Card direction="vertical">
                            <Text className="text-center">{getTranslation('matches.current.connectionlost')}</Text>
                            <Button onPress={connect} className="justify-center">
                                {getTranslation('matches.current.reconnect')}
                            </Button>
                        </Card>
                    )}
                </View>

                <FlatList
                    contentContainerClassName={containerPaddingClassName}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    data={filteredMatches.slice(0, limit)}
                    renderItem={({ item: match }) => <MatchCard match={match} onPress={() => openMatch(match.matchId)} />}
                    ListFooterComponent={() => (
                        <View className="flex-row items-center justify-center p-4">
                            {filteredMatches.length > limit && (
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

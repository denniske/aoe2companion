import React, { useEffect, useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import { useAppTheme } from '../../../theming';
import { LiveMatch } from '@app/components/live/live-match';
import { FontAwesome5 } from '@expo/vector-icons';
import { ILobbiesMatch } from '../../../api/helper/api.types';
import { Stack, useRouter } from 'expo-router';
import { Field } from '@app/components/field';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { FlatList } from '@app/components/flat-list';
import { useTranslation } from '@app/helper/translate';
import { initLobbySubscription } from '@app/api/socket/lobbies';
import { Text } from '@app/components/text';
import cn from 'classnames';
import { containerClassName } from '@app/styles';

export default function LiveLobbiesPage() {
    const getTranslation = useTranslation();
    const theme = useAppTheme();
    const [usage, setUsage] = useState(0);
    const [search, setSearch] = useState('');

    const [data, setData] = useState<ILobbiesMatch[]>([]);
    const [isConnecting, setIsConnecting] = useState(true);
    const [connected, setConnected] = useState(false);

    const router = useRouter();

    const connect = async () => {
        setIsConnecting(true);

        await initLobbySubscription({
            onOpen: () => {
                setConnected(true);
            },
            onClose: () => {
                setIsConnecting(false);
                setConnected(false);
            },
            onLobbies: (_lobbies: any[]) => {
                setIsConnecting(false);
                setData(_lobbies);
            },
        });
    };

    useEffect(() => {
        connect();
    }, []);

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

    const openLobby = (lobbyId: number) => {
        router.push(`/matches/lobby/${lobbyId}`);
    };

    return (
        <KeyboardAvoidingView>
            <Stack.Screen options={{ title: getTranslation('lobbies.title') }} />

            <View className="flex-1">
                {Platform.OS !== 'web' && (
                    <View className={cn('flex-row items-center justify-center p-4 gap-2', containerClassName)}>
                        <FontAwesome5 name="exclamation-triangle" size={14} color={theme.textNoteColor} />
                        <Text>{getTranslation('lobbies.datausagewarning', { usage: (usage / 1000000).toFixed(1) })}</Text>
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
                        {isConnecting ? 'Fetching lobbies...' : `There are ${filteredData?.length} ${search ? 'matching ' : ''}open lobbies`}
                    </Text>
                </View>

                <FlatList
                    contentContainerClassName="p-4"
                    data={filteredData}
                    renderItem={({ item, index }) => (
                        <LiveMatch data={item as any} expanded={index === -1} onPress={() => openLobby((item as ILobbiesMatch).matchId)} />
                    )}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    keyExtractor={(item, index) => (typeof item === 'string' ? item : item.matchId?.toString())}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useAppTheme } from '../../theming';
import { LiveMatch } from '@app/components/live/live-match';
import { FontAwesome5 } from '@expo/vector-icons';
import { ILobbiesMatch } from '../../api/helper/api.types';
import { useNavigation, useRouter } from 'expo-router';
import { Field } from '@app/components/field';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { FlatList } from '@app/components/flat-list';
import { useTranslation } from '@app/helper/translate';
import { initLobbySubscription } from '@app/api/socket/lobbies';
import { Text } from '@app/components/text';

export default function LivePage() {
    const getTranslation = useTranslation();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: getTranslation('lobbies.title') });
    }, [navigation]);

    const theme = useAppTheme();
    const [usage, setUsage] = useState(0);
    const [search, setSearch] = useState('');

    const [data, setData] = useState<ILobbiesMatch[]>([]);
    const [filteredData, setFilteredData] = useState<ILobbiesMatch[]>([]);
    const [connected, setConnected] = useState(false);

    const router = useRouter();

    const connect = async () => {
        await initLobbySubscription({
            onOpen: () => {
                setConnected(true);
            },
            onClose: () => {
                setConnected(false);
            },
            onLobbies: (_lobbies: any[]) => {
                setData(_lobbies);
            },
        });
    };

    useEffect(() => {
        connect();
    }, []);

    useEffect(() => {
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
        setFilteredData(filtered);
    }, [data, search]);

    const list = ['header', ...(filteredData || Array(15).fill(null))];

    const openLobby = (lobbyId: number) => {
        router.push(`/matches/lobby/${lobbyId}`);
    };

    return (
        <KeyboardAvoidingView>
            <View className="flex-1">
                <View className="flex-row items-center justify-center p-4 gap-2">
                    <FontAwesome5 name="exclamation-triangle" size={14} color={theme.textNoteColor} />
                    <Text>
                        {getTranslation('lobbies.datausagewarning', { usage: (usage / 1000000).toFixed(1) })}
                    </Text>
                </View>

                <View className="px-4">
                    <Field
                        type="search"
                        placeholder={getTranslation('lobbies.search.placeholder')}
                        onChangeText={(text) => setSearch(text)}
                        value={search}
                    />
                </View>
                <FlatList
                    contentContainerClassName="p-4"
                    data={list}
                    renderItem={({ item, index }) => {
                        switch (item) {
                            case 'header':
                                return <Text className="text-center">{filteredData?.length} lobbies</Text>;
                            default:
                                return <LiveMatch data={item as any} expanded={index === -1} onPress={() => openLobby((item as ILobbiesMatch).matchId)}  />;
                        }
                    }}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    keyExtractor={(item, index) => (typeof item === 'string' ? item : item.matchId?.toString())}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

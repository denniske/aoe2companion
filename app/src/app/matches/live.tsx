import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../theming';
import { LiveGame } from '@app/view/live/live-game';
import { MyText } from '@app/view/components/my-text';
import { FontAwesome5 } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';
import { createStylesheet } from '../../theming-new';
import { getTranslation } from '../../helper/translate';
import { ICloseEvent, w3cwebsocket } from 'websocket';
import produce from 'immer';
import { getHost } from '@nex/data';
import { ILobbiesMatch } from '../../api/helper/api.types';

export interface IMatchesMatchPlayer2 {
    matchId: number;
    profileId: number;
    name?: string;
    rating?: number;
    ratingDiff?: number;
    games?: number;
    wins?: number;
    losses?: number;
    drops?: number;
    civ: number;
    civName: string;
    civImageUrl: string;
    color: number;
    colorHex: string;
    slot: number;
    team?: number;
    won?: boolean;
}

interface IConnectionHandler {
    onOpen?: () => void;
    onLobbies?: (_lobbies: any[]) => void;
    onClose?: (event: ICloseEvent) => void;
}

function initConnection(handler: IConnectionHandler): Promise<void> {
    return new Promise((resolve) => {
        const client = new w3cwebsocket(`${getHost('aoe2companion-socket')}listen?handler=lobbies`);

        client.onopen = () => {
            console.log('WebSocket client connected');
            handler.onOpen?.();
            resolve();
        };

        let lastMessage = '';

        client.onmessage = (messageEvent) => {
            if (lastMessage === messageEvent.data) return;
            lastMessage = messageEvent.data as string;

            const message = JSON.parse(messageEvent.data as string);
            if (message.type != 'pong') {
                handler.onLobbies?.(message);
            }
        };

        client.onerror = (error) => {
            console.log('WebSocket client error', error);
        };

        client.onclose = (event: ICloseEvent) => {
            console.log('WebSocket client closed', event);
            handler.onClose?.(event);
        };
    });
}

interface ILobbyAddedEvent {
    type: 'lobbyAdded';
    data: ILobbiesMatch;
}

interface ILobbyUpdatedEvent {
    type: 'lobbyUpdated';
    data: ILobbiesMatch;
}

interface ILobbyRemovedEvent {
    type: 'lobbyRemoved';
    data: { matchId: number };
}

interface ISlotAddedEvent {
    type: 'slotAdded';
    data: IMatchesMatchPlayer2;
}

interface ISlotUpdatedEvent {
    type: 'slotUpdated';
    data: IMatchesMatchPlayer2;
}

interface ISlotRemovedEvent {
    type: 'slotRemoved';
    data: { matchId: number; slot: number };
}

type ILobbyEvent = ILobbyAddedEvent | ILobbyUpdatedEvent | ILobbyRemovedEvent | ISlotAddedEvent | ISlotUpdatedEvent | ISlotRemovedEvent;

export function initLobbySubscription(handler: IConnectionHandler): Promise<void> {
    let _lobbies: any[] = [];

    return initConnection({
        onOpen: handler.onOpen,
        onClose: handler.onClose,
        onLobbies: (events: ILobbyEvent[]) => {
            _lobbies = produce(_lobbies, (lobbies) => {
                for (const event of events) {
                    const lobby = lobbies.find((lobby) => lobby.matchId == event.data.matchId);

                    switch (event.type) {
                        case 'lobbyAdded':
                            lobbies.push(event.data);
                            break;
                        case 'lobbyUpdated':
                            Object.assign(lobby, event.data);
                            break;
                        case 'lobbyRemoved':
                            lobbies.splice(lobbies.indexOf(lobby), 1);
                            break;
                        case 'slotAdded':
                            lobby.players = lobby.players || [];
                            lobby.players[event.data.slot] = event.data;
                            break;
                        case 'slotUpdated':
                            Object.assign(lobby.players[event.data.slot], event.data);
                            break;
                        case 'slotRemoved':
                            delete lobby.players[event.data.slot];
                            break;
                    }
                }
            });
            handler.onLobbies?.(_lobbies);
        },
    });
}

export default function LivePage() {
    const styles = useStyles();
    const theme = useAppTheme();
    const [usage, setUsage] = useState(0);
    const [search, setSearch] = useState('');

    const [data, setData] = useState<ILobbiesMatch[]>([]);
    const [filteredData, setFilteredData] = useState<ILobbiesMatch[]>([]);
    // const [expandedDict, setExpandedDict] = useState<{ [key: string]: boolean }>({});
    const [connected, setConnected] = useState(false);

    // const toggleExpanded = (matchId: number) => {
    //     expandedDict[matchId] = !expandedDict[matchId];
    //     setExpandedDict({...expandedDict});
    // };

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

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.usageRow}>
                    <FontAwesome5 style={styles.usageIcon} name="exclamation-triangle" size={14} color={theme.textNoteColor} />
                    <MyText style={styles.usageText}>{getTranslation('lobbies.datausagewarning', { usage: (usage / 1000000).toFixed(1) })}</MyText>
                </View>
                <Searchbar
                    style={styles.searchbar}
                    placeholder={getTranslation('lobbies.search.placeholder')}
                    onChangeText={(text) => setSearch(text)}
                    value={search}
                />
                <FlatList
                    contentContainerStyle={styles.list}
                    data={list}
                    renderItem={({ item, index }) => {
                        switch (item) {
                            case 'header':
                                return <MyText style={styles.header}>{filteredData?.length} lobbies</MyText>;
                            default:
                                return <LiveGame data={item as any} expanded={index === -1} />;
                        }
                    }}
                    keyExtractor={(item, index) => (typeof item === 'string' ? item : item.matchId?.toString())}
                />
            </View>
        </View>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        searchbar: {
            borderRadius: 0,
            paddingHorizontal: 10,
        },

        header: {
            textAlign: 'center',
            marginBottom: 15,
        },

        usageRow: {
            backgroundColor: theme.backgroundColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 15,
            paddingTop: 15,
        },
        usageIcon: {
            marginRight: 5,
        },
        usageText: {
            color: theme.textNoteColor,
        },

        list: {
            padding: 20,
        },
        container: {
            flex: 1,
            // backgroundColor: '#B89579',
        },
        content: {
            flex: 1,
        },
    })
);

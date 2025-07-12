import { ILobbiesMatch } from '@app/api/helper/api.types';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ICloseEvent, w3cwebsocket } from 'websocket';
import { decamelizeKeys } from 'humps';
import { getHost, makeQueryString } from '@nex/data';
import produce from 'immer';

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
    onMessage?: (message: any) => void;
    onLobbies?: (_lobbies: any[]) => void;
    onClose?: (event: ICloseEvent) => void;
}

function initConnection(handler: IConnectionHandler, profileIds?: number[], verified?: boolean, matchIds?: number[]): Promise<w3cwebsocket> {
    return new Promise((resolve) => {
        const queryString = makeQueryString(
            decamelizeKeys({
                handler: 'lobbies',
                profileIds,
                verified,
                matchIds,
            })
        );
        const url = `${getHost('aoe2companion-socket')}listen?${queryString}`;
        console.log('WebSocket URL', url);
        const client = new w3cwebsocket(url);

        client.onopen = () => {
            console.log('WebSocket client connected');
            handler.onOpen?.();
            resolve(client);
        };

        let lastMessage = '';

        client.onmessage = (messageEvent) => {
            if (lastMessage === messageEvent.data) return;
            lastMessage = messageEvent.data as string;

            const message = JSON.parse(messageEvent.data as string);
            handler.onMessage?.(message);
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

export function initLobbySubscription(
    handler: IConnectionHandler,
    profileIds?: number[],
    verified?: boolean,
    matchIds?: number[]
): Promise<w3cwebsocket> {
    let _lobbies: any[] = [];

    return initConnection(
        {
            onOpen: handler.onOpen,
            onClose: handler.onClose,
            onLobbies: (events: ILobbyEvent[]) => {
                _lobbies = produce(_lobbies, (lobbies) => {
                    for (const event of events) {
                        let lobby = lobbies.find((lobby) => lobby.matchId == event.data.matchId);

                        if (lobby == null && (profileIds != null || verified != null)) {
                            // If the lobby is not found, we create a new one
                            lobby = { matchId: event.data.matchId, players: [] };
                            lobbies.push(lobby);
                        }

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
            onMessage: handler.onMessage,
        },
        profileIds,
        verified,
        matchIds
    );
}

interface IUseLobbiesParams {
    profileIds?: number[];
    verified?: boolean;
    matchIds?: number[];
    enabled?: boolean;
}

export const useLobbies = ({profileIds, verified, matchIds, enabled = true}: IUseLobbiesParams) => {
    const [lobbies, setLobbies] = useState<ILobbiesMatch[]>([]);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const connect = async (_profileIds?: number[], _verified?: boolean) => {
        return await initLobbySubscription(
            {
                onOpen: () => {
                    setConnected(true);
                },
                onClose: () => {
                    setConnected(false);
                },
                onLobbies: (_lobbies: any[]) => {
                    setLobbies(_lobbies);
                },
                onMessage: () => {
                    setIsLoading(false);
                },
            },
            _profileIds,
            _verified,
            matchIds,
        );
    };

    useFocusEffect(
        useCallback(() => {
            if (!enabled) return;
            let socket: w3cwebsocket;
            connect(profileIds, verified).then((s) => (socket = s));
            return () => {
                socket?.close();
            };
        }, [matchIds, enabled])
    );

    return { lobbies, connected, isLoading };
};

import { dateReviver, getHost } from '@nex/data';
import { useFocusEffect } from 'expo-router';
import produce from 'immer';
import { useCallback, useState } from 'react';
import { ICloseEvent, w3cwebsocket } from 'websocket';

import { IMatchesMatch } from './helper/api.types';

interface IConnectionHandler {
    onOpen?: () => void;
    onMessage?: (message: any) => void;
    onMatches?: (_matches: any[]) => void;
    onClose?: (event: ICloseEvent) => void;
}

function initConnection(handler: IConnectionHandler, followingIds: number[]): Promise<w3cwebsocket> {
    return new Promise((resolve) => {
        const client = new w3cwebsocket(`${getHost('aoe2companion-socket')}listen?handler=ongoing-matches&profile_ids=${followingIds.join(',')}`);

        client.onopen = () => {
            handler.onOpen?.();
            resolve(client);
        };

        client.onmessage = (messageEvent) => {
            const message = JSON.parse(messageEvent.data as string, dateReviver);
            handler.onMessage?.(message);
            if (message.type != 'pong') {
                handler.onMatches?.(message);
            }
        };

        client.onerror = (error) => {
            console.log('WebSocket client error', error);
        };

        client.onclose = (event: ICloseEvent) => {
            handler.onClose?.(event);
        };
    });
}

interface IMatchAddedEvent {
    type: 'matchAdded';
    data: IMatchesMatch;
}

interface IMatchUpdatedEvent {
    type: 'matchUpdated';
    data: IMatchesMatch;
}

interface IMatchRemovedEvent {
    type: 'matchRemoved';
    data: { matchId: number };
}

type IMatchEvent = IMatchAddedEvent | IMatchUpdatedEvent | IMatchRemovedEvent;

export function initMatchSubscription(handler: IConnectionHandler, followingIds: number[]): Promise<w3cwebsocket> {
    let _matches: any[] = [];

    return initConnection(
        {
            onOpen: handler.onOpen,
            onClose: handler.onClose,
            onMatches: (events: IMatchEvent[]) => {
                _matches = produce(_matches, (matches) => {
                    for (const event of events) {
                        const match = matches.find((match) => match.matchId == event.data.matchId);

                        switch (event.type) {
                            case 'matchAdded':
                                matches.push(event.data);
                                break;
                            case 'matchUpdated':
                                Object.assign(match, event.data);
                                break;
                            case 'matchRemoved':
                                matches.splice(matches.indexOf(match), 1);
                                break;
                        }
                    }
                });
                handler.onMatches?.(_matches);
            },
            onMessage: handler.onMessage,
        },
        followingIds
    );
}

export const useOngoing = (profileIds: number[]) => {
    const [matches, setMatches] = useState<IMatchesMatch[]>([]);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const connect = async (followingIds: number[]) => {
        return await initMatchSubscription(
            {
                onOpen: () => {
                    setConnected(true);
                },
                onClose: () => {
                    setConnected(false);
                },
                onMatches: (newMatches: IMatchesMatch[]) => {
                    setMatches(newMatches);
                },
                onMessage: () => {
                    setIsLoading(false);
                },
            },
            followingIds
        );
    };

    useFocusEffect(
        useCallback(() => {
            let socket: w3cwebsocket;
            connect(profileIds).then((s) => (socket = s));
            return () => {
                socket?.close();
            };
        }, [])
    );

    return { matches, connected, isLoading };
};

import { dateReviver, getHost } from '@nex/data';
import { useFocusEffect } from 'expo-router';
import produce from 'immer';
import { useState } from 'react';
import { ICloseEvent, w3cwebsocket } from 'websocket';
import { IMatchesMatch } from '../helper/api.types';
import { makeQueryString } from '@app/api/helper/util';
import { decamelizeKeys } from 'humps';
import { useIsFocused } from "expo-router/react-navigation";
import { cloneDeep } from 'lodash';

interface IConnectionHandler {
    onOpen?: () => void;
    onMessage?: (message: any) => void;
    onMatches?: (_matches: any[]) => void;
    onMatchAdded?: (match: any) => void;
    onMatchRemoved?: (match: any) => void;
    onMatchUpdated?: (match: any) => void;
    onClose?: (event: ICloseEvent) => void;
}

function initConnection(handler: IConnectionHandler, profileIds?: number[], verified?: boolean): Promise<w3cwebsocket> {
    return new Promise((resolve) => {
        const queryString = makeQueryString(
            decamelizeKeys({
                handler: 'ongoing-matches',
                profileIds,
                verified,
            })
        );
        const url = `${getHost('aoe2companion-socket')}listen?${queryString}`;
        // console.log('WebSocket URL', url);
        const client = new w3cwebsocket(url);

        // Resolve immediately (not in `onopen`) so the caller can always close the socket,
        // even when it is closed again before the connection has been established.
        resolve(client);

        client.onopen = () => {
            handler.onOpen?.();
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

export function initMatchSubscription(handler: IConnectionHandler, profileIds?: number[], verified?: boolean): Promise<w3cwebsocket> {
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
                                handler.onMatchAdded?.(event.data);
                                break;
                            case 'matchUpdated':
                                Object.assign(match, event.data);
                                handler.onMatchUpdated?.(match);
                                break;
                            case 'matchRemoved': {
                                // `indexOf` is -1 for a match we never received, and `splice(-1, 1)`
                                // would silently remove the last match of the list instead
                                const index = matches.indexOf(match);
                                if (index === -1) break;
                                handler.onMatchRemoved?.(cloneDeep({ ...match, finished: new Date() }));
                                matches.splice(index, 1);
                                break;
                            }
                        }
                    }
                });
                handler.onMatches?.(_matches);
            },
            onMessage: handler.onMessage,
        },
        profileIds,
        verified,
    );
}

interface IUseOngoingParams {
    profileIds?: number[];
    verified?: boolean;
    enabled?: boolean;
}

export const useOngoing = ({profileIds, verified, enabled = true}: IUseOngoingParams) => {
    const [matches, setMatches] = useState<IMatchesMatch[]>([]);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const focused = useIsFocused();

    const connect = async (_profileIds?: number[], _verified?: boolean) => {
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
            _profileIds,
            _verified,
        );
    };

    useFocusEffect(() => {
        if (!enabled) return;
        let socket: w3cwebsocket | undefined;
        let cancelled = false;
        connect(profileIds, verified).then((s) => {
            socket = s;
            // The screen may already have been blurred/unmounted while the socket was being created.
            if (cancelled) s.close();
        });
        setIsLoading(true);
        return () => {
            cancelled = true;
            socket?.close();
        };
    });

    return { matches, connected: connected || !focused, isLoading, connect: () => connect(profileIds, verified) };
};

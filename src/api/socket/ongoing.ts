import { dateReviver, getHost, getLanguage } from '@nex/data';
import { useFocusEffect } from 'expo-router';
import { produce } from 'immer';
import { useRef, useState } from 'react';
import { ICloseEvent, w3cwebsocket } from 'websocket';
import { IMatchesMatch } from '../helper/api.types';
import { makeQueryString } from '@app/api/helper/util';
import { decamelizeKeys } from 'humps';
import { useIsFocused } from "expo-router/react-navigation";
import { useLanguage } from '@app/queries/all';
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

function initConnection(handler: IConnectionHandler, profileIds?: number[], verified?: boolean): w3cwebsocket {
    const queryString = makeQueryString(
        decamelizeKeys({
            handler: 'ongoing-matches',
            // The server localises map and game mode names, so it needs the
            // language just like the REST endpoints do.
            language: getLanguage(),
            profileIds,
            verified,
        })
    );
    const url = `${getHost('aoe2companion-socket')}listen?${queryString}`;
    // console.log('WebSocket URL', url);
    const client = new w3cwebsocket(url);

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

    // The client is returned right away, so the caller can always close it, even before the
    // connection has been established.
    return client;
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

export function initMatchSubscription(handler: IConnectionHandler, profileIds?: number[], verified?: boolean): w3cwebsocket {
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
    const socket = useRef<w3cwebsocket>(undefined);
    // The server localises map and game mode names from the language on the
    // connection. Connecting before the account has loaded would subscribe with
    // the 'en' fallback and keep serving English names for the whole session.
    const language = useLanguage();

    const connect = (_profileIds?: number[], _verified?: boolean) => {
        // There is nothing to subscribe to, e.g. a subscription by profile ids without any profile id
        if (!enabled || !language) return;

        // Reconnecting would otherwise leave the previous socket open
        socket.current?.close();

        socket.current = initMatchSubscription(
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

        return socket.current;
    };

    useFocusEffect(() => {
        if (enabled && language) {
            connect(profileIds, verified);
            setIsLoading(true);
        }

        // Cleaned up even when disabled, `connect` is also called by the caller
        return () => {
            socket.current?.close();
            socket.current = undefined;
        };
    });

    return { matches, connected: connected || !focused, isLoading, connect: () => connect(profileIds, verified) };
};

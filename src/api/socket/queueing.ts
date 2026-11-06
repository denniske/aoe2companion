import { getHost, getLanguage, makeQueryString } from '@nex/data';
import { useFocusEffect } from 'expo-router';
import { useIsFocused } from 'expo-router/react-navigation';
import { decamelizeKeys } from 'humps';
import { produce } from 'immer';
import { sortBy } from 'lodash';
import { useRef, useState } from 'react';
import { ICloseEvent, w3cwebsocket } from 'websocket';
import { useLanguage } from '@app/queries/all';

export interface IQueueingPlayer {
    profileId: number;
    name: string;
    country?: string;
    clan?: string;
    verified: boolean;
}

export interface IQueueingMatchPlayer extends IQueueingPlayer {
    // 0 until the players have picked, which happens after the match has formed.
    civ: number;
    team: number;
    // Null until the match reaches the database, which is when its leaderboard becomes known.
    rating?: number;
    rank?: number;
}

export interface IQueueingSearch {
    // Opaque, stable for the lifetime of the search. Only used to pair updates and removals.
    id: string;
    status: 'queueing';
    partyLeaderProfileId: number;
    // Everyone searching together, the leader included.
    players: IQueueingPlayer[];
    verified: boolean;
    queueingSince: string;
    lastSeen: string;
}

export interface IQueueingMatch {
    id: string;
    status: 'matched';
    matchId: number;
    server: string;
    matchedAt: string;
    verified: boolean;
    // Usually there from the start. The map can be missing for a cycle and can change until the
    // match starts, so a queueingUpdated may replace it.
    leaderboard?: string;
    mapImageUrl?: string;
    // The map's enum (rm_arabia) and its name in the connection's language. The enum is null for
    // custom and mod maps; those still get a name.
    map?: string | null;
    mapName?: string | null;
    players: IQueueingMatchPlayer[];
}

export type IQueueingItem = IQueueingSearch | IQueueingMatch;

interface IConnectionHandler {
    onOpen?: () => void;
    onMessage?: (message: any) => void;
    // Events on the way in, the accumulated players on the way out -- the same shape the
    // ongoing and lobby subscriptions use.
    onPlayers?: (_players: any[]) => void;
    onClose?: (event: ICloseEvent) => void;
}

function initConnection(handler: IConnectionHandler, profileIds?: number[], verified?: boolean): w3cwebsocket {
    const queryString = makeQueryString(
        decamelizeKeys({
            handler: 'queueing',
            // The server names the map in this language.
            language: getLanguage(),
            profileIds,
            verified,
        })
    );
    const url = `${getHost('aoe2companion-socket')}listen?${queryString}`;
    const client = new w3cwebsocket(url);

    client.onopen = () => {
        handler.onOpen?.();
    };

    client.onmessage = (messageEvent) => {
        const message = JSON.parse(messageEvent.data as string);
        handler.onMessage?.(message);
        if (message.type != 'pong') {
            handler.onPlayers?.(message);
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

interface IQueueingAddedEvent {
    type: 'queueingAdded';
    data: IQueueingItem;
}

interface IQueueingUpdatedEvent {
    type: 'queueingUpdated';
    data: IQueueingItem;
}

// Why an item went away. A search ends as `matched` when it turns into a match item, `left` when
// the party left the multiplayer menu, `started` when it was seen in a game without a match item,
// and `timeout` when it was around too long -- usually a cancel, which is invisible to the server.
// A match item ends as `started`, `cancelled` (profileIds: the party that backed out) or `expired`.
export type IQueueingRemovedReason = 'matched' | 'left' | 'started' | 'timeout' | 'cancelled' | 'expired';

interface IQueueingRemovedEvent {
    type: 'queueingRemoved';
    data: { id: string; reason: IQueueingRemovedReason; matchId?: number; profileIds?: number[] };
}

type IQueueingEvent = IQueueingAddedEvent | IQueueingUpdatedEvent | IQueueingRemovedEvent;

export function initQueueingSubscription(handler: IConnectionHandler, profileIds?: number[], verified?: boolean): w3cwebsocket {
    let _items: IQueueingItem[] = [];

    return initConnection(
        {
            onOpen: handler.onOpen,
            onClose: handler.onClose,
            onPlayers: (events: IQueueingEvent[]) => {
                _items = produce(_items, (players) => {
                    for (const event of events) {
                        const index = players.findIndex((item) => item.id == event.data.id);

                        switch (event.type) {
                            case 'queueingAdded':
                                players.push(event.data);
                                break;
                            case 'queueingUpdated':
                                // The update carries the whole player, so it replaces rather than
                                // merges. An update for an entry we never got an add for would be
                                // a server bug, but pushing it is still the sane reading of it.
                                if (index === -1) {
                                    players.push(event.data);
                                } else {
                                    players[index] = event.data;
                                }
                                break;
                            case 'queueingRemoved':
                                if (index !== -1) {
                                    players.splice(index, 1);
                                }
                                break;
                        }
                    }
                });
                handler.onPlayers?.(_items);
            },
            onMessage: handler.onMessage,
        },
        profileIds,
        verified
    );
}

/**
 * What the dashboards render: one card per item. Searching first, matched last, each ordered by
 * how long it has been going on.
 */
export function sortQueueingItems(items: IQueueingItem[]): IQueueingItem[] {
    return sortBy(
        items,
        (item) => (item.status === 'matched' ? 1 : 0),
        (item) => new Date(item.status === 'matched' ? item.matchedAt : item.queueingSince).getTime()
    );
}

interface IUseQueueingParams {
    profileIds?: number[];
    verified?: boolean;
    enabled?: boolean;
}

/**
 * Players who have pressed Search on a ranked ladder, and the match they were put into once that
 * happens. Note that cancelling a search is invisible to the server we read this from, so an entry
 * says "was queueing as of `queueingSince`" rather than "is queueing right now".
 */
export const useQueueing = ({ profileIds, verified, enabled = true }: IUseQueueingParams) => {
    const [items, setItems] = useState<IQueueingItem[]>([]);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const focused = useIsFocused();
    const socket = useRef<w3cwebsocket>(undefined);
    // Map names come in the connection's language, so wait for it as useOngoing does rather than
    // subscribing with the 'en' fallback for the whole session.
    const language = useLanguage();

    const connect = (_profileIds?: number[], _verified?: boolean) => {
        // There is nothing to subscribe to, e.g. a subscription by profile ids without any profile id
        if (!enabled || !language) return;

        // Reconnecting would otherwise leave the previous socket open
        socket.current?.close();

        socket.current = initQueueingSubscription(
            {
                onOpen: () => {
                    setConnected(true);
                },
                onClose: () => {
                    setConnected(false);
                },
                onPlayers: (newItems: IQueueingItem[]) => {
                    setItems(newItems);
                },
                onMessage: () => {
                    setIsLoading(false);
                },
            },
            _profileIds,
            _verified
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

    // A disabled subscription never connects, so it would otherwise stay loading forever --
    // e.g. the verified page's lobby details while no verified player has a lobby open.
    return { items, connected: connected || !focused, isLoading: enabled && isLoading, connect: () => connect(profileIds, verified) };
};

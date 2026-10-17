import { getHost, makeQueryString } from '@nex/data';
import { useFocusEffect } from 'expo-router';
import { useIsFocused } from 'expo-router/react-navigation';
import { decamelizeKeys } from 'humps';
import { produce } from 'immer';
import { min, sortBy } from 'lodash';
import { useRef, useState } from 'react';
import { ICloseEvent, w3cwebsocket } from 'websocket';

export interface IQueueingMatchPlayer {
    profileId: number;
    // 0 until the players have picked, which happens after the match has formed.
    civ: number;
    team: number;
}

export interface IQueueingMatch {
    matchId: number;
    server: string;
    matchedAt: string;
    players: IQueueingMatchPlayer[];
    // Arrives a cycle or two after the match itself: the map is only known once the match reaches
    // the database. The advertisement has a map field of its own but it is not the one played.
    mapImageUrl?: string;
}

export interface IQueueingPlayer {
    profileId: number;
    advertisementId: number;
    verified: boolean;
    queueingSince: string;
    lastSeen: string;
    // The other players this one is searching with, empty for a solo search.
    partyProfileIds: number[];
    // Set once they have been matched. The entry is removed shortly afterwards, by which time the
    // match has reached the ongoing-matches subscription.
    match?: IQueueingMatch;
}

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
            // No language: queueing events carry ids only, nothing the server localises.
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
    data: IQueueingPlayer;
}

interface IQueueingUpdatedEvent {
    type: 'queueingUpdated';
    data: IQueueingPlayer;
}

interface IQueueingRemovedEvent {
    type: 'queueingRemoved';
    data: { advertisementId: number; profileId: number };
}

type IQueueingEvent = IQueueingAddedEvent | IQueueingUpdatedEvent | IQueueingRemovedEvent;

export function initQueueingSubscription(handler: IConnectionHandler, profileIds?: number[], verified?: boolean): w3cwebsocket {
    let _players: IQueueingPlayer[] = [];

    return initConnection(
        {
            onOpen: handler.onOpen,
            onClose: handler.onClose,
            onPlayers: (events: IQueueingEvent[]) => {
                _players = produce(_players, (players) => {
                    for (const event of events) {
                        // One player can only be in one queue at a time, but the advertisement id
                        // is what the events are keyed by, so it is also what identifies an entry.
                        const index = players.findIndex((player) => player.advertisementId == event.data.advertisementId);

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
                handler.onPlayers?.(_players);
            },
            onMessage: handler.onMessage,
        },
        profileIds,
        verified
    );
}

export interface IQueueingGroup {
    key: string;
    // One entry per tracked player. More than one means they were matched into the same match --
    // two opponents we happened to be watching both of -- which is one card, not two.
    players: IQueueingPlayer[];
}

/**
 * What the dashboards render: one card per queue, or per match once the queues have resolved into
 * one. Searching first, matched last, each ordered by how long it has been going on.
 */
export function groupQueueingPlayers(players: IQueueingPlayer[]): IQueueingGroup[] {
    const groups = new Map<string, IQueueingPlayer[]>();

    for (const player of players) {
        // Keyed by the match once there is one, so everyone put into it shares a card, and by the
        // advertisement until then, which is what a party already shares.
        const key = player.match ? `match-${player.match.matchId}` : `queue-${player.advertisementId}`;
        groups.set(key, [...(groups.get(key) ?? []), player]);
    }

    return sortBy(
        [...groups.entries()].map(([key, groupPlayers]) => ({ key, players: groupPlayers })),
        (group) => (group.players.some((player) => player.match) ? 1 : 0),
        (group) => min(group.players.map((player) => new Date(player.queueingSince).getTime()))
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
    const [players, setPlayers] = useState<IQueueingPlayer[]>([]);
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const focused = useIsFocused();
    const socket = useRef<w3cwebsocket>(undefined);

    const connect = (_profileIds?: number[], _verified?: boolean) => {
        // There is nothing to subscribe to, e.g. a subscription by profile ids without any profile id
        if (!enabled) return;

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
                onPlayers: (newPlayers: IQueueingPlayer[]) => {
                    setPlayers(newPlayers);
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
        if (enabled) {
            connect(profileIds, verified);
            setIsLoading(true);
        }

        // Cleaned up even when disabled, `connect` is also called by the caller
        return () => {
            socket.current?.close();
            socket.current = undefined;
        };
    });

    return { players, connected: connected || !focused, isLoading, connect: () => connect(profileIds, verified) };
};

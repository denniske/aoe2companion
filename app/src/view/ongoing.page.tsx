import React, { useEffect, useState } from 'react';
import { IMatchesMatch } from '../api/helper/api.types';
import { ICloseEvent, w3cwebsocket } from 'websocket';
import produce from 'immer';
import { dateReviver, getHost } from '@nex/data';
import { MyText } from './components/my-text';
import { FlatList, View, StyleSheet } from 'react-native';
import { Game } from './components/game';
import groupBy from 'lodash/groupBy';
import { getTranslation } from '../helper/translate';
import { createStylesheet } from '../theming-new';
import { useSelector } from '../redux/reducer';

interface IConnectionHandler {
    onOpen?: () => void;
    onMatches?: (_matches: any[]) => void;
    onClose?: (event: ICloseEvent) => void;
}

function initConnection(handler: IConnectionHandler, followingIds: number[]): Promise<w3cwebsocket> {
    return new Promise((resolve) => {
        const client = new w3cwebsocket(`${getHost('aoe2companion-socket')}listen?handler=ongoing-matches&profile_ids=${followingIds.join(',')}`);

        client.onopen = () => {
            console.log('WebSocket client connected');
            handler.onOpen?.();
            resolve(client);
        };

        client.onmessage = (messageEvent) => {
            const message = JSON.parse(messageEvent.data as string, dateReviver);
            if (message.type != 'pong') {
                handler.onMatches?.(message);
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
        },
        followingIds
    );
}

export default function OngoingMatchesPage() {
    const styles = useStyles();
    const following = useSelector((state) => state.following);

    const [matches, setMatches] = useState<IMatchesMatch[]>([]);
    const [connected, setConnected] = useState(false);

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
            },
            followingIds
        );
    };

    useEffect(() => {
        const followingIds = following.map((follow) => follow.profileId);

        let socket: w3cwebsocket;
        connect(followingIds).then((s) => (socket = s));
        return () => {
            socket?.close();
        };
    }, [following]);

    return (
        <FlatList
            style={styles.container}
            contentContainerStyle={styles.contentContainerStyle}
            ListHeaderComponent={
                matches && matches.length > 0 ? <MyText style={styles.description}>{getTranslation('ongoing.description')}</MyText> : null
            }
            ListEmptyComponent={<MyText style={styles.description}>{getTranslation('ongoing.emptydescription')}</MyText>}
            data={matches}
            renderItem={({ item: match }) => (
                <Game
                    showLiveActivity
                    user={following.find((follow) => match.players.some((player) => player.profileId === follow.profileId))?.profileId}
                    highlightedUsers={following
                        .filter((follow) => match.players.some((player) => player.profileId === follow.profileId))
                        ?.map((follow) => follow.profileId)}
                    match={{
                        ...match,
                        teams: Object.entries(groupBy(match.players, 'team')).map(([teamId, players]) => ({ teamId: Number(teamId), players })),
                    }}
                />
            )}
            keyExtractor={(match) => match.matchId.toString()}
        />
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        description: {
            marginBottom: 20,
        },
        contentContainerStyle: {
            padding: 20,
        },
    })
);

import React, {useEffect, useState} from 'react';
import {FlatList, Platform, StyleSheet, View} from 'react-native';
import {useAppTheme} from "../theming";
import {LiveGame} from "./live/live-game";
import {MyText} from "./components/my-text";
import {FontAwesome5} from "@expo/vector-icons";
import {Searchbar} from "react-native-paper";
import {createStylesheet} from '../theming-new';
import {ILobbyMatchRaw} from '../helper/data';
import {getTranslation} from '../helper/translate';


import {gql} from "graphql-request";
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from 'graphql-ws';
import {applyPatch} from "fast-json-patch";
import {camelizeKeys} from "humps";
import { ILobbiesMatch } from '../api/new/api.types';
import { GraphQLWebSocketClientCustom } from '../api/new/graphql-ws';
import {getHost} from "@nex/data";

async function createClient(url: string) {
    return new Promise<GraphQLWebSocketClientCustom>((resolve, reject) => {
        const socket = new WebSocket(url, GRAPHQL_TRANSPORT_WS_PROTOCOL);
        const client: GraphQLWebSocketClientCustom = new GraphQLWebSocketClientCustom((socket as unknown) as WebSocket, {
            onAcknowledged: async (_p) => {
                console.log('ACKNOWLEDGED');
                resolve(client);
            },
            onClose: () => {
                reject();
            },
        })
    })
}


async function doListen(onChange: (data: any) => void, onReset: () => void) {
    try {
        console.log('LISTENING');
        const baseUrl = getHost('aoe2companion-graphql');
        const url = baseUrl.replace('http', 'ws');
        const client = await createClient(url)
        const result = await new Promise<string>((resolve, reject) => {
            client.subscribe<{ lobbiesUpdatedSub: any }>(
                gql`subscription lobbiesUpdatedSub {
                    lobbiesUpdatedSub
                }`,
                {
                    next: ({ lobbiesUpdatedSub }) => onChange(JSON.parse(lobbiesUpdatedSub)),
                    complete: () => { resolve(null) },
                    error: (e) => { reject(e) }
                })
        })
        client.close();
        console.log('Connection complete. Reconnecting in 10s', result);
        onReset();
        setTimeout(() => doListen(onChange, onReset), 10 * 1000);
    } catch (e) {
        console.log(e);
        console.log('Connection Error. Reconnecting in 10s');
        onReset();
        setTimeout(() => doListen(onChange, onReset), 10 * 1000);
    }
}

export default function LivePage() {
    const styles = useStyles();
    const theme = useAppTheme();
    const [matches, setMatches] = useState([] as ILobbyMatchRaw[]);
    // const [filteredMatches, setFilteredMatches] = useState([] as ILobbyMatchRaw[]);
    const [usage, setUsage] = useState(0);
    const [search, setSearch] = useState('');


    const [lobbiesDict, setLobbiesDict] = useState<any>({});
    const [data, setData] = useState<ILobbiesMatch[]>([]);
    const [filteredData, setFilteredData] = useState<ILobbiesMatch[]>([]);
    const [expandedDict, setExpandedDict] = useState<{ [key: string]: boolean }>({});

    const toggleExpanded = (matchId: number) => {
        expandedDict[matchId] = !expandedDict[matchId];
        setExpandedDict({...expandedDict});
    };

    useEffect(() => {
        doListen(
            (patch) => {
                try {
                    setUsage(usage => {
                        return usage + JSON.stringify(patch).length;
                    });
                    // console.log('lobbiesDict', lobbiesDict);
                    // console.log('patch', patch);
                    const newDoc = applyPatch(lobbiesDict, patch);
                    setLobbiesDict(camelizeKeys(newDoc.newDocument));
                } catch (e) {
                    console.log(e);
                }
            },
            () => {
                setData([]);
            },
        );
    }, []);

    useEffect(() => {
        setData(Object.values(lobbiesDict) as ILobbiesMatch[]);
    }, [lobbiesDict]);

    useEffect(() => {
        const parts = search.toLowerCase().split(' ');
        const filtered = data.filter((match) => {
            if (search === '') return true;
            return parts.every(part => {
                return match.name.toLowerCase().includes(part.toLowerCase()) ||
                    match.mapName.toLowerCase().includes(part.toLowerCase()) ||
                    match.gameModeName.toLowerCase().includes(part.toLowerCase()) ||
                    match.server.toLowerCase().includes(part.toLowerCase()) ||
                    match.players.some((player) => player.name?.toLowerCase().includes(part.toLowerCase()));
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
                    <MyText style={styles.usageText}>{getTranslation('lobbies.datausagewarning', { usage: (usage / 1000000).toFixed(1)})}</MyText>
                </View>
                <Searchbar
                    style={styles.searchbar}
                    placeholder={getTranslation('lobbies.search.placeholder')}
                    onChangeText={text => setSearch(text)}
                    value={search}
                />
                <FlatList
                    contentContainerStyle={styles.list}
                    data={list}
                    renderItem={({item, index}) => {
                        switch (item) {
                            case 'header':
                                return <MyText style={styles.header}>{filteredData?.length} lobbies</MyText>
                            default:
                                return <LiveGame data={item as any} expanded={index === -1}/>;
                        }
                    }}
                    keyExtractor={(item, index) => typeof item === 'string' ? item : item.id}
                />
            </View>
        </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
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
        paddingTop: Platform.select({ android: 15 }),
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
}));

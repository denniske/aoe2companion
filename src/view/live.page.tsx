import React, {useEffect, useState} from 'react';
import {FlatList, Platform, StyleSheet, View} from 'react-native';
// import {useCavy} from "cavy";
import {ITheme, makeVariants, useAppTheme, useTheme} from "../theming";
import {ILobbyMatchRaw} from "../helper/data";
import {LiveGame} from "./live/live-game";
import {MyText} from "./components/my-text";
import IconFA5 from "react-native-vector-icons/FontAwesome5";
import {Searchbar} from "react-native-paper";


interface IPingMessage {
    message: 'ping';
    data: number;
}

interface IChatMessageData {
    avatar: string;
    avatarfull: string;
    avatarmedium: string;
    color: any;
    deleted: boolean;
    message: string;
    personaname: string;
    profileurl: string;
    steam_id: string;
    ts: number;
    uuid: string;
}

interface IChatMessage {
    message: 'chat';
    data: IChatMessageData;
}

interface ILobbiesMessage {
    message: 'lobbies';
    data: ILobbyMatchRaw[];
}

type Message = IPingMessage | IChatMessage | ILobbiesMessage;

export default function LivePage() {
    const styles = useTheme(variants);
    const theme = useAppTheme();
    const [matches, setMatches] = useState([] as ILobbyMatchRaw[]);
    const [filteredMatches, setFilteredMatches] = useState([] as ILobbyMatchRaw[]);
    const [usage, setUsage] = useState(0);
    const [text, setText] = useState('');

    useEffect(() => {
        const parts = text.toLowerCase().split(' ');
        const filtered = matches.filter(m => {
            return parts.every(part => {
                return m.name.toLowerCase().indexOf(part) >= 0 ||
                       m.location.toLowerCase().indexOf(part) >= 0 ||
                       m.players.some(p => p.name?.toLowerCase().indexOf(part) >= 0);
            });
        });

        const players = matches.flatMap(m => m.players).filter(p => p.games == null);
        console.log('players', players);

        setFilteredMatches(filtered);
    }, [text, matches]);

    const onUpdate = (updates: any) => {
        setMatches(matches => {
            const newMatches = [...matches];

            for (const update of updates) {
                const existingMatchIndex = newMatches.findIndex(m => m.id === update.id);
                if (existingMatchIndex >= 0) {
                    if (update.active && update.numSlots > 1) {
                        newMatches.splice(existingMatchIndex, 1, update);
                    } else {
                        newMatches.splice(existingMatchIndex, 1);
                    }
                } else {
                    if (update.active && update.numSlots > 1) {
                        newMatches.push(update);
                    }
                }
            }
            return newMatches;
        });
    };

    useEffect(() => {
        const ws = new WebSocket('wss://aoe2.net/ws');

        ws.onopen = () => {
            // ws.send(JSON.stringify({"message":"subscribe","subscribe":[0]})); // subscribe chat
            ws.send(JSON.stringify({"message":"subscribe","subscribe":[813780]})); // subscribe de lobbies
        };

        ws.onmessage = (e) => {
            setUsage(usage => {
                return usage + e.data.length;
            });

            const message = JSON.parse(e.data) as Message;

            if (message.message === "ping") {
                // console.log('SEND', JSON.stringify(message));
                ws.send(JSON.stringify(message));
                return;
            }

            if (message.message === 'chat') {
                return;
            }

            if (message.message === 'lobbies') {
                const updates = message.data;
                onUpdate(updates);
            }
        };

        ws.onerror = (e) => {
            console.log('error', (e as any).message);
        };

        ws.onclose = (e) => {
            console.log('close', e.code, e.reason);
        };

        return () => {
          console.log('closing by app');
          ws.close();
        };
    }, []);

    const list = ['header', ...(filteredMatches || Array(15).fill(null))];

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.usageRow}>
                    <IconFA5 style={styles.usageIcon} name="exclamation-triangle" size={14} color={theme.textNoteColor} />
                    <MyText style={styles.usageText}>Only use with WiFi. Data usage: {(usage / 1000000).toFixed(1)} MB</MyText>
                </View>
                <Searchbar
                    style={styles.searchbar}
                    placeholder="name, map, player"
                    onChangeText={text => setText(text)}
                    value={text}
                />
                <FlatList
                    contentContainerStyle={styles.list}
                    data={list}
                    renderItem={({item, index}) => {
                        switch (item) {
                            case 'header':
                                return <MyText style={styles.header}>{filteredMatches?.length} lobbies</MyText>
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

const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
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
    });
};

const variants = makeVariants(getStyles);

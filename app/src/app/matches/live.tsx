import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../theming';
import { LiveGame } from '@app/view/live/live-game';
import { MyText } from '@app/view/components/my-text';
import { FontAwesome5 } from '@expo/vector-icons';
import { createStylesheet } from '../../theming-new';
import { ILobbiesMatch } from '../../api/helper/api.types';
import { useNavigation } from 'expo-router';
import { Field } from '@app/components/field';
import { KeyboardAvoidingView } from '@app/components/keyboard-avoiding-view';
import { FlatList } from '@app/components/flat-list';
import { useTranslation } from '@app/helper/translate';
import { initLobbySubscription } from '@app/api/socket/lobbies';

export default function LivePage() {
    const getTranslation = useTranslation();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: getTranslation('lobbies.title') });
    }, [navigation]);

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
        <KeyboardAvoidingView>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.usageRow}>
                        <FontAwesome5 style={styles.usageIcon} name="exclamation-triangle" size={14} color={theme.textNoteColor} />
                        <MyText style={styles.usageText}>
                            {getTranslation('lobbies.datausagewarning', { usage: (usage / 1000000).toFixed(1) })}
                        </MyText>
                    </View>

                    <View className="pt-4 px-4">
                        <Field
                            type="search"
                            placeholder={getTranslation('lobbies.search.placeholder')}
                            onChangeText={(text) => setSearch(text)}
                            value={search}
                        />
                    </View>
                    <FlatList
                        contentContainerStyle="p-4"
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
        </KeyboardAvoidingView>
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

        container: {
            flex: 1,
            // backgroundColor: '#B89579',
        },
        content: {
            flex: 1,
        },
    })
);

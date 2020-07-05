import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {IFetchedUser, loadUser} from '../../service/user';
import {useLazyApi} from '../../hooks/use-lazy-api';
import {Button, Searchbar} from 'react-native-paper';
import {composeUserIdFromParts, UserInfo} from '../../helper/user';
import {getFlagIcon} from '../../helper/flags';
import {useCavy} from "cavy";

interface IPlayerProps {
    player: IFetchedUser;
    selectedUser?: (user: UserInfo) => void;
    actionText?: string;
    action?: (player: IFetchedUser) => React.ReactNode;
}

function Player({player, selectedUser, actionText, action}: IPlayerProps) {
    const generateTestHook = useCavy();

    const onSelect = async () => {
        selectedUser!({
            id: composeUserIdFromParts(player.steam_id, player.profile_id),
            steam_id: player.steam_id,
            profile_id: player.profile_id,
            name: player.name,
        });
    };

    // console.log(player.country, player.name, composeUserIdFromParts(player.steam_id, player.profile_id));

    return (
            <TouchableHighlight underlayColor="white">
                <View style={styles.row}>
                    <View style={styles.cellName}>
                        <Image style={styles.countryIcon} source={getFlagIcon(player.country)}/>
                        <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
                    </View>
                    <Text style={styles.cellGames}>{player.games}</Text>
                    <View style={styles.cellAction}>
                        {
                            action && action(player)
                        }
                        {
                            actionText && selectedUser &&
                            <Button
                                labelStyle={{fontSize: 13, marginVertical: 0}}
                                contentStyle={{height: 22}}
                                onPress={onSelect}
                                mode="contained"
                                compact
                                uppercase={false}
                                dark={true}
                                ref={generateTestHook('Search.Player.' + composeUserIdFromParts(player.steam_id, player.profile_id))}
                            >
                                {actionText}
                            </Button>
                        }
                    </View>
                </View>
            </TouchableHighlight>
    );
}

interface ISearchProps {
    title: string;
    selectedUser?: (user: UserInfo) => void;
    actionText?: string;
    action?: (player: IFetchedUser) => React.ReactNode;
}

export default function Search({title, selectedUser, actionText, action}: ISearchProps) {
    const [text, setText] = useState('');

    const user = useLazyApi(loadUser, 'aoe2de', text);

    const refresh = () => {
        if (text.length < 3) {
            user.reset();
            return;
        }
        user.refetch('aoe2de', text);
    };

    const generateTestHook = useCavy();

    useEffect(() => {
        refresh();
    }, [text]);

    let list: any[] = user.data ? [...user.data]:[];
    if (user.touched && (user.data == null || user.data.length === 0)) {
        list = [{type: 'text', content: 'No user found.'}];
    }
    if (text.length < 3) {
        list = [{type: 'text', content: 'Enter at least 3 chars.'}];
    }

    return (
            <View style={styles.container}>
                <Text style={styles.centerText}>{title}</Text>

                <Searchbar
                        ref={generateTestHook('Search.Input')}
                        style={styles.searchbar}
                        placeholder="username"
                        onChangeText={text => setText(text)}
                        value={text}
                />

                {
                    user.data && user.data.length > 0 && text.length >= 3 &&
                    <View style={styles.headerRow}>
                        <Text style={styles.cellName}>Name</Text>
                        <Text style={styles.cellGames}>Games</Text>
                        <Text style={styles.cellAction}/>
                    </View>
                }

                <FlatList
                        keyboardShouldPersistTaps={'always'}
                        refreshing={user.loading}
                        onRefresh={refresh}
                        data={list}
                        renderItem={({item}) => {
                            if (item.type === 'text') {
                                return <Text style={styles.centerText}>{item.content}</Text>;
                            }
                            return <Player player={item} selectedUser={selectedUser} actionText={actionText} action={action}/>;
                        }}
                        keyExtractor={(item, index) => index.toString()}
                />
            </View>
    );
}

const styles = StyleSheet.create({
    centerText: {
        textAlign: 'center',
    },
    countryIcon: {
        width: 21,
        height: 15,
        marginRight: 5,
    },
    searchbar: {
        marginTop: 15,
        marginBottom: 15,
        marginRight: 30,
        marginLeft: 30,
    },
    cellRating: {
        width: 40,
    },
    cellName: {
        // backgroundColor: 'red',
        flex: 2.7,
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        flex: 1,
    },
    cellGames: {
        flex: 1.2,
    },
    cellAction: {
        flex: 1.5,
    },
    cellWon: {
        width: 110,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        padding: 3,
        borderRadius: 5,
        marginRight: 30,
        marginLeft: 30,
    },
    row: {
        marginRight: 30,
        marginLeft: 30,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        padding: 3,
    },
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#fff',
    },
});

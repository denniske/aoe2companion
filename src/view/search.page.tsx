import React, { useEffect, useState } from 'react';
import { AsyncStorage, FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { formatAgo } from '../helper/util';
import { IFetchedUser, loadUser } from '../service/user';
import { useLazyApi } from '../hooks/use-lazy-api';
import { Searchbar } from 'react-native-paper';

interface IPlayerProps {
    player: IFetchedUser;
    selectedUser: () => void;
}

function Player({player, selectedUser}: IPlayerProps) {
    const onSelect = async () => {
        await AsyncStorage.setItem('settings', JSON.stringify({
            steam_id: player.steam_id,
            profile_id: player.profile_id,
        }));
        selectedUser();
    };

    return (
            <TouchableHighlight onPress={onSelect} underlayColor="white">
                <View style={styles.row}>
                    <Text style={styles.cellCountry}>{player.country}</Text>
                    <Text style={styles.cellName}>{player.name}</Text>
                    <Text style={styles.cellGames}>{player.games}</Text>
                    <Text style={styles.cellLastMatch}>{formatAgo(player.last_match)}</Text>
                </View>
            </TouchableHighlight>
    );
}

export default function SearchPage({selectedUser}: any) {
    const [text, setText] = useState('baal');

    const user = useLazyApi(loadUser, 'aoe2de', text);

    useEffect(() => {
        if (text.length < 3) return;
        user.refetch('aoe2de', text);
    }, [text]);

    return (
            <View style={styles.container}>
                <Text>Enter your AoE username to track your games:</Text>

                <Searchbar
                        style={styles.searchbar}
                        placeholder="username"
                        onChangeText={text => setText(text)}
                        value={text}
                />

                {/*<TextInput*/}
                {/*        autoFocus={true}*/}
                {/*        style={{height: 50}}*/}
                {/*        placeholder="username"*/}
                {/*        onChangeText={text => setText(text)}*/}
                {/*        defaultValue={text}*/}
                {/*/>*/}

                {
                    text.length < 3 &&
                    <Text>Enter at least 3 chars.</Text>
                }

                {
                    user.data && user.data.length > 0 && text.length >= 3 &&
                    <View style={styles.headerRow}>
                        <Text style={styles.cellCountry}> </Text>
                        <Text style={styles.cellName}>Name</Text>
                        <Text style={styles.cellGames}>Games</Text>
                        <Text style={styles.cellLastMatch}>Last Match</Text>
                    </View>
                }
                {
                    user.data && user.data.length > 0 && text.length >= 3 &&
                    <FlatList
                        data={user.data}
                        renderItem={({item}) => <Player player={item} selectedUser={selectedUser}/>}
                        keyExtractor={(item, index) => index.toString()}
                    />
                }
                {
                    user.data && user.data.length == 0 && text.length >= 3 &&
                    <Text>No user found.</Text>
                }
            </View>
    );
}

const styles = StyleSheet.create({
    searchbar: {
        marginTop: 15,
        marginBottom: 15,
        marginRight: 30,
        marginLeft: 30,
    },
    button: {
        marginBottom: 30,
        width: 260,
        alignItems: 'center',
        backgroundColor: '#2196F3'
    },
    buttonText: {
        textAlign: 'center',
        padding: 20,
        color: 'white'
    },
    cellRating: {
        width: 40,
    },
    cellCountry: {
        width: 30,
    },
    cellName: {
        width: 110,
    },
    cellGames: {
        width: 60,
    },
    cellLastMatch: {
        width: 110,
    },
    headerRow: {
        flexDirection: 'row',
        marginBottom: 3,
        padding: 3,
        borderRadius: 5,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 3,
        borderColor: '#CCC',
        borderWidth: 1,
        padding: 3,
        borderRadius: 5,
        backgroundColor: '#EEE',
        // borderBottomColor: '#CCC',
        // borderBottomWidth: 1,
    },
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

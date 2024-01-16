import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Button} from 'react-native-paper';
import {MyText} from "./my-text";
import {getTranslation} from '../../helper/translate';
import {useCavy} from '../testing/tester';
import {CountryImage} from './country-image';

export interface IPlayerListPlayer {
    country: string;
    games: number;
    name: string;
    profileId: number;
    steamId?: string;
}

interface IPlayerProps {
    player: IPlayerListPlayer;
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: IPlayerListPlayer) => React.ReactNode;
}

function Player({player, selectedUser, actionText, action}: IPlayerProps) {
    const generateTestHook = useCavy();

    const onSelect = async () => {
        selectedUser!({
            profileId: player.profileId,
            name: player.name,
        });
    };

    return (
        <View style={styles.row2}>
            <TouchableOpacity style={styles.cellNameAndGames}
                              ref={ref => generateTestHook('Search.Player.' + player.profileId)({props: {onPress: onSelect}})}
                              onPress={onSelect}
            >
                <View style={styles.row}>
                    <View style={styles.cellName}>
                        <CountryImage country={player.country}/>
                        <MyText style={styles.name} numberOfLines={1}>{player.name}</MyText>
                    </View>
                    <MyText style={styles.cellGames}>{player.games}</MyText>
                </View>
            </TouchableOpacity>
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
                    >
                        {actionText}
                    </Button>
                }
            </View>
        </View>
    );
}

interface ISearchProps {
    list: IPlayerListPlayer[];
    selectedUser?: (user: any) => void;
    actionText?: string;
    action?: (player: IPlayerListPlayer) => React.ReactNode;
}

export default function PlayerList({list, selectedUser, actionText, action}: ISearchProps) {

    return (
        <View style={styles.container}>
            {
                list && list.length > 0 &&
                <View style={styles.headerRow}>
                    <View style={styles.cellNameAndGames}>
                        <MyText style={styles.cellName}>{getTranslation('search.heading.name')}</MyText>
                        <MyText style={styles.cellGames}>{getTranslation('search.heading.games')}</MyText>
                    </View>
                    <MyText style={styles.cellAction}/>
                </View>
            }

            <FlatList
                keyboardShouldPersistTaps={'always'}
                data={list}
                contentContainerStyle={styles.list}
                renderItem={({item}) => {
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
        flex: 0.5,
    },
    cellWon: {
        width: 110,
    },
    list: {
        marginRight: 30,
        marginLeft: 30,
        paddingBottom: 20,
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        padding: 3,
    },
    row2: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cellNameAndGames: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    container: {
        paddingTop: 20,
        flex: 1,
    },
});

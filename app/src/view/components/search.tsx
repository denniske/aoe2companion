import React, {useEffect, useState} from 'react';
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {IFetchedUser, loadUser} from '../../service/user';
import {useLazyApi} from '../../hooks/use-lazy-api';
import {Button, Searchbar} from 'react-native-paper';
import {composeUserIdFromParts, UserInfo} from '../../helper/user';
import {getFlagIcon} from '../../helper/flags';
// import {useCavy} from "cavy";
import {MyText} from "./my-text";
import RefreshControlThemed from "./refresh-control-themed";
import {usePrevious} from "@nex/data/hooks";
import {createStylesheet} from '../../theming-new';
import FlatListLoadingIndicator from './flat-list-loading-indicator';

interface IPlayerProps {
    player: IFetchedUser;
    selectedUser?: (user: UserInfo) => void;
    actionText?: string;
    action?: (player: IFetchedUser) => React.ReactNode;
}

function Player({player, selectedUser, actionText, action}: IPlayerProps) {
    const styles = useStyles();

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
            <TouchableOpacity>
                <View style={styles.row}>
                    <View style={styles.cellName}>
                        <Image style={styles.countryIcon} source={getFlagIcon(player.country)}/>
                        <MyText style={styles.name} numberOfLines={1}>{player.name}</MyText>
                    </View>
                    <MyText style={styles.cellGames}>{player.games}</MyText>
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
            </TouchableOpacity>
    );
}

interface ISearchProps {
    title?: string;
    selectedUser?: (user: UserInfo) => void;
    actionText?: string;
    action?: (player: IFetchedUser) => React.ReactNode;
}

export default function Search({title, selectedUser, actionText, action}: ISearchProps) {
    const styles = useStyles();
    const [text, setText] = useState('viper');
    const previousText = usePrevious(text);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [fetchedAll, setFetchedAll] = useState(false);

    const user = useLazyApi({}, loadUser, 'aoe2de', 0, 50, text);

    const refresh = () => {
        // if (text.length < 3) {
        //     user.reset();
        //     return;
        // }
        if (previousText?.trim() === text.trim()) {
            return;
        }
        user.refetch('aoe2de', 0, 50, text.trim());
        setFetchedAll(false);
    };

    // const generateTestHook = useCavy();

    useEffect(() => {
        refresh();
    }, [text]);

    let list: any[] = user.data ? [...user.data]:[];
    if (user.touched && (user.data == null || user.data.length === 0)) {
        list.push({
            type: 'text',
            content: <MyText style={styles.centerText}>No user found.</MyText>,
        }, {
            type: 'text',
            content: (
                <View style={styles.headerRow}>
                    <MyText style={styles.note}>A user must have played at least 10 games in a timespan of about 3 months to be found.</MyText>
                </View>
            ),
        });
    }
    // if (text.length < 3) {
    //     list = [{
    //         type: 'text',
    //         content: <MyText style={styles.centerText}>Enter at least 3 chars.</MyText>,
    //     }];
    // }

    // console.log('RENDER', text, list.length);

    const onEndReached = async () => {
        if (fetchingMore || user.data?.length == 0) return;
        setFetchingMore(true);
        // console.log('onEndReached', text);
        // console.log('fetchingMore', fetchingMore);
        // console.log('user.data', user.data);
        const usersLength = user.data?.length ?? 0;
        const newUsersData = await user.refetch('aoe2de', 0, (user.data?.length ?? 0) + 50, text.trim());
        if (usersLength === newUsersData?.length) {
            setFetchedAll(true);
        }
        setFetchingMore(false);
    };

    const _renderFooter = () => {
        if (!fetchingMore) return null;
        return <FlatListLoadingIndicator />;
    };

    return (
            <View style={styles.container}>
                {
                    title &&
                    <MyText style={styles.centerText}>{title}</MyText>
                }

                <Searchbar
                        // ref={generateTestHook('Search.Input')}
                        style={styles.searchbar}
                        placeholder="username"
                        onChangeText={text => setText(text)}
                        value={text}
                />

                {
                    user.data && user.data.length > 0 && text.length >= 3 &&
                    <View style={styles.headerRow}>
                        <MyText style={styles.cellName}>Name</MyText>
                        <MyText style={styles.cellGames}>Games</MyText>
                        <MyText style={styles.cellAction}/>
                    </View>
                }

                <FlatList
                        keyboardShouldPersistTaps={'always'}
                        contentContainerStyle={styles.list}
                        data={list}
                        renderItem={({item}) => {
                            if (item.type === 'text') {
                                return item.content;
                            }
                            return <Player player={item} selectedUser={selectedUser} actionText={actionText} action={action}/>;
                        }}
                        ListFooterComponent={_renderFooter}
                        onEndReached={fetchedAll ? null : onEndReached}
                        onEndReachedThreshold={0.1}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControlThemed
                                refreshing={user.loading}
                                onRefresh={refresh}
                            />
                        }
                />
            </View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    centerText: {
        textAlign: 'center',
        marginVertical: 20,
    },
    note: {
        lineHeight: 20,
        color: theme.textNoteColor,
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
    list: {
        marginRight: 30,
        marginLeft: 30,
        paddingBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        padding: 3,
        borderRadius: 5,
        marginRight: 30,
        marginLeft: 30,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3,
        padding: 3,
    },
    container: {
        paddingTop: 20,
        flex: 1,
    },
}));

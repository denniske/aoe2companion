import {ITheme, makeVariants, useTheme} from "../../theming";
import {FlatList, Platform, StyleSheet, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootTabParamList} from "../../../App";
import {useApi} from "../../hooks/use-api";
import {fetchPlayerMatches} from "../../api/player-matches";
import FlatListLoadingIndicator from "../components/flat-list-loading-indicator";
import {Game} from "../components/game";
import RefreshControlThemed from "../components/refresh-control-themed";
import {FinalDarkMode, useSelector} from "../../redux/reducer";
import {Checkbox, Searchbar} from "react-native-paper";
import {MyText} from "../components/my-text";
import {appVariants} from "../../styles";


export default function MainMatches() {
    const styles = useTheme(variants);
    const appStyles = useTheme(appVariants);
    const [refetching, setRefetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [fetchedAll, setFetchedAll] = useState(false);
    const [text, setText] = useState('');

    const auth = useSelector(state => state.auth);

    const route = useRoute<RouteProp<RootTabParamList, 'MainProfile'>>();
    const { user } = route.params;

    const matches = useApi(
        {
            append: (data, newData) => {
                // console.log('APPEND', data, newData);
                return [...(data || []), ...newData];
            },
        },
        [],
        state => state.user[user.id]?.matches,
        (state, value) => {
            if (state.user[user.id] == null) {
                state.user[user.id] = {};
            }
            state.user[user.id].matches = value;
        },
        fetchPlayerMatches, 'aoe2de', 0, 15, [user]
    );

    const onRefresh = async () => {
        setRefetching(true);
        await matches.reload();
        setRefetching(false);
    };

    const onEndReached = async () => {
        if (fetchingMore) return;
        setFetchingMore(true);
        const matchesLength = matches.data?.length ?? 0;
        const newMatchesData = await matches.refetch('aoe2de', 0, matchesLength + 15, [user]);
        if (matchesLength === newMatchesData?.length) {
            setFetchedAll(true);
        }
        setFetchingMore(false);
    };

    const list = [...(matches.data || Array(15).fill(null))];

    const _renderFooter = () => {
        if (!fetchingMore) return null;
        return <FlatListLoadingIndicator />;
    };

    const [withMe, setWithMe] = useState(false);
    const toggleWithMe = () => setWithMe(!withMe);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.pickerRow}>
                    <View style={styles.col2}>
                        <MyText style={styles.h1b}>RM</MyText>
                        <MyText style={styles.h2b}>1v1</MyText>
                    </View>
                    <View style={styles.col}>
                        <MyText style={styles.h1}>RM</MyText>
                        <MyText style={styles.h2}>Team</MyText>
                    </View>
                    <View style={styles.col}>
                        <MyText style={styles.h1}>DM</MyText>
                        <MyText style={styles.h2}>1v1</MyText>
                    </View>
                    <View style={styles.col}>
                        <MyText style={styles.h1}>DM</MyText>
                        <MyText style={styles.h2}>Team</MyText>
                    </View>
                    <View style={styles.col}>
                        <MyText style={styles.h1}>UNR</MyText>
                        <MyText style={styles.h2}>Unranked</MyText>
                    </View>
                    <View style={appStyles.expanded}/>
                    <View style={styles.row}>
                        <Checkbox.Android
                            status={withMe ? 'checked' : 'unchecked'}
                            onPress={toggleWithMe}
                        />
                        <TouchableOpacity onPress={toggleWithMe}>
                            <MyText>with me</MyText>
                        </TouchableOpacity>
                    </View>
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
                            default:
                                return <Game data={item as any} expanded={index === -1}/>;
                        }
                    }}
                    ListFooterComponent={_renderFooter}
                    onEndReached={fetchedAll ? null : onEndReached}
                    onEndReachedThreshold={0.1}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={
                        <RefreshControlThemed
                            onRefresh={onRefresh}
                            refreshing={refetching}
                        />
                    }
                />
            </View>
        </View>
    );
}


const getStyles = (theme: ITheme, mode: FinalDarkMode) => {
    return StyleSheet.create({
        searchbar: {
            marginTop: Platform.select({ ios: mode == 'light' ? 0 : 0 }),
            borderRadius: 0,
            paddingHorizontal: 10,
        },

        info: {
            // textAlign: 'center',
            marginBottom: 10,
            marginLeft: 5,
            // color: theme.textNoteColor,
            // fontSize: 12,
        },

        row: {
            flexDirection: 'row',
            paddingHorizontal: 7,
            alignItems: 'center',
        },
        col: {
            // width: 54,
            paddingHorizontal: 7,
            alignItems: 'center',
        },
        col2: {
            paddingHorizontal: 7,
            alignItems: 'center',
        },
        h1: {

        },
        h2: {
            fontSize: 11,
        },
        h1b: {
            fontWeight: 'bold',
        },
        h2b: {
            fontWeight: 'bold',
            fontSize: 11,
        },

        pickerRow: {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 20,
            marginTop: 20,
        },
        sectionHeader: {
            marginVertical: 25,
            fontSize: 15,
            fontWeight: '500',
            textAlign: 'center',
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

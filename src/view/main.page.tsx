import React from 'react';
import { Alert, AsyncStorage, FlatList, StyleSheet, Text, View } from 'react-native';
import {  Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { RouteProp, useLinkTo, useNavigation } from '@react-navigation/native';
import { fetchMatches } from '../api/matches';
import Profile from './profile';
import Rating from './rating';
import { useApi } from '../hooks/use-api';
import { loadRatingHistories } from '../service/rating';
import { loadProfile } from '../service/profile';
import { Game } from './components/game';
import { loadSettingsFromStorage } from '../service/storage';
import SearchPage from './search.page';


type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Main'>;
    route: RouteProp<RootStackParamList, 'Main'>;
};

function Main({steam_id, profile_id, deletedUser}: any) {
    const game = 'aoe2de';
    // const steam_id = '76561197995781128';
    // const profile_id = 209525;

    const rating = useApi(loadRatingHistories, 'aoe2de', steam_id);
    const profile = useApi(loadProfile, 'aoe2de', profile_id);
    const matches = useApi(fetchMatches, game, profile_id, 0, 10);

    const list = ['profile', 'rating', 'not-me'];//, ...(matches.data || [])];

    const deleteUser = () => {
        Alert.alert("Delete Me?", "Do you want to reset me page?",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Reset",  onPress: doDeleteUser, }
                ],
                { cancelable: false }
        );
    };

    const doDeleteUser = async () => {
        await AsyncStorage.removeItem('settings');
        console.log("REMOVED ME");
        deletedUser();
    };

    return (
            <View style={styles.container}>
                <View style={styles.content}>

                    <FlatList
                            onRefresh={() => {
                                rating.reload();
                                profile.reload();
                                matches.reload();
                            }}
                            refreshing={rating.loading || profile.loading || matches.loading}
                            contentContainerStyle={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    case 'rating':
                                        return <Rating ratingHistories={rating.data}/>;
                                    case 'profile':
                                        if (profile.data == null) return <Text>...</Text>;
                                        return <Profile data={profile.data}/>;
                                    case 'not-me':
                                        return <View>
                                            <Text/>
                                            <Button mode="outlined" onPress={deleteUser}>This is not me</Button>
                                        </View>;
                                        // if (profile.data == null) return <Text>...</Text>;
                                        // return <Profile data={profile.data}/>;
                                    default:
                                        return <Game data={item as any}/>;
                                }

                            }}
                            keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
    );
}

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;



export default function MainPage() {
    // const game = 'aoe2de';
    // const steam_id = '76561197995781128';
    // const profile_id = 209525;
    // const linkTo = useLinkTo();
    // const navigation = useNavigation<MainScreenNavigationProp>();

    const me = useApi(() => loadSettingsFromStorage());

    if (me.loading) {
        return <Text>Loading Me</Text>;
    }

    if (me.data == null) {
        // navigation.replace('Search', {name: '___'});
        return <SearchPage selectedUser={me.reload}/>;
        // linkTo('/search', );
    }

    console.log("RENDERING---");

    return (
            <Main
                    steam_id={me.data?.steam_id}
                    profile_id={me.data?.profile_id}
                    deletedUser={me.reload}
            />
    );
}


const styles = StyleSheet.create({
    outlineButton: {
      backgroundColor: 'red',
    },
    list: {
        padding: 20,
    },
    container: {
        flex: 1,
        // backgroundColor: '#B89579',
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
});

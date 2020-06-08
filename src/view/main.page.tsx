import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { RouteProp } from '@react-navigation/native';
import { fetchMatches } from '../api/matches';
import Profile from './profile';
import Rating from './rating';
import { useApi } from '../hooks/use-api';
import { loadRatingHistories } from '../service/rating';
import { loadProfile } from '../service/profile';
import { Game } from './components/game';


type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Main'>;
    route: RouteProp<RootStackParamList, 'Main'>;
};

export default function MainPage({navigation}: Props) {
    const game = 'aoe2de';
    const steam_id = '76561197995781128';
    const profile_id = 209525;

    const rating = useApi(loadRatingHistories, 'aoe2de', steam_id);
    const profile = useApi(loadProfile, 'aoe2de', profile_id);
    const matches = useApi(fetchMatches, game, profile_id, 0, 10);

    const list = ['profile', 'rating', ...(matches.data || [])];

    return (
            <View style={styles.container}>
                <View style={styles.content}>

                    <FlatList
                            onRefresh={() => { rating.reload(); profile.reload(); matches.reload(); }}
                            refreshing={rating.loading || profile.loading || matches.loading}
                            style={styles.list}
                            data={list}
                            renderItem={({item, index}) => {
                                switch (item) {
                                    case 'rating':
                                        return <Rating ratingHistories={rating.data}/>;
                                    case 'profile':
                                        if (profile.data == null) return <Text>...</Text>;
                                        return <Profile data={profile.data}/>;
                                    default:
                                        return <Game data={item as IMatch}/>;
                                }

                            }}
                            keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    list: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    content: {
        flex: 1,
        // alignSelf: 'center',
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
});

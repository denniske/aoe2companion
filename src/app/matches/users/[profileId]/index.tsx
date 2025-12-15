import { Redirect, useLocalSearchParams } from 'expo-router';
import { Platform, View } from 'react-native';
import MainProfile from './(tabs)/main-profile';
import MainStats from './(tabs)/main-stats';
import MainMatches from './(tabs)/main-matches';
import { ScrollView } from '@app/components/scroll-view';

type UserPageParams = {
    profileId: string;
};

export default function Profile() {
    const params = useLocalSearchParams<UserPageParams>();
    const profileId = parseInt(params.profileId);

    if (Platform.OS !== 'web') {
        return <Redirect href={`/matches/users/${profileId}/main-profile`} />;
    }

    return (
        <ScrollView>
            <View className="flex-none">
                <MainProfile />
            </View>
            <View className="flex-none">
                <MainStats />
            </View>
            <MainMatches />
        </ScrollView>
    ); 
}

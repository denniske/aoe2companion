import { Redirect, useLocalSearchParams, useNavigation } from 'expo-router';
import { Platform, View } from 'react-native';
import MainProfile from './(tabs)/main-profile';
import MainStats from './(tabs)/main-stats';
import MainMatches from './(tabs)/main-matches';
import { ScrollView } from '@app/components/scroll-view';
import { useProfile, useProfileFast } from '@app/queries/all';
import { useEffect } from 'react';
import { UserMenu, UserTitle } from './(tabs)/_layout';
import cn from 'classnames';
import { containerClassName } from '@app/styles';
import { Text } from '@app/components/text';
import Profile from '@app/view/components/profile';
import Rating from '@app/view/components/rating';

type UserPageParams = {
    profileId: string;
};

export default function ProfilePage() {
    const params = useLocalSearchParams<UserPageParams>();
    const profileId = parseInt(params.profileId);

    const navigation = useNavigation();

    const { data: fullProfile, isPending: isFullProfilePending } = useProfile(profileId, 'avatar_medium_url,avatar_full_url,last_10_matches_won,stats');
    const { data: profile, isPending } = useProfileFast(profileId);
    const isReady = !isFullProfilePending;

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => <UserTitle profile={profile} />,
            headerRight: () => <UserMenu profile={profile} fullProfile={fullProfile} />,
        });
    }, [profile]);

    if (Platform.OS !== 'web') {
        return <Redirect href={`/matches/users/${profileId}/main-profile`} />;
    }

    return (
        <ScrollView>
            <View className="md:flex-row md:justify-around gap-4 pt-6 pb-2">
                <Profile data={fullProfile} profileId={profileId} ready={isReady} />

                <View className="md:w-1/2">
                    {fullProfile?.ratings?.length === 0 ? (
                        <View />
                    ) : (
                        <Rating ratingHistories={fullProfile?.ratings} profile={fullProfile} ready={isReady} />
                    )}
                </View>
            </View>

            {fullProfile && <MainMatches profile={fullProfile} />}
        </ScrollView>
    );
}

import { FlatList } from '@app/components/flat-list';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useProfile, useWithRefetching } from '@app/queries/all';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@app/helper/translate';
import { ScrollView } from '@app/components/scroll-view';
import { useWebRefresh } from '@app/hooks/use-web-refresh';
import FlatListLoadingIndicator from '@app/view/components/flat-list-loading-indicator';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { MyText } from '@app/view/components/my-text';
import Profile from '@app/view/components/profile';
import Rating from '@app/view/components/rating';
import { createStylesheet } from '@app/theming-new';

export default function MainProfile() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<{ profileId: string }>();
    const profileId = parseInt(params.profileId);

    const styles = useStyles();
    const navigation = useNavigation<any>();

    const { data: profile, refetch, isRefetching } = useWithRefetching(useProfile(profileId, 'avatar_medium_url,avatar_full_url,last_10_matches_won'));

    // const myParams = useGlobalSearchParams();
    // const myParams2 = useLocalSearchParams();
    // console.log('PROFILE', props, myParams, myParams2);
    // console.log('PROFILE', profile);

    const rating = profile?.ratings;

    const route = useRoute();
    const state = useNavigationState((state) => state);
    const activeRoute = state.routes[state.index];
    const isActiveRoute = route?.key === activeRoute?.key;

    useWebRefresh(() => {
        if (!isActiveRoute) return;
        onRefresh();
    }, [isActiveRoute]);

    const onRefresh = async () => {
        console.log('REFRESHING MAIN PROFILE');
        await Promise.all([refetch()]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {Platform.OS === 'web' && isRefetching && <FlatListLoadingIndicator />}
                <ScrollView contentContainerClassName="p-4" refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={isRefetching} />}>
                    <View className="md:flex-row md:justify-around gap-4">
                        <View>
                            {profile === null ? (
                                <View style={styles.container}>
                                    <MyText>{getTranslation('main.profile.noleaderboarddata')}</MyText>
                                </View>
                            ) : (
                                <Profile data={profile} profileId={profileId} ready={profile != null && rating != null} />
                            )}
                        </View>

                        <View className="md:w-1/2">
                            {rating?.length === 0 ? (
                                <View />
                            ) : (
                                <Rating ratingHistories={rating} profile={profile} ready={profile != null && rating != null} />
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        info: {
            marginBottom: 10,
            marginLeft: 5,
        },

        col: {
            paddingHorizontal: 7,
            alignItems: 'center',
        },
        h1: {},
        h2: {
            fontSize: 11,
        },

        pickerRow: {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
            marginBottom: 20,
            // marginTop: 20,
        },
        sectionHeader: {
            marginVertical: 25,
            fontSize: 15,
            fontWeight: '500',
            textAlign: 'left',
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
    } as const)
);

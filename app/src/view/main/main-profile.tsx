import { FlatList } from '@app/components/flat-list';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { fetchProfile } from '../../api/helper/api';
import { getTranslation } from '../../helper/translate';
import { openLink } from '../../helper/url';
import { useWebRefresh } from '../../hooks/use-web-refresh';
import { useSelector } from '../../redux/reducer';
import { appVariants } from '../../styles';
import { useTheme } from '../../theming';
import { createStylesheet } from '../../theming-new';
import FlatListLoadingIndicator from '../components/flat-list-loading-indicator';
import { MyText } from '../components/my-text';
import Profile from '../components/profile';
import Rating from '../components/rating';
import RefreshControlThemed from '../components/refresh-control-themed';
import { useQuery } from '@tanstack/react-query';
import { useProfile, withRefetching } from '@app/queries/all';
import type { UseQueryResult } from '@tanstack/react-query/src/types';

interface Props {
    profileId: number;
}

export default function MainProfile({ profileId }: Props) {
    const styles = useStyles();
    const appStyles = useTheme(appVariants);

    if (profileId == null) {
        // This happens sometimes when clicking notification
        // Routes will contain "Feed" with match_id
        // console.log('ROUTES', JSON.stringify(routes));
        return (
            <View style={styles.list}>
                <MyText>
                    If you see this screen instead of a user profile, report a bug in the{' '}
                    <MyText style={appStyles.link} onPress={() => openLink('https://discord.com/invite/gCunWKx')}>
                        discord
                    </MyText>
                    .
                </MyText>
            </View>
        );
    }

    return <MainProfileInternal profileId={profileId} />;
}

function MainProfileInternal({ profileId }: { profileId: number }) {
    const styles = useStyles();
    const navigation = useNavigation<any>();

    const { data: profile, refetch, isRefetching } = withRefetching(useProfile(profileId));

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

    const list: any = ['profile', 'rating-header', 'rating'];

    const nav = async (route: string) => {
        navigation.navigate(route);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/*<Button onPress={onRefresh}>REFRESH</Button>*/}
                {Platform.OS === 'web' && isRefetching && <FlatListLoadingIndicator />}
                <FlatList
                    // scrollEnabled={false}
                    contentContainerStyle="p-4"
                    data={list}
                    renderItem={({ item, index }) => {
                        switch (item) {
                            case 'rating-header':
                                if (rating?.length === 0) return <View />;
                                return <MyText style={styles.sectionHeader}>{getTranslation('main.profile.ratinghistory.heading')}</MyText>;
                            case 'matches5-header':
                                if (rating?.length === 0) return <View />;
                                return <MyText style={styles.sectionHeader}>{getTranslation('main.profile.recentmatches.heading')}</MyText>;
                            case 'matches5-footer':
                                return (
                                    <Button onPress={() => nav('MainMatches')} mode="contained" compact uppercase={false} dark>
                                        View All
                                    </Button>
                                );
                            case 'matchesVersus-header':
                                if (rating?.length === 0) return <View />;
                                return <MyText style={styles.sectionHeader}>Recent matches with you</MyText>;
                            case 'matchesVersus-footer':
                                return (
                                    <Button onPress={() => nav('MainMatches')} mode="contained" compact uppercase={false} dark>
                                        View All
                                    </Button>
                                );
                            case 'profile':
                                if (profile === null)
                                    return (
                                        <View style={styles.container}>
                                            <MyText>No leaderboard data yet.</MyText>
                                        </View>
                                    );
                                return <Profile data={profile} profileId={profileId} ready={profile != null && rating != null} />;
                            case 'rating':
                                if (rating?.length === 0) return <View />;
                                return <Rating ratingHistories={rating} profile={profile} ready={profile != null && rating != null} />;
                            default:
                                return <View />;
                            // default:
                            //     return <Game match={item as any} expanded={index === -1} highlightedUsers={[profileId]} user={profileId}/>;
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={isRefetching} />}
                />
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
    } as const)
);

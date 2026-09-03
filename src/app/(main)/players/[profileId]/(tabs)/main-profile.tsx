import React from 'react';
import { Platform, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '@app/api/helper/api';
import { useLanguage, useProfile, useWithRefetching } from '@app/queries/all';
import { useTranslation } from '@app/helper/translate';
import { ScrollView } from '@app/components/scroll-view';
import { useWebRefresh } from '@app/hooks/use-web-refresh';
import FlatListLoadingIndicator from '@app/view/components/flat-list-loading-indicator';
import RefreshControlThemed from '@app/view/components/refresh-control-themed';
import { MyText } from '@app/view/components/my-text';
import Profile from '@app/view/components/profile';
import { ProfileLeaderboards } from '@app/components/profile-leaderboards';
import { Match } from '@app/components/match/match';
import { Card } from '@app/components/card';
import { PressableOpacity } from '@app/components/pressable-opacity';
import { Text } from '@app/components/text';
import { Icon } from '@app/components/icon';
import { Field } from '@app/components/field';
import { faAngleRight } from '@fortawesome/sharp-solid-svg-icons';

const RECENT_MATCHES = 5;

export default function MainProfile() {
    const getTranslation = useTranslation();
    const params = useLocalSearchParams<{ profileId: string }>();
    const profileId = parseInt(params.profileId);
    const language = useLanguage();

    const {
        data: profile,
        refetch,
        isRefetching,
    } = useWithRefetching(useProfile(profileId, 'avatar_medium_url,avatar_full_url,last_10_matches_won,stats'));

    // Just the first page - the full list, with its search and filters, lives on
    // the matches screen this section links to.
    const { data: matchesPage } = useQuery({
        queryKey: ['matches', profileId, 'recent'],
        queryFn: () => fetchMatches({ profileIds: [profileId], page: 1, language: language! }),
        enabled: !!language && !!profileId,
    });
    const recentMatches = matchesPage?.matches?.slice(0, RECENT_MATCHES) ?? Array(RECENT_MATCHES).fill(null);

    const onRefresh = async () => {
        await refetch();
    };

    useWebRefresh(() => {
        onRefresh();
    }, []);

    const openMatches = (focusSearch: boolean) =>
        router.navigate(`/players/${profileId}/main-matches${focusSearch ? '?focusSearch=1' : ''}`);

    return (
        <View className="flex-1">
            {Platform.OS === 'web' && isRefetching && <FlatListLoadingIndicator />}
            <ScrollView refreshControl={<RefreshControlThemed onRefresh={onRefresh} refreshing={isRefetching} />}>
                <View className="px-4 pt-4">
                    {profile === null ? (
                        <MyText>{getTranslation('main.profile.noleaderboarddata')}</MyText>
                    ) : (
                        <Profile data={profile} profileId={profileId} ready={profile != null} showLeaderboardRows={false} />
                    )}
                </View>

                <ProfileLeaderboards profile={profile ?? undefined} leaderboardIds={[]} />

                <View className="px-4 gap-2">
                    <Text variant="header-lg">{getTranslation('main.heading.matches')}</Text>

                    {/* Tapping this opens the matches screen with its search focused, rather
                        than raising a keyboard over a page the user is still scrolling. */}
                    <PressableOpacity onPress={() => openMatches(true)}>
                        <Field type="search" placeholder={getTranslation('main.matches.search.placeholder')} editable={false} pointerEvents="none" />
                    </PressableOpacity>

                    {recentMatches.map((match, i) => (
                        <Match key={match?.matchId ?? i} match={match} highlightedUsers={[profileId]} user={profileId} />
                    ))}

                    <Card onPress={() => openMatches(false)} className="justify-center gap-2">
                        <Text variant="header" color="brand">
                            {getTranslation('main.matches.showall', { games: profile ? Number(profile.games).toLocaleString(language) : '' })}
                        </Text>
                        <Icon icon={faAngleRight} size={18} color="brand" />
                    </Card>
                </View>

                <View className="h-6" />
            </ScrollView>
        </View>
    );
}

import { fetchProfile, fetchProfiles } from '@app/api/helper/api';
import { useApi } from '@app/hooks/use-api';
import { useSelector } from '@app/redux/reducer';
import PlayerList from '@app/view/components/player-list';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Text } from './text';
import { uniqBy } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { SkeletonText } from './skeleton';

export const FollowedPlayers = () => {
    const following = useSelector((state) => state.following);

    const auth = useSelector((state) => state.auth);
    const enabled = !!auth?.profileId;
    const profileId = auth?.profileId ?? 0;
    const { data: authProfile } = useApi(
        { enabled },
        [profileId],
        (state) => state.user[profileId]?.profile,
        (state, value) => {
            if (state.user[profileId] == null) {
                state.user[profileId] = {};
            }
            state.user[profileId].profile = {
                ...state.user[profileId].profile,
                ...value,
            };
        },
        fetchProfile,
        { profileId }
    );

    const followingIds = following.map((follow) => follow.profileId);

    const { data: followingPlayers } = useQuery({
        queryKey: ['following', ...followingIds],
        queryFn: () => fetchProfiles({ profileId: followingIds.join(',') }),
    });

    return (
        <View className="gap-2">
            <Text variant="header-lg" className="px-4">
                Followed Players
            </Text>
            <PlayerList
                footer={(player) => {
                    if (!player) {
                        return <SkeletonText variant="body-xs" />;
                    }

                    if (player.profileId === authProfile?.profileId) {
                        return (
                            <Text color="subtle" variant="body-xs" numberOfLines={1} allowFontScaling={false}>
                                {player.games} Games
                            </Text>
                        );
                    } else {
                        const foundPlayer = followingPlayers?.profiles.find((follow) => follow.profileId === player.profileId);
                        if (foundPlayer) {
                            return (
                                <Text color="subtle" variant="body-xs" numberOfLines={1} allowFontScaling={false}>
                                    {foundPlayer.games} Games
                                </Text>
                            );
                        } else {
                            return <SkeletonText variant="body-xs" />;
                        }
                    }
                }}
                variant="horizontal"
                showsHorizontalScrollIndicator={false}
                list={uniqBy([profileId ? authProfile || 'loading' : 'select', ...following, 'follow'] as const, (profile) =>
                    typeof profile === 'string' ? profile : profile.profileId
                )}
                selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}`)}
            />
        </View>
    );
};

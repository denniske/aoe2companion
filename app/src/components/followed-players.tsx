import PlayerList from '@app/view/components/player-list';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Text } from './text';
import { uniqBy } from 'lodash';
import { useAccount, useAuthProfileId, useProfileFast } from '@app/queries/all';

export const FollowedPlayers = () => {
    const authProfileId = useAuthProfileId();

    const { data: account, error } = useAccount();

    // console.log('followed players account', account?.followedPlayers.length);

    const { data: authProfile } = useProfileFast(authProfileId);

    return (
        <View className="gap-2">
            <Text variant="header-lg" className="px-4">
                Followed Players
            </Text>
            <PlayerList
                footer={(player) => {
                    return (
                        <Text color="subtle" variant="body-xs" numberOfLines={1} allowFontScaling={false}>
                            {player?.games} Games
                        </Text>
                    );
                }}
                variant="horizontal"
                showsHorizontalScrollIndicator={false}
                list={uniqBy(
                    [authProfileId ? authProfile || 'loading' : 'select', ...(account?.followedPlayers || []), 'follow'] as const,
                    (profile) => (typeof profile === 'string' ? profile : profile.profileId)
                )}
                selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}?name=${user.name}&country=${user.country}`)}
            />
        </View>
    );
};

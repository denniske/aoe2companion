import { fetchProfile } from '@app/api/helper/api';
import { useSelector } from '@app/redux/reducer';
import PlayerList from '@app/view/components/player-list';
import { router } from 'expo-router';
import { View } from 'react-native';
import { Text } from './text';
import { uniqBy } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from '@app/queries/all';

export const FollowedPlayers = () => {
    const auth = useSelector((state) => state.auth);
    const profileId = auth?.profileId ?? 0;

    const { data: account } = useAccount();

    // console.log('followed players account', account?.followedPlayers.length);

    const { data: authProfile } = useQuery({
        queryKey: ['profile', auth?.profileId],
        queryFn: () => fetchProfile({ profileId }),
        enabled: !!auth?.profileId,
    });

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
                list={uniqBy([profileId ? authProfile || 'loading' : 'select', ...(account?.followedPlayers || []), 'follow'] as const, (profile) =>
                    typeof profile === 'string' ? profile : profile.profileId
                )}
                selectedUser={(user) => router.navigate(`/matches/users/${user.profileId}?name=${user.name}&country=${user.country}`)}
            />
        </View>
    );
};

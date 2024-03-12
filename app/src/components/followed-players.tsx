import { fetchProfile } from '@app/api/helper/api';
import { useApi } from '@app/hooks/use-api';
import { useSelector } from '@app/redux/reducer';
import PlayerList from '@app/view/components/player-list';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Text } from './text';
import { uniqBy } from 'lodash';

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

    return (
        <View className="gap-2">
            <Text variant="header-lg" className="px-4">
                Followed Players
            </Text>
            <PlayerList
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

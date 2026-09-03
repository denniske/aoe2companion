import { View } from 'react-native';
import { useMemo, useState } from 'react';
import { IProfileResult } from '@app/api/helper/api.types';
import { ProfileLeaderboardCard } from './profile-leaderboard-card';
import { Card } from './card';
import { Text } from './text';
import { Icon } from './icon';
import { faAngleDown, faAngleUp } from '@fortawesome/sharp-solid-svg-icons';
import { partition } from 'lodash';
import { useTranslation } from '@app/helper/translate';

export const ProfileLeaderboards: React.FC<{ profile: IProfileResult | undefined; leaderboardIds: string[] }> = ({ profile, leaderboardIds }) => {
    const getTranslation = useTranslation();
    const [showInactive, setShowInactive] = useState(false);

    const leaderboards = useMemo(() => {
        if (!profile?.leaderboards) {
            return [null, null, null, null];
        }

        return profile?.leaderboards.filter((leaderboard) => leaderboardIds.length === 0 || leaderboardIds.includes(leaderboard.leaderboardId));
    }, [profile?.leaderboards, leaderboardIds]);

    // The loading placeholders are null, so test for inactive rather than for
    // active to keep the skeleton cards in the visible group.
    const [activeLeaderboards, inactiveLeaderboards] = useMemo(
        () => partition(leaderboards, (leaderboard) => leaderboard?.active !== false),
        [leaderboards]
    );

    const visibleLeaderboards = showInactive ? [...activeLeaderboards, ...inactiveLeaderboards] : activeLeaderboards;

    return (
        <View className="p-4 gap-4 grid grid-cols-1 lg:grid-cols-2">
            {visibleLeaderboards.map((leaderboard, i) => {
                const stats = profile?.stats.find((s) => s.leaderboardId === leaderboard?.leaderboardId);
                const ratings = profile?.ratings.find((r) => r.leaderboardId === leaderboard?.leaderboardId);

                return (
                    <ProfileLeaderboardCard
                        key={leaderboard?.leaderboardId ?? i}
                        profileId={profile?.profileId}
                        leaderboard={leaderboard}
                        stats={stats}
                        ratings={ratings}
                    />
                );
            })}

            {inactiveLeaderboards.length > 0 && (
                <Card className="flex flex-1 items-center justify-center" direction="vertical" onPress={() => setShowInactive(!showInactive)}>
                    <View className="flex-row items-center gap-2">
                        <Text variant="header" color="brand">
                            {showInactive
                                ? getTranslation('profileleaderboards.hideinactive')
                                : getTranslation('profileleaderboards.showinactive', { count: inactiveLeaderboards.length })}
                        </Text>
                        <Icon icon={showInactive ? faAngleUp : faAngleDown} size={20} color="brand" />
                    </View>
                </Card>
            )}
        </View>
    );
};

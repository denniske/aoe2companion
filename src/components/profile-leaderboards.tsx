import { View } from 'react-native';
import { useMemo } from 'react';
import { IProfileResult } from '@app/api/helper/api.types';
import { ProfileLeaderboardCard } from './profile-leaderboard-card';

export const ProfileLeaderboards: React.FC<{ profile: IProfileResult | undefined; leaderboardIds: string[] }> = ({ profile, leaderboardIds }) => {
    const leaderboards = useMemo(() => {
        if (!profile?.leaderboards) {
            return [null, null, null, null];
        }

        return profile?.leaderboards.filter((leaderboard) => leaderboardIds.length === 0 || leaderboardIds.includes(leaderboard.leaderboardId));
    }, [profile?.leaderboards, leaderboardIds]);

    return (
        <View className="p-4 gap-4 grid grid-cols-2">
            {leaderboards.map((leaderboard) => {
                const stats = profile?.stats.find((s) => s.leaderboardId === leaderboard?.leaderboardId);
                const ratings = profile?.ratings.find((r) => r.leaderboardId === leaderboard?.leaderboardId);

                return <ProfileLeaderboardCard leaderboard={leaderboard} stats={stats} ratings={ratings} />;
            })}
        </View>
    );
};

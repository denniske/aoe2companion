import { View } from 'react-native';
import { Card } from './card';
import { IProfileRatingsLeaderboard, IStatNew } from '@app/api/helper/api.types';
import { Skeleton, SkeletonText } from './skeleton';
import { Text } from './text';
import { first, orderBy, reverse } from 'lodash';
import { getCivIcon } from '../helper/civs';
import { Image } from './uniwind/image';
import { getMapImage } from '@app/helper/maps';
import { Icon } from './icon';
import { IProfileLeaderboardResult } from '@app/api/helper/api.types';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { ProfileLeaderboardModal } from './profile-leaderboard-modal';
import { useState } from 'react';
import cn from 'classnames';
import { appConfig } from '@nex/dataset';

export const ProfileLeaderboardCard: React.FC<{
    leaderboard: IProfileLeaderboardResult | null | undefined;
    stats: IStatNew | undefined;
    ratings: IProfileRatingsLeaderboard | undefined;
}> = ({ leaderboard, stats, ratings }) => {
    const topCiv = first(orderBy(stats?.civ, 'games', 'desc'));
    const topMap = first(orderBy(stats?.map, 'games', 'desc'));
    const [isVisible, setIsVisible] = useState(false);

    const last5MatchesWon = leaderboard?.last10MatchesWon ? reverse(leaderboard.last10MatchesWon.filter((_, i) => i < 5)) : Array(5).fill(null);

    const TextComponent = leaderboard ? Text : SkeletonText;
    const streak = leaderboard?.streak ?? 0;
    const showTabBar = useShowTabBar();
    const canOpenModal = !showTabBar && leaderboard && stats && ratings;

    return (
        <>
            <Card
                className="flex flex-1 px-4 items-center lg:items-stretch gap-4"
                direction="vertical"
                onPress={canOpenModal ? () => setIsVisible(true) : undefined}
            >
                <View className="flex-row items-center justify-between">
                    <TextComponent variant="header-lg" numberOfLines={1} color="subtle">
                        {leaderboard?.leaderboardName}
                    </TextComponent>

                    {canOpenModal && <Icon icon="angle-right" size={24} color="brand" />}
                </View>

                <View className="flex-row gap-4 items-center">
                    <View className="gap-2 items-center lg:flex-1">
                        <TextComponent variant="title" color="brand">
                            #{leaderboard?.rank}
                        </TextComponent>

                        <View className="items-center">
                            <TextComponent variant="label-sm">Rating</TextComponent>
                            <View className="flex-row gap-4">
                                <View className="items-center">
                                    <TextComponent variant="body-sm" color="subtle">
                                        Current
                                    </TextComponent>
                                    <TextComponent variant="label-lg" color="brand" className="min-w-10" align="center">
                                        {leaderboard?.rating}
                                    </TextComponent>
                                </View>

                                <View className="items-center">
                                    <TextComponent variant="body-sm" color="subtle">
                                        Highest
                                    </TextComponent>
                                    <TextComponent variant="body-lg" className="min-w-10" align="center">
                                        {leaderboard?.maxRating}
                                    </TextComponent>
                                </View>
                            </View>
                        </View>

                        <TextComponent variant="label-sm">
                            {Math.abs(streak)} Match {streak < 0 ? 'Losing' : 'Winning'} Streak
                        </TextComponent>
                        <View className="flex-row gap-2">
                            {last5MatchesWon?.map((match) =>
                                match === null ? (
                                    <Skeleton className="rounded-full w-4 h-4" />
                                ) : (
                                    <View
                                        className={`${
                                            match.won === null ? 'bg-red-500 animate-pulse' : match.won ? 'bg-blue-700' : 'bg-gray-200'
                                        } rounded-full w-4 h-4 justify-center items-center`}
                                    >
                                        {match.won ? (
                                            <Icon icon="check" color="white" size={12} />
                                        ) : (
                                            match.won === false && <Icon icon="times" color="black" size={12} />
                                        )}
                                    </View>
                                )
                            )}
                        </View>
                    </View>

                    <View className="w-px bg-border self-stretch hidden lg:flex" />

                    <View className="flex-1 hidden lg:flex items-center gap-1">
                        <TextComponent variant="label-sm" numberOfLines={1}>
                            Favorite Civilization
                        </TextComponent>
                        {topCiv ? (
                            <Image source={getCivIcon(topCiv)} className={cn('w-12 h-12', appConfig.game === 'aoe4' && 'h-12 w-20')} />
                        ) : (
                            <Skeleton className={cn('w-12 h-12', appConfig.game === 'aoe4' && 'h-12 w-20')} />
                        )}

                        <TextComponent variant="label-lg" numberOfLines={1}>
                            {topCiv?.civName}
                        </TextComponent>

                        <TextComponent variant="header" color="brand">
                            {!topCiv?.wins || isNaN(topCiv?.wins) ? '-' : ((topCiv.wins / topCiv.games) * 100).toFixed(0) + '%'} Winrate
                        </TextComponent>

                        <TextComponent color="subtle">{topCiv?.games} Matches</TextComponent>
                    </View>
                    <View className="w-px bg-border self-stretch hidden lg:flex" />

                    <View className="flex-1 hidden lg:flex items-center gap-1">
                        <TextComponent variant="label-sm" numberOfLines={1}>
                            Favorite Map
                        </TextComponent>
                        {topMap ? (
                            <Image
                                source={getMapImage(topMap)}
                                className={cn('w-12 h-12', appConfig.game === 'aoe4' && 'border border-gold-500 rounded')}
                            />
                        ) : (
                            <Skeleton className="w-12 h-12" />
                        )}

                        <TextComponent variant="label-lg" numberOfLines={1}>
                            {topMap?.mapName}
                        </TextComponent>

                        <TextComponent variant="header" color="brand">
                            {!topMap?.wins || isNaN(topMap?.wins) ? '-' : ((topMap.wins / topMap.games) * 100).toFixed(0) + '%'} Winrate
                        </TextComponent>

                        <TextComponent numberOfLines={1}>{topMap?.games} Matches</TextComponent>
                    </View>
                </View>
            </Card>

            {canOpenModal && (
                <ProfileLeaderboardModal
                    name={leaderboard?.name}
                    isVisible={isVisible}
                    onClose={() => setIsVisible(false)}
                    stats={stats}
                    ratings={ratings}
                />
            )}
        </>
    );
};

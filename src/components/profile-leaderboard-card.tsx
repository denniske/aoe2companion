import { View } from 'react-native';
import { Card } from './card';
import { IProfileRatingsLeaderboard, IStatNew , IProfileLeaderboardResult } from '@app/api/helper/api.types';
import { Skeleton, SkeletonText } from './skeleton';
import { Text } from './text';
import { first, orderBy, reverse, sumBy } from 'lodash';
import { getCivIcon } from '../helper/civs';
import { Image } from './uniwind/image';
import { getMapImage } from '@app/helper/maps';
import { Icon } from './icon';
import { faAngleRight, faCheck, faTimes } from '@fortawesome/sharp-solid-svg-icons';
import { useShowTabBar } from '@app/hooks/use-show-tab-bar';
import { ProfileLeaderboardModal } from './profile-leaderboard-modal';
import { useState } from 'react';
import cn from 'classnames';
import { appConfig } from '@nex/dataset';
import { useLanguage } from '@app/queries/all';
import { formatAgo } from '@nex/data';
import { useTranslation } from '@app/helper/translate';
import { router } from 'expo-router';

export const ProfileLeaderboardCard: React.FC<{
    leaderboard: IProfileLeaderboardResult | null | undefined;
    stats: IStatNew | undefined;
    ratings: IProfileRatingsLeaderboard | undefined;
    profileId?: number;
}> = ({ leaderboard, stats, ratings, profileId }) => {
    const getTranslation = useTranslation();
    const language = useLanguage();
    const topCiv = first(orderBy(stats?.civ, 'games', 'desc'));
    const topMap = first(orderBy(stats?.map, 'games', 'desc'));
    const [isVisible, setIsVisible] = useState(false);

    const last5MatchesWon = leaderboard?.last10MatchesWon ? reverse(leaderboard.last10MatchesWon.filter((_, i) => i < 5)) : Array(5).fill(null);

    const TextComponent = leaderboard ? Text : SkeletonText;
    const streak = leaderboard?.streak ?? 0;
    const showTabBar = useShowTabBar();
    const canOpenModal = !showTabBar && leaderboard && stats && ratings;
    // Web opens the modal in place; on a phone the card is the way into the
    // leaderboard's own screen, so it navigates instead.
    const canNavigate = showTabBar && !!leaderboard && !!profileId;
    const onPress = canOpenModal
        ? () => setIsVisible(true)
        : canNavigate
          ? () => router.navigate(`/players/${profileId}/main-stats?leaderboardId=${leaderboard!.leaderboardId}`)
          : undefined;
    // Rank is only recalculated for active players, so an inactive card shows how
    // long ago they dropped off instead of a rank that stopped being true.
    const isInactive = leaderboard?.active === false;
    // leaderboard_row counts wins and losses from the rating table, which holds
    // nothing for some old ladders even though their matches were collected. The
    // civ stats count those matches, so use them rather than claiming 0 games.
    const games = leaderboard?.games || (stats ? sumBy(stats.civ, (c) => c.games) : 0) || undefined;

    return (
        <>
            <Card
                className="flex flex-1 px-4 items-center lg:items-stretch gap-4"
                direction="vertical"
                onPress={onPress}
                // Marks the card as interactive once its queries have resolved,
                // so automated checks can wait for the modal to be openable.
                testID={onPress ? 'leaderboard-card-openable' : 'leaderboard-card-loading'}
            >
                <View className={cn('flex-row items-center gap-1 lg:gap-5', !leaderboard && 'min-w-24')}>
                    <TextComponent variant="header-lg" numberOfLines={1} color="subtle">
                        {leaderboard?.leaderboardName}
                    </TextComponent>

                    <View className="w-px bg-border self-stretch hidden lg:flex" />

                    <TextComponent variant="label-lg" color="subtle" className="hidden lg:flex">
                        {getTranslation('profilecard.games', { games: games?.toLocaleString(language) ?? '' })}
                    </TextComponent>

                    <View className="flex-1" />

                    {!!onPress && <Icon icon={faAngleRight} size={24} color="brand" />}
                </View>

                <TextComponent variant="label-lg" color="subtle" className={cn('flex lg:hidden -my-2', !leaderboard && 'max-w-24')}>
                    {getTranslation('profilecard.games', { games: games?.toLocaleString(language) ?? '' })}
                </TextComponent>

                <View className="flex-row gap-4 items-center">
                    <View className="gap-2 items-center lg:flex-1">
                        {isInactive ? (
                            <View className="items-center">
                                <TextComponent variant="header-lg" color="subtle" className="min-h-10 pt-2">
                                    {getTranslation('profilecard.inactive')}
                                </TextComponent>
                                <TextComponent variant="body-xs" className="min-w-24 -mt-0.5 whitespace-nowrap" color="subtle">
                                    {leaderboard?.lastMatchTime
                                        ? getTranslation('profilecard.lastplayed', { time: formatAgo(new Date(leaderboard.lastMatchTime)) })
                                        : ''}
                                </TextComponent>
                            </View>
                        ) : (
                            <View className="items-center">
                                <TextComponent variant="title" color="brand">
                                    #{leaderboard?.rank}
                                </TextComponent>
                                <TextComponent variant="body-xs" className="min-w-24 -mt-0.5 whitespace-nowrap" color="subtle">
                                    {getTranslation('profilecard.toppercent', {
                                        percent: (
                                            leaderboard && leaderboard.total ? Math.max(1, (leaderboard.rank / leaderboard.total) * 100) : 0
                                        ).toFixed(),
                                    })}
                                    {/* A nested Text, not a span: this card renders on native now,
                                        where raw html elements have no view config and throw. */}
                                    <Text variant="body-xs" color="subtle">
                                        {' '}
                                        {getTranslation('profilecard.ofplayers', { total: leaderboard?.total.toLocaleString(language) ?? '' })}
                                    </Text>
                                </TextComponent>
                            </View>
                        )}

                        <View className="items-center">
                            <TextComponent variant="label-sm">{getTranslation('profilecard.rating')}</TextComponent>
                            <View className="flex-row gap-4">
                                <View className="items-center">
                                    <TextComponent variant="body-sm" color="subtle">
                                        {getTranslation('profilecard.rating.current')}
                                    </TextComponent>
                                    <TextComponent variant="label-lg" color="brand" className="min-w-10" align="center">
                                        {leaderboard?.rating}
                                    </TextComponent>
                                </View>

                                <View className="items-center">
                                    <TextComponent variant="body-sm" color="subtle">
                                        {getTranslation('profilecard.rating.highest')}
                                    </TextComponent>
                                    <TextComponent variant="body-lg" className="min-w-10" align="center">
                                        {leaderboard?.maxRating}
                                    </TextComponent>
                                </View>
                            </View>
                        </View>

                        {/* Both the streak and last10MatchesWon come from columns that are
                            not maintained for a leaderboard nobody has played in a while, so
                            they read 0 and render as five blank circles. */}
                        {!isInactive && (
                        <TextComponent variant="label-sm">
                            {getTranslation(streak < 0 ? 'profilecard.streak.losing' : 'profilecard.streak.winning', { count: Math.abs(streak) })}
                        </TextComponent>
                        )}
                        {!isInactive && (
                        <View className="flex-row gap-2">
                            {last5MatchesWon?.map((match, i) =>
                                match === null ? (
                                    <Skeleton key={i} className="rounded-full w-4 h-4" />
                                ) : (
                                    <View
                                        key={i}
                                        className={`${
                                            match.won === null ? 'bg-red-500 animate-pulse' : match.won ? 'bg-blue-700' : 'bg-gray-200'
                                        } rounded-full w-4 h-4 justify-center items-center`}
                                    >
                                        {match.won ? (
                                            <Icon icon={faCheck} color="white" size={12} />
                                        ) : (
                                            match.won === false && <Icon icon={faTimes} color="black" size={12} />
                                        )}
                                    </View>
                                )
                            )}
                        </View>
                        )}
                    </View>

                    <View className="w-px bg-border self-stretch hidden lg:flex" />

                    <View className="flex-1 hidden lg:flex items-center gap-1">
                        <TextComponent variant="label-sm" numberOfLines={1}>
                            {getTranslation('profilecard.favoritecivilization')}
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
                            {getTranslation('profilecard.winrate', {
                                percent: !topCiv?.wins || isNaN(topCiv?.wins) ? '-' : ((topCiv.wins / topCiv.games) * 100).toFixed(0) + '%',
                            })}
                        </TextComponent>

                        <TextComponent color="subtle">{getTranslation('profilecard.matches', { games: topCiv?.games ?? '' })}</TextComponent>
                    </View>
                    <View className="w-px bg-border self-stretch hidden lg:flex" />

                    <View className="flex-1 hidden lg:flex items-center gap-1">
                        <TextComponent variant="label-sm" numberOfLines={1}>
                            {getTranslation('profilecard.favoritemap')}
                        </TextComponent>
                        {topMap ? (
                            <Image
                                source={getMapImage(topMap, 'thumb')}
                                className={cn('w-12 h-12', appConfig.game === 'aoe4' && 'border border-gold-500 rounded')}
                            />
                        ) : (
                            <Skeleton className="w-12 h-12" />
                        )}

                        <TextComponent variant="label-lg" numberOfLines={1}>
                            {topMap?.mapName}
                        </TextComponent>

                        <TextComponent variant="header" color="brand">
                            {getTranslation('profilecard.winrate', {
                                percent: !topMap?.wins || isNaN(topMap?.wins) ? '-' : ((topMap.wins / topMap.games) * 100).toFixed(0) + '%',
                            })}
                        </TextComponent>

                        <TextComponent numberOfLines={1}>{getTranslation('profilecard.matches', { games: topMap?.games ?? '' })}</TextComponent>
                    </View>
                </View>
            </Card>

            {!!(canOpenModal) && (
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

import { Card } from '@app/components/card';
import { Skeleton, SkeletonText } from '@app/components/skeleton';
import { Text } from '@app/components/text';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { Tournament } from 'liquipedia';
import { Platform, View } from 'react-native';

import { formatPrizePool, formatTier, tournamentStatus } from '../../helper/tournaments';
import { getTranslation } from '../../helper/translate';

export const TournamentCard: React.FC<Tournament & { subtitle?: string; direction?: 'vertical' | 'horizontal' }> = ({
    direction = 'horizontal',
    ...tournament
}) => {
    if (!tournament.path) {
        return <TournamentSkeletonCard subtitle={!!tournament.subtitle} direction={direction} />;
    }

    const status = tournamentStatus(tournament);
    const start = tournament.start && format(tournament.start, 'LLL d');
    const endDate = tournament.end || tournament.start;
    const end = endDate && format(endDate, 'LLL d');

    return (
        <Card
            href={`/competitive/tournaments/${encodeURIComponent(tournament.path)}`}
            direction={direction}
            className={direction === 'horizontal' ? '' : 'items-center w-36'}
        >
            {Platform.OS !== 'web' && (
                <View className={`${direction === 'horizontal' ? 'w-12' : ''} aspect-square items-center justify-center`}>
                    <Image
                        source={{ uri: tournament.league?.image }}
                        className={`${direction === 'horizontal' ? 'w-12' : 'w-16'} aspect-square`}
                        contentFit="contain"
                    />
                </View>
            )}
            <View className={direction === 'horizontal' ? 'flex-1 gap-0.5' : 'items-center'}>
                <Text variant={direction === 'horizontal' ? 'header-sm' : 'header-xs'} numberOfLines={1}>
                    {tournament.name.replace(tournament.game, '').trim()}
                </Text>
                <Text variant={direction === 'horizontal' ? 'body-sm' : 'body-xs'} numberOfLines={1}>
                    {tournament.tier && formatTier(tournament.tier)} • {getTranslation(`tournaments.${status}date`, { start, end })} •{' '}
                    {tournament.prizePool && formatPrizePool(tournament.prizePool)}
                </Text>
                {tournament.subtitle && (
                    <Text variant={direction === 'horizontal' ? 'body-sm' : 'body-xs'} numberOfLines={1}>
                        {tournament.subtitle}
                    </Text>
                )}
            </View>
        </Card>
    );
};

export const TournamentSkeletonCard: React.FC<{ direction: 'horizontal' | 'vertical'; subtitle: boolean }> = ({ direction, subtitle }) => {
    return (
        <Card direction={direction} className={direction === 'horizontal' ? '' : 'items-center w-36'}>
            {Platform.OS !== 'web' && (
                <View className={`${direction === 'horizontal' ? 'w-12' : ''} aspect-square items-center justify-center`}>
                    <Skeleton className={`${direction === 'horizontal' ? 'w-12' : 'w-16'} aspect-square`} />
                </View>
            )}
            <View className={direction === 'horizontal' ? 'flex-1 gap-0.5' : 'items-center'}>
                <SkeletonText variant={direction === 'horizontal' ? 'header-sm' : 'header-xs'} />
                <SkeletonText variant={direction === 'horizontal' ? 'body-sm' : 'body-xs'} />
                {subtitle && <SkeletonText variant={direction === 'horizontal' ? 'body-sm' : 'body-xs'} />}
            </View>
        </Card>
    );
};

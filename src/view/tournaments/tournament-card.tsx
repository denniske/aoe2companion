import { Card } from '@app/components/card';
import { Skeleton, SkeletonText } from '@app/components/skeleton';
import { Text } from '@app/components/text';
import { format } from 'date-fns';
import { Image } from '@/src/components/uniwind/image';
import { Tournament } from 'liquipedia';
import { Platform, View } from 'react-native';

import { formatPrizePool, formatTier, tournamentStatus } from '../../helper/tournaments';
import { useTranslation } from '@app/helper/translate';

const isCurrentYear = (date: Date | undefined) => date?.getFullYear() === new Date().getFullYear();

export const TournamentCard: React.FC<Tournament & { subtitle?: string; direction?: 'vertical' | 'horizontal' }> = ({
    direction = 'horizontal',
    ...tournament
}) => {
    if (!tournament.path) {
        return <TournamentSkeletonCard subtitle={!!tournament.subtitle} direction={direction} />;
    }

    const getTranslation = useTranslation();
    const status = tournamentStatus(tournament);
    const startDateFormat = isCurrentYear(tournament.start) ? 'LLL d' : 'LLL d (yyyy)';
    const start = tournament.start && format(tournament.start, startDateFormat);
    const endDate = tournament.end || tournament.start;
    const endDateFormat = isCurrentYear(endDate) ? 'LLL d' : 'LLL d (yyyy)';
    const end = endDate && format(endDate, endDateFormat);

    return (
        <Card
            href={`/competitive/tournaments/${encodeURIComponent(tournament.path)}`}
            direction={direction}
            className={direction === 'horizontal' ? '' : 'items-center2 w-36'}
        >
            <View className={`${direction === 'horizontal' ? 'w-12' : ''} items-center justify-center`}>
                <Image
                    source={{ uri: tournament.league?.image }}
                    className={`${direction === 'horizontal' ? 'w-12' : 'w-16'} aspect-square`}
                    contentFit="contain"
                />
            </View>
            <View className={direction === 'horizontal' ? 'flex-1 gap-0.5' : 'items-center'}>
                <Text variant={direction === 'horizontal' ? 'header-sm' : 'header-xs'} className={'truncate mb-1'} numberOfLines={1}>
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

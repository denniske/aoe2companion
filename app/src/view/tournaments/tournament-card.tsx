import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { Tournament } from 'liquipedia';
import { Platform, View } from 'react-native';

import { formatPrizePool, formatTier, tournamentStatus } from '../../helper/tournaments';
import { getTranslation } from '../../helper/translate';

export const TournamentCard: React.FC<Tournament & { subtitle?: string }> = (tournament) => {
    const status = tournamentStatus(tournament);
    const start = tournament.start && format(tournament.start, 'LLL d');
    const endDate = tournament.end || tournament.start;
    const end = endDate && format(endDate, 'LLL d');

    return (
        <Card href={`competitive/tournaments/${encodeURIComponent(tournament.path)}`}>
            {Platform.OS !== 'web' && (
                <View className="w-12 aspect-square items-center justify-center">
                    <Image source={{ uri: tournament.league?.image }} className="w-10 aspect-square" contentFit="contain" />
                </View>
            )}
            <View className="flex-1 gap-0.5">
                <Text variant="header-sm">{tournament.name}</Text>
                <Text variant="body-sm">
                    {tournament.tier && formatTier(tournament.tier)} • {getTranslation(`tournaments.${status}date`, { start, end })} •{' '}
                    {tournament.prizePool && formatPrizePool(tournament.prizePool)}
                </Text>
                {tournament.subtitle && (
                    <Text variant="body-sm" numberOfLines={1}>
                        {tournament.subtitle}
                    </Text>
                )}
            </View>
        </Card>
    );
};

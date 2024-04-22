import { appConfig } from '@nex/dataset';
import { endOfDay, isPast, startOfDay } from 'date-fns';
import { Age2TournamentCategory, Age4TournamentCategory, Tournament, TournamentCategory } from 'liquipedia';
import { startCase } from 'lodash';
import { formatCurrency } from 'react-native-format-currency';

export const sortedTiers: TournamentCategory[] =
    appConfig.game === 'aoe2de'
        ? [
              Age2TournamentCategory.TierS,
              Age2TournamentCategory.TierA,
              Age2TournamentCategory.TierB,
              Age2TournamentCategory.TierC,
              Age2TournamentCategory.Weekly,
              Age2TournamentCategory.Monthly,
              Age2TournamentCategory.ShowMatches,
              Age2TournamentCategory.Qualifiers,
              Age2TournamentCategory.FFA,
              Age2TournamentCategory.Miscellaneous,
          ]
        : [
              Age4TournamentCategory.TierS,
              Age4TournamentCategory.TierA,
              Age4TournamentCategory.TierB,
              Age4TournamentCategory.TierC,
              Age4TournamentCategory.Weekly,
              Age4TournamentCategory.Monthly,
              Age4TournamentCategory.ShowMatches,
              Age4TournamentCategory.Qualifiers,
              Age4TournamentCategory.FFA,
              Age4TournamentCategory.Miscellaneous,
          ];

export const sortByTier = (tournament: Tournament) => {
    return sortedTiers.indexOf(tournament.tier);
};
export const sortByStatus = (tournament: Tournament) => {
    const status = tournamentStatus(tournament);
    const sortedStatuses = ['ongoing', 'upcoming', 'past'];
    return sortedStatuses.indexOf(status);
};

export const transformSearch = (string: string) => string.toLowerCase().replace(/'/g, '').replace(/\W/g, ' ').replace(/ +/g, ' ');
export const tournamentAbbreviation = (string: string) =>
    string
        .match(/\b([A-Z0-9])/g)
        ?.join('')
        .toLowerCase() ?? '';

export const formatPrizePool = (prizePool: NonNullable<Tournament['prizePool']>) =>
    formatCurrency({ ...prizePool, amount: Math.round(prizePool.amount) })[0].replace(/(,\d{3})/i, 'K');

export const formatTier = (tier: TournamentCategory) => startCase(tier.split('/').at(-1)?.split('Tournament')[0]);

export const formatTierShort = (tier: TournamentCategory) => formatTier(tier).replace('ellaneous', '').replace('Show Matches', 'SM');

export const tournamentStatus = (tournament: Tournament): 'ongoing' | 'upcoming' | 'past' => timeStatus(tournament.start, tournament.end);

export const timeStatus = (start?: Date, end?: Date): 'ongoing' | 'upcoming' | 'past' => {
    const startDate = startOfDay(start ?? new Date());
    const endDate = endOfDay(end ?? start ?? new Date());

    const hasTournamentStarted = isPast(startDate);
    const hasTournamentEnded = isPast(endDate);
    const isOngoing = hasTournamentStarted && !hasTournamentEnded;
    const isUpcoming = !hasTournamentStarted && !hasTournamentEnded;

    if (isOngoing) {
        return 'ongoing';
    } else if (isUpcoming) {
        return 'upcoming';
    }

    return 'past';
};

import { addDays, endOfDay, isPast, startOfDay } from 'date-fns';
import { Age2TournamentCategory, Tournament, TournamentCategory } from 'liquipedia';
import { startCase } from 'lodash';
import { formatCurrency } from 'react-native-format-currency';

export const sortByTier = (tournament: Tournament) => {
    const sortedTiers: TournamentCategory[] = [
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
    ];
    return sortedTiers.indexOf(tournament.tier);
};

export const transformSearch = (string: string) => string.toLowerCase().replace(/\'/g, '').replace(/\W/g, ' ').replace(/ +/g, ' ');
export const tournamentAbbreviation = (string: string) =>
    string
        .match(/\b([A-Z0-9])/g)
        ?.join('')
        .toLowerCase() ?? '';

export const formatPrizePool = (prizePool: NonNullable<Tournament['prizePool']>) =>
    formatCurrency({ ...prizePool, amount: Math.round(prizePool.amount) })[0].replace(/(,\d{3})/i, 'K');

export const formatTier = (tier: TournamentCategory) => startCase(tier.split('/').at(-1)?.split('Tournament')[0]);

export const tournamentStatus = (tournament: Tournament): 'ongoing' | 'upcoming' | 'past' => {
    const startDate = startOfDay(tournament.start ?? new Date());
    const endDate = endOfDay(tournament.end ?? tournament.start ?? new Date());

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

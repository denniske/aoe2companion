import { differenceInMinutes, endOfDay, isPast, startOfDay } from 'date-fns';
import { Match, Playoff, PlayoffMatch, Tournament, TournamentCategory, TournamentDetail } from '@app/api/liquipedia.types';
import { orderBy } from 'lodash';
import { formatCurrency } from 'react-native-format-currency';

export const sortedTiers: TournamentCategory[] = [
    TournamentCategory.TierS,
    TournamentCategory.TierA,
    TournamentCategory.TierB,
    TournamentCategory.TierC,
    TournamentCategory.Weekly,
    TournamentCategory.Monthly,
    TournamentCategory.ShowMatches,
    TournamentCategory.Qualifiers,
    TournamentCategory.FFA,
    TournamentCategory.Miscellaneous,
];

const tierNames: Record<TournamentCategory, string> = {
    [TournamentCategory.TierS]: 'S Tier',
    [TournamentCategory.TierA]: 'A Tier',
    [TournamentCategory.TierB]: 'B Tier',
    [TournamentCategory.TierC]: 'C Tier',
    [TournamentCategory.Weekly]: 'Weekly',
    [TournamentCategory.Monthly]: 'Monthly',
    [TournamentCategory.ShowMatches]: 'Show Matches',
    [TournamentCategory.Qualifiers]: 'Qualifier',
    [TournamentCategory.FFA]: 'FFA',
    [TournamentCategory.Miscellaneous]: 'Miscellaneous',
};

export const sortByTier = (tournament: Tournament) => {
    return tournament.tier ? sortedTiers.indexOf(tournament.tier) : sortedTiers.length;
};
export const sortByStatus = (tournament: Tournament) => {
    const status = tournamentStatus(tournament);
    const sortedStatuses = ['ongoing', 'upcoming', 'past'];
    return sortedStatuses.indexOf(status);
};

export const sortByStart = (tournament: Tournament) => {
    return tournament.start;
};

export const transformSearch = (string: string) => string.toLowerCase().replace(/'/g, '').replace(/\W/g, ' ').replace(/ +/g, ' ');
export const tournamentAbbreviation = (string: string) =>
    string
        .match(/\b([A-Z0-9])/g)
        ?.join('')
        .toLowerCase() ?? '';

export const formatPrizePool = (prizePool: NonNullable<Tournament['prizePool']>) =>
    formatCurrency({ ...prizePool, amount: Math.round(prizePool.amount) })[0].replace(/(,\d{3})/i, 'K');

export const formatTier = (tier: TournamentCategory) => tierNames[tier] ?? tier;

export const getMatches = (playoffs: Playoff[] | undefined) =>
    orderBy(
        playoffs
            ?.flatMap((playoff) =>
                playoff.rounds.flatMap((round) =>
                    round.matches.map((match) => ({
                        ...match,
                        header: match.header ?? { name: playoff.name ? `${playoff.name} ${round.name}` : round.name, format: round.format },
                    }))
                )
            )
            .filter((match) => match.startTime),
        'startTime'
    );
export const getAllTournamentMatches = (tournament?: TournamentDetail) => {
    const playoffMatches = getMatches(tournament?.playoffs);
    const groupMatches = getMatches(tournament?.groups);
    return orderBy([...playoffMatches, ...groupMatches], 'startTime');
};

export const findFullMatch = (match: Match, matchesList?: Match[]) =>
    matchesList?.find(
        (m) =>
            match.tournament.path === m.tournament.path &&
            match.startTime?.getTime() === m.startTime?.getTime() &&
            match.participants.every((p) =>
                m.participants.map((participant) => playerNameForSearch(participant.name)).includes(playerNameForSearch(p.name))
            )
    );

export const playerNameForSearch = (name: string) =>
    name
        ?.toLowerCase()
        .replace(/^(the)/, '')
        .replace(/[0-9]/g, '');

export const findTournamentMatch = (match: Omit<Match, 'tournament'>, tournament?: TournamentDetail) => {
    const matches = getAllTournamentMatches(tournament);
    return matches.find(
        (m) =>
            match.startTime?.getTime() === m.startTime?.getTime() &&
            match.participants.every((p) =>
                m.participants.map((participant) => playerNameForSearch(participant.name)).includes(playerNameForSearch(p.name))
            )
    );
};

export const formatTierShort = (tier: TournamentCategory) => formatTier(tier).replace('ellaneous', '').replace('Show Matches', 'SM');

export const tournamentStatus = (tournament: Tournament): 'ongoing' | 'upcoming' | 'past' => timeStatus(tournament.start, tournament.end);

export const timeStatus = (start?: Date, end?: Date): 'ongoing' | 'upcoming' | 'past' => {
    const startDate = startOfDay(start ?? new Date());
    const endDate = endOfDay(end ?? start ?? new Date());

    const hasTournamentStarted = start && isPast(startDate);
    const hasTournamentEnded = (end || start) && isPast(endDate);
    const isOngoing = hasTournamentStarted && !hasTournamentEnded;
    const isUpcoming = !hasTournamentStarted && !hasTournamentEnded;

    if (isOngoing) {
        return 'ongoing';
    } else if (isUpcoming) {
        return 'upcoming';
    }

    return 'past';
};

export const getLiveOrUpcomingMatch = (match?: PlayoffMatch, tournamentMatches?: Match[]) =>
    tournamentMatches?.find(
        (tournamentMatch) =>
            match?.startTime &&
            tournamentMatch.startTime &&
            Math.abs(differenceInMinutes(match.startTime, tournamentMatch.startTime)) < 150 &&
            match.participants.every((participant) =>
                tournamentMatch.participants
                    .map((tournamentParticipant) => playerNameForSearch(tournamentParticipant.name))
                    .includes(playerNameForSearch(participant.name))
            )
    );

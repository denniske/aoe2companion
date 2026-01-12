import { fetchMatches } from '@app/api/helper/api';
import { IMatchNew, IPlayerNew, ITeamNew } from '@app/api/helper/api.types';
import { useQuery } from '@tanstack/react-query';
import { flatten, orderBy } from 'lodash';
import { useAuthProfileId, useLanguage } from '@app/queries/all';

export function getModName(modStr: string) {
    if (!modStr) return null;
    const [pubIdString, ...nameParts] = modStr.split('-');
    const pubId = parseInt(pubIdString, 10);
    const name = nameParts.join('-').trim();
    return name;
}

export const sortTeamsByCurrentPlayer = (teams: ITeamNew[], profileId?: number) => {
    const focusIndex = teams.findIndex((team) => team.players.some((player) => player.profileId === profileId));

    if (!profileId || focusIndex === -1) {
        return teams;
    }

    return [teams[focusIndex], ...teams.slice(0, focusIndex), ...teams.slice(focusIndex + 1, teams.length)];
};

export const sortTeamByCurrentPlayer = <T extends {profileId: number}>(players: T[], profileId?: number) => {
    const focusIndex = players.findIndex((player) => player.profileId === profileId);

    if (!profileId || focusIndex === -1) {
        return players;
    }

    return [players[focusIndex], ...players.slice(0, focusIndex), ...players.slice(focusIndex + 1, players.length)];
};

export const getProfileIdFromHighlightedUsers = (match: IMatchNew, highlightedUsers?: number[]) => {
    if (!highlightedUsers?.length) {
        return undefined;
    }

    if (highlightedUsers.length === 1) {
        return highlightedUsers[0];
    }

    if (match.teams.some((team) => highlightedUsers.every((u) => team.players.some((p) => p.profileId === u)))) {
        return highlightedUsers[0];
    }
};

export const useAccountMostRecentMatches = (count: number) => {
    const authProfileId = useAuthProfileId();
    const profileIds: number[] = authProfileId ? [authProfileId] : [];

    const language = useLanguage();
    const { data } = useQuery({
        queryKey: ['account-most-recent-matches', profileIds],
        queryFn: () =>
            fetchMatches({
                profileIds,
                language: language!,
            }),
        enabled: !!language && profileIds.length > 0,
        refetchOnWindowFocus: true,
    });

    const matches = data?.matches.slice(0, count);

    const filterAndSortPlayers = (players: IPlayerNew[]) => {
        let filteredPlayers = players.filter((p) => p.profileId == authProfileId);
        filteredPlayers = orderBy(filteredPlayers, (p) => p.profileId == authProfileId);
        return filteredPlayers;
    };

    return matches?.map((match) => ({
        ...match,
        filteredPlayers: filterAndSortPlayers(flatten(match.teams.map((t) => t.players))).map((player) => player.profileId),
    }));
};

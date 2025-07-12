import { fetchMatches } from '@app/api/helper/api';
import { IPlayerNew } from '@app/api/helper/api.types';
import { useSelector } from '@app/redux/reducer';
import { useQuery } from '@tanstack/react-query';
import { flatten, orderBy } from 'lodash';
import { useAuthProfileId } from '@app/queries/all';

export const useAccountMostRecentMatches = (count: number) => {
    const authProfileId = useAuthProfileId();
    const profileIds: number[] = authProfileId ? [authProfileId] : [];

    const { data } = useQuery({
        queryKey: ['account-most-recent-matches', profileIds],
        queryFn: () =>
            fetchMatches({
                profileIds,
            }),
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

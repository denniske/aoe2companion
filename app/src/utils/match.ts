import { fetchMatches } from '@app/api/helper/api';
import { IPlayerNew } from '@app/api/helper/api.types';
import { useSelector } from '@app/redux/reducer';
import { useQuery } from '@tanstack/react-query';
import { flatten, orderBy } from 'lodash';

export const useCurrentMatches = (count: number) => {
    const auth = useSelector((state) => state.auth);
    const profileIds: number[] = [];
    if (auth) {
        profileIds.push(auth?.profileId);
    }

    const { data } = useQuery({
        queryKey: ['current-matches', profileIds],
        queryFn: () =>
            fetchMatches({
                profileIds,
            }),
    });
    const matches = data?.matches.slice(0, count);

    const filterAndSortPlayers = (players: IPlayerNew[]) => {
        let filteredPlayers = players.filter((p) => p.profileId == auth?.profileId);
        filteredPlayers = orderBy(filteredPlayers, (p) => p.profileId == auth?.profileId);
        return filteredPlayers;
    };

    return matches?.map((match) => ({
        ...match,
        filteredPlayers: filterAndSortPlayers(flatten(match.teams.map((t) => t.players))).map((player) => player.profileId),
    }));
};

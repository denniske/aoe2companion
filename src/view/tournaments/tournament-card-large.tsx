import { useTournament } from '@app/api/tournaments';
import { Tournament } from '@app/api/liquipedia.types';

import { TournamentCard, TournamentSkeletonCard } from './tournament-card';

export const TournamentCardLarge: React.FC<Tournament | { path: string }> = ({ path: id, ...rest }) => {
    const { data: tournament } = useTournament(id, !!id);

    if (!tournament) {
        return <TournamentSkeletonCard direction="horizontal" subtitle />;
    }

    const participants = tournament.participants.map((participant) => participant.name);

    return <TournamentCard {...(rest as Tournament)} {...tournament} subtitle={`Featuring: ${participants.join(', ')}`} />;
};

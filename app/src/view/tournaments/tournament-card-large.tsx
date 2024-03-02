import { useTournament } from '@app/api/tournaments';

import { TournamentCard } from './tournament-card';

export const TournamentCardLarge = ({ id }: { id: string }) => {
    const { data: tournament } = useTournament(id);

    if (!tournament) {
        return null;
    }

    const participants = tournament.participants.map((participant) => participant.name);

    return <TournamentCard {...tournament} subtitle={`Featuring: ${participants.join(', ')}`} />;
};

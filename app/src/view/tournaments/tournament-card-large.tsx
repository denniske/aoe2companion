// import { useTournament } from '@app/api/tournaments';

import { Tournament } from 'liquipedia';

import { TournamentCard } from './tournament-card';

export const TournamentCardLarge: React.FC<Tournament> = (tournament) => {
    // const { data: tournament } = useTournament(id);

    // if (!tournament) {
    //     return null;
    // }

    // const participants = tournament.participants.map((participant) => participant.name);

    return <TournamentCard {...tournament} />;
};

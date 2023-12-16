import { useQuery } from '@tanstack/react-query';
import { Liquipedia, Tournament, TournamentCategory, TournamentDetail } from 'liquipedia';
import * as Application from 'expo-application';

const liquipedia = new Liquipedia({
    USER_AGENT: `${Application.applicationName}/${Application.nativeApplicationVersion} (hello@aoe2companion.com)`,
});

export const useTournaments = (category: TournamentCategory) =>
    useQuery<Tournament[]>({ queryKey: ['tournaments', category], queryFn: async () => await liquipedia.aoe.getTournaments(category) });

export const useTournament = (id: string, enabled?: boolean) =>
    useQuery<TournamentDetail>({ queryKey: ['tournament', id], queryFn: async () => await liquipedia.aoe.getTournament(id), enabled });

import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/core';
import { RootStackParamList } from '../../App2';
import { TournamentsList } from './tournaments/tournament-list';
import { TournamentDetail } from './tournaments/tournament-detail';
import IconHeader from './components/navigation-header/icon-header';
import TextHeader from './components/navigation-header/text-header';
import { getTranslation } from '../helper/translate';
import { useTournament } from '../api/tournaments';

export function TournamentsTitle(props: any) {
    const { tournamentId: id, league } = props.route?.params ?? {};
    const { data: tournament } = useTournament(id, !!id);

    if (id) {
        return (
            <IconHeader
                icon={{ uri: tournament?.league?.image }}
                text={tournament?.name ?? ''}
                subtitle={tournament?.league?.name}
                onSubtitlePress={() => tournament?.league?.path && props.navigation.push('Tournaments', { league: tournament.league.path })}
                onLayout={props.titleProps.onLayout}
            />
        );
    }
    return (
        <TextHeader
            text={league ? decodeURI(league).replaceAll('_', ' ') : getTranslation('tournaments.title')}
            onLayout={props.titleProps.onLayout}
        />
    );
}

export default function TournamentsPage() {
    const { params = {} } = useRoute<RouteProp<RootStackParamList, 'Tournaments'>>();
    const id = params?.tournamentId;

    if (id) {
        return <TournamentDetail id={id} />;
    }

    return <TournamentsList />;
}

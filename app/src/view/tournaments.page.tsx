import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/core';
import { RootStackParamList } from '../../App2';
import { TournamentsList } from './tournaments/tournament-list';
import { TournamentDetail } from './tournaments/tournament-detail';
import IconHeader from './components/navigation-header/icon-header';
import TextHeader from './components/navigation-header/text-header';
import { getTranslation } from '../helper/translate';
import { useTournament } from '../api/tournaments';
import { createStylesheet } from '../theming-new';
import { View, StyleSheet, Linking } from 'react-native';
import { Image } from 'expo-image';
import { MyText } from './components/my-text';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

export const TournamentsFooter: React.FC = () => {
    const styles = useStyles();

    return (
        <TouchableOpacity style={styles.footer} onPress={() => Linking.openURL('https://liquipedia.net/ageofempires/')}>
            <Image source={require('../../assets/icon/liquipedia.png')} style={styles.footerImage} />
            <MyText style={styles.footerText}>{getTranslation('tournaments.liquipediadisclaimer')}</MyText>
        </TouchableOpacity>
    );
};

export default function TournamentsPage() {
    const { params = {} } = useRoute<RouteProp<RootStackParamList, 'Tournaments'>>();
    const id = params?.tournamentId;
    const styles = useStyles();

    if (id) {
        return (
            <View style={styles.container}>
                <TournamentDetail id={id} />
                <TournamentsFooter />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TournamentsList />
            <TournamentsFooter />
        </View>
    );
}

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        footer: {
            flexDirection: 'row',
            backgroundColor: darkMode === 'dark' ? '#24355c' : '#31519c',
            padding: 10,
            alignItems: 'center',
            gap: 8,
            justifyContent: 'center',
        },
        footerText: {
            color: 'white',
        },
        footerImage: {
            height: 20,
            aspectRatio: 1.5,
        },
    })
);

import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { RouteProp, useLinkTo, useRoute } from '@react-navigation/native';
import { fetchMatches } from '../api/matches';
import Profile from './profile';
import Rating from './rating';
import { useApi } from '../hooks/use-api';
import { loadRatingHistories } from '../service/rating';
import { loadProfile } from '../service/profile';
import { Game } from './components/game';
import SearchPage from './search.page';
import { loadSettingsFromStorage } from '../service/storage';


export default function SplashPage() {
    // const me = useApi(() => loadSettingsFromStorage());
    // const {settings, setSettings} = Settings.useContainer()
    // const linkTo = useLinkTo();
    // const [linked, setLinked] = useState(false);
    //
    // console.log("==> SPLASH PAGE me.loading =", me.loading, ', data =', me.data != null);
    // console.log("==> SPLASH PAGE settings =", settings != null);
    //
    // if (!me.loading) {
    //     setSettings(me.data);
    //     // console.log("=> SPLASH PAGE linkTo main already =", linked);
    //     if (!linked) {
    //         setLinked(true);
    //         linkTo('/main');
    //     }
    // }

    return (
            <Text>Splash Page</Text>
    );
}

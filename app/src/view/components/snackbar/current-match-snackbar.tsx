import * as React from 'react';
import {useState} from 'react';
import {Platform, StyleSheet, View, ViewStyle} from 'react-native';
import Snackbar from "../snackbar";
import {useMutate, useSelector} from "../../../redux/reducer";
import {RootStackParamList} from "../../../../App2";
import {getRootNavigation} from "../../../service/navigation";

export default function CurrentMatchSnackbar() {
    const mutate = useMutate();

    const match = useSelector(state => state.ingame?.match);
    const [visible, setVisible] = useState(true);

    const nav = async (route: keyof RootStackParamList, params?: any) => {
        const navigation = getRootNavigation();
        navigation.reset({
            index: 0,
            routes: [{name: route, params}]
        });
    };

    const view = () => {
        nav('Match', { match_id: match.match_id });
    };

    const close = () => {
        setVisible(false);
    };

    // useEffect(() => {
    //     mutate(setIngame(fakeMatch as any, fakeMatch.players.find(p => p.profile_id === moProfileId) as any));
    //     nav('Unit', { unit: 'ScoutCavalry' });
    // }, []);

    if (!match) return <View/>;

    // const message = `${getMapName(match.map_type as any, match.ugc, match.rms, match.game_type, match.scenario)} (${match.started ? formatAgo(match.started) : ''})`;
    const message = `Some Match`;
    const actions = [
        {
            label: 'View',
            onPress: view,
        },
        {
            label: 'X',
            onPress: close,
        },
    ];

    return (
        <Snackbar
            style={styles.bar}
            visible={visible}
            onDismiss={close}
            actions={actions}
            // working={updateState === 'downloading'}
        >
            {message}
        </Snackbar>
    );
}

const styles = StyleSheet.create({
    bar: {
        ...(Platform.OS === 'web' ? {"-webkit-app-region": "no-drag"} : {}),
    } as ViewStyle,
});






export const fakeMatch = {
    "match_id": "75281781",
    "lobby_id": null,
    "match_uuid": "e6136674-c8ee-934d-96da-9d480b323730",
    "version": "45340",
    "name": "AUTOMATCH",
    "num_players": 4,
    "num_slots": 4,
    "average_rating": null,
    "cheats": false,
    "full_tech_tree": false,
    "ending_age": 5,
    "expansion": null,
    "game_type": 0,
    "has_custom_content": null,
    "has_password": true,
    "lock_speed": true,
    "lock_teams": true,
    "map_size": 2,
    "map_type": 9,
    "pop": 200,
    "ranked": true,
    "leaderboard_id": 4,
    "rating_type": 4,
    "resources": 1,
    "rms": null,
    "scenario": null    ,
    "server": "ukwest",
    "shared_exploration": false,
    "speed": 2,
    "starting_age": 2,
    "team_together": true,
    "team_positions": true,
    "treaty_length": 0,
    "turbo": false,
    "victory": 1,
    "victory_time": 0,
    "visibility": 0,
    "opened": new Date(2021, 2, 7, 11, 39, 31),
    "started": new Date(2021, 2, 7, 11, 39, 31),
    "finished": undefined,
    "players": [{
        "profile_id": 223576,
        "steam_id": "76561198001031686",
        "name": "Sihing Mo",
        "clan": null,
        "country": "DE",
        "slot": 1,
        "slot_type": 1,
        "rating": 2170,
        "rating_change": null,
        "games": null,
        "wins": null,
        "streak": null,
        "drops": null,
        "color": 4,
        "team": 1,
        "civ": 21,
        "won": false
    }, {
        "profile_id": 3002139,
        "steam_id": "76561198035499360",
        "name": "Snrasha",
        "clan": null,
        "country": "FR",
        "slot": 2,
        "slot_type": 1,
        "rating": 1930,
        "rating_change": null,
        "games": null,
        "wins": null,
        "streak": null,
        "drops": null,
        "color": 1,
        "team": 2,
        "civ": 7,
        "won": true
    }, {
        "profile_id": 3146184,
        "steam_id": "76561199076516224",
        "name": "Zweistein",
        "clan": null,
        "country": "DE",
        "slot": 3,
        "slot_type": 1,
        "rating": 1424,
        "rating_change": null,
        "games": null,
        "wins": null,
        "streak": null,
        "drops": null,
        "color": 2,
        "team": 1,
        "civ": 24,
        "won": false
    }, {
        "profile_id": 1627622,
        "steam_id": "76561199010335674",
        "name": "boblitodoubrazil",
        "clan": null,
        "country": "FR",
        "slot": 4,
        "slot_type": 1,
        "rating": 1751,
        "rating_change": null,
        "games": null,
        "wins": null,
        "streak": null,
        "drops": null,
        "color": 3,
        "team": 2,
        "civ": 10,
        "won": true
    }],
    "source": "aoe2net"
};

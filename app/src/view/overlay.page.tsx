import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {MyText} from "./components/my-text";
import {createStylesheet} from '../theming-new';
import {Game} from "./components/game";
import {useLazyApi} from "../hooks/use-lazy-api";
import {twitchLive} from "../api/following";
import {getTwitchChannel, moProfileId} from "@nex/data";
import {fetchLastMatch} from "../api/lastmatch";
import { BorderText } from './components/border-text';

const defaultMatch = JSON.parse('{"match_id":"72704893","lobby_id":null,"match_uuid":"347e6009-d6f5-884f-ab05-42ae220e84f1","version":"45340","name":"AUTOMATCH","num_players":8,"num_slots":8,"average_rating":null,"cheats":false,"full_tech_tree":false,"ending_age":5,"expansion":null,"game_type":0,"has_custom_content":null,"has_password":true,"lock_speed":true,"lock_teams":true,"map_size":4,"map_type":33,"pop":200,"ranked":true,"leaderboard_id":4,"rating_type":4,"resources":1,"rms":null,"scenario":null,"server":"ukwest","shared_exploration":false,"speed":2,"starting_age":2,"team_together":true,"team_positions":true,"treaty_length":0,"turbo":false,"victory":1,"victory_time":0,"visibility":0,"opened":"2021-02-23T12:25:04.000Z","started":"2021-02-23T12:25:04.000Z","finished":"2021-02-23T12:46:57.000Z","players":[{"profile_id":209525,"steam_id":"76561197995781128","name":"aoe2companion.com","clan":null,"country":null,"slot":1,"slot_type":1,"rating":2187,"rating_change":null,"games":null,"wins":null,"streak":null,"drops":null,"color":6,"team":1,"civ":11,"won":false},{"profile_id":5061049,"steam_id":"76561199140652291","name":"PlayingOpenMaps","clan":null,"country":null,"slot":2,"slot_type":1,"rating":2016,"rating_change":null,"games":null,"wins":null,"streak":null,"drops":null,"color":3,"team":2,"civ":31,"won":true},{"profile_id":223576,"steam_id":"76561198001031686","name":"Sihing Mo","clan":null,"country":null,"slot":3,"slot_type":1,"rating":2186,"rating_change":null,"games":null,"wins":null,"streak":null,"drops":null,"color":8,"team":1,"civ":2,"won":false},{"profile_id":909332,"steam_id":"76561198077883114","name":"TheXnore","clan":null,"country":null,"slot":4,"slot_type":1,"rating":2216,"rating_change":null,"games":null,"wins":null,"streak":null,"drops":null,"color":5,"team":2,"civ":35,"won":true},{"profile_id":1867920,"steam_id":"76561198008263520","name":"Doni","clan":null,"country":null,"slot":5,"slot_type":1,"rating":2091,"rating_change":null,"games":null,"wins":null,"streak":null,"drops":null,"color":2,"team":1,"civ":11,"won":false},{"profile_id":907050,"steam_id":"76561198960399602","name":"Gothic_Paladin","clan":null,"country":null,"slot":6,"slot_type":1,"rating":2225,"rating_change":null,"games":null,"wins":null,"streak":null,"drops":null,"color":1,"team":2,"civ":11,"won":true},{"profile_id":2531706,"steam_id":"76561198971846248","name":"Juan22","clan":null,"country":null,"slot":7,"slot_type":1,"rating":2136,"rating_change":null,"games":null,"wins":null,"streak":null,"drops":null,"color":4,"team":1,"civ":36,"won":false},{"profile_id":4695892,"steam_id":"76561199075612228","name":"Vip go","clan":null,"country":null,"slot":8,"slot_type":1,"rating":2140,"rating_change":null,"games":null,"wins":null,"streak":null,"drops":null,"color":7,"team":2,"civ":2,"won":true}]}');

export default function OverlayPage() {
    const styles = useStyles();

    const match = useLazyApi(
        {},
        fetchLastMatch, 'aoe2de', moProfileId
    );

    useEffect(() => {
        match.reload();
    }, []);

    // const match = {
    //     data: defaultMatch,
    // };

    if (!match.data) {
        return <MyText>Loading...</MyText>;
    }

    // console.log(JSON.stringify(match.data));
    // console.log(JSON.parse(JSON.stringify(match.data)));

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>

            <View style={styles.titleWrapper}>
                <BorderText style={styles.title}>AoE II Companion</BorderText>
            </View>

            <Game
                expanded={true}
                match={match.data}
            />
            </View>
        </View>
    );
}

// <MyText style={{
//     position: 'absolute',
//     color: getPlayerBackgroundColor(chatEntry.player_number!),
//     textShadowColor: '#000',
//     textShadowOffset: {width: offset, height: 0},
//     textShadowRadius: 0.3,
// }}>{data.players[chatEntry.player_number!-1].name}: {chatEntry.message}</MyText>

const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        minHeight: '100%',
        alignItems: 'center',
        padding: 20,
    },
    wrapper: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingLeft: 12,
        paddingRight: 10,
        // padding: 0,
        // margin: 0,
        borderRadius: 10,
        overflow: 'hidden',
        width: '100%',


        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 20,
    },
    titleWrapper: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'center',
    },
}));

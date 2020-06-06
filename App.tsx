import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { YellowBox } from 'react-native';
import { format, startOfDay } from 'date-fns';
import { de } from 'date-fns/locale'
var fromUnixTime = require('date-fns/fromUnixTime');

YellowBox.ignoreWarnings(['Remote debugger']);

const civList = [
    require('./assets/civilizations/aztecs.png'),
    require('./assets/civilizations/berber.png'),
    require('./assets/civilizations/britons.png'),
    require('./assets/civilizations/bulgarians.png'),
    require('./assets/civilizations/burmese.png'),
    require('./assets/civilizations/byzantines.png'),
    require('./assets/civilizations/celts.png'),
    require('./assets/civilizations/chinese.png'),
    require('./assets/civilizations/cumans.png'),
    require('./assets/civilizations/ethiopians.png'),
    require('./assets/civilizations/franks.png'),
    require('./assets/civilizations/goths.png'),
    require('./assets/civilizations/huns.png'),
    require('./assets/civilizations/inca.png'),
    require('./assets/civilizations/indians.png'),
    require('./assets/civilizations/italians.png'),
    require('./assets/civilizations/japanese.png'),
    require('./assets/civilizations/khmer.png'),
    require('./assets/civilizations/koreans.png'),
    require('./assets/civilizations/lithuanians.png'),
    require('./assets/civilizations/magyars.png'),
    require('./assets/civilizations/malay.png'),
    require('./assets/civilizations/malians.png'),
    require('./assets/civilizations/mayans.png'),
    require('./assets/civilizations/mongols.png'),
    require('./assets/civilizations/persians.png'),
    require('./assets/civilizations/portuguese.png'),
    require('./assets/civilizations/saracens.png'),
    require('./assets/civilizations/slavs.png'),
    require('./assets/civilizations/spanish.png'),
    require('./assets/civilizations/tatars.png'),
    require('./assets/civilizations/teutons.png'),
    require('./assets/civilizations/turks.png'),
    require('./assets/civilizations/vietnamese.png'),
    require('./assets/civilizations/vikings.png'),
];

interface IPlayer {
    civ: number;
    clan: string;
    color: number;
    country: string;
    drops: number;
    games: number;
    name: string;
    profile_id: number;
    rating: number;
    rating_change: any;
    slot: number;
    slot_type: number;
    steam_id: string;
    streak: any;
    team: number;
    wins: any;
    won: any;
}

interface ILastMatchRaw {
    average_rating: any;
    cheats: boolean;
    ending_age: number;
    expansion: any;
    finished: number;
    full_tech_tree: boolean;
    game_type: any;
    has_custom_content: any;
    has_password: boolean;
    leaderboard_id: number;
    lobby_id: any;
    lock_speed: boolean;
    lock_teams: boolean;
    map_size: number;
    map_type: number;
    match_id: string;
    match_uuid: string;
    name: string;
    num_players: number;
    num_slots: number;
    opened: any;
    players: IPlayer[];
    pop: number;
    ranked: boolean;
    rating_type: any;
    resources: any;
    rms: any;
    scenario: any;
    server: string;
    shared_exploration: boolean;
    speed: number;
    started: any;
    starting_age: number;
    team_positions: boolean;
    team_together: boolean;
    treaty_length: any;
    turbo: boolean;
    version: string;
    victory: any;
    victory_time: any;
    visibility: any;
}

interface ILastMatch extends ILastMatchRaw {
    started: Date;
}

interface IPlayerProps {
    player: IPlayer;
}

interface IGameProps {
    data: ILastMatch;
}

const playerColors = [
    '#405BFF',
    '#FF0000',
    '#00FF00',
    '#FFFF00',
    '#00FFFF',
    '#FF57B3',
    '#797979',
    '#FF9600',
];

function getPlayerBackgroundColor(color: number) {
    return playerColors[color - 1];
}

function getCivIcon(civ: number) {
    return civList[civ];
}

export function Player({player}: IPlayerProps) {

    const boxStyle = StyleSheet.flatten([styles.square, {backgroundColor: getPlayerBackgroundColor(player.color)}]);

    return (
            <View style={styles.player}>

                <View style={boxStyle}>
                    <Text>{player.color}</Text>
                </View>


                <Image style={styles.civIcon} source={getCivIcon(player.civ)}/>

                <Text>{player.rating} {player.name}</Text>

            </View>
    );
}

export function Game({data}: IGameProps) {

    const playersInTeam1 = data.players.filter(p => p.team == 1);
    const playersInTeam2 = data.players.filter(p => p.team == 2);

    return (
            <View>

                <Text>Team-Zufallskarte</Text>
                <Text>Arena - 24553459</Text>

                <Text>{data.name}</Text>

                {
                    playersInTeam1.map((v, i) =>
                            <Player key={playersInTeam1[i].profile_id} player={playersInTeam1[i]}/>
                    )
                }

                <View style={styles.versus}>
                    <Text style={styles.versusText}>VS</Text>
                </View>

                {
                    playersInTeam2.map((v, i) =>
                            <Player key={playersInTeam2[i].profile_id} player={playersInTeam2[i]}/>
                    )
                }

            </View>
    );
}

function processGameJson(json: ILastMatchRaw): ILastMatch {
    const converted = {
        ...json,
        started: fromUnixTime(json.started),
        // started: new Date(json.started),
    };
    console.log("started", converted.started);
    console.log("started", format(converted.started, 'MMMM Do', {locale: de}));
    return converted;
}

export default function App() {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState(null as unknown as ILastMatch);

    const game = 'aoe2de';
    const steam_id = '76561197995781128';
    const profile_id = '209525';

    const loadData = async () => {
        // const response = await fetch(`https://aoe2.net/api/player/lastmatch?game=${game}&steam_id=${steam_id}`)
        const response = await fetch(`https://aoe2.net/api/player/lastmatch?game=${game}&profile_id=${profile_id}`)
        // console.log("response", response);
        const json = await response.json();
        console.log("response.json()", json);
        setData(processGameJson(json.last_match));
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
            <View style={styles.container}>
                <Text>AoE II Companion</Text>
                <Text/>
                <Text>Current game:</Text>

                {
                    data &&
                    <Game data={data}/>
                }

                {/*{isLoading ? <ActivityIndicator/>:(*/}
                {/*        <FlatList*/}
                {/*                data={data}*/}
                {/*                keyExtractor={({id}, index) => id}*/}
                {/*                renderItem={({item}: { item: any }) => (*/}
                {/*                        <Text>{item}</Text>*/}
                {/*                        // <Text>{item.title}, {item.releaseYear}</Text>*/}
                {/*                )}*/}
                {/*        />*/}
                {/*)}*/}


            </View>
    );
}

const styles = StyleSheet.create({
    square: {
        flexGrow: 0,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'red',
        flexDirection: 'row',
        marginRight: 3
    },
    civIcon: {
      width: 20,
      height: 20,
    },
    player: {
        flexDirection: 'row',
        padding: 3
    },
    versus: {
        borderRadius: 10000,
        backgroundColor: 'grey',
        color: 'white',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    versusText: {
        color: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

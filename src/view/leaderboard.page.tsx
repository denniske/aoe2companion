import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator, Dimensions, Image, ImageProps, StyleSheet, Text, TextProps, TouchableHighlight, View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fetchLeaderboard} from "../api/leaderboard";
import {userIdFromBase} from "../helper/user";
import {getFlagIcon} from "../helper/flags";
import {useCavy} from "cavy";
import {ILeaderboardPlayer} from "../helper/data";
import {RootStackProp} from "../../App";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {useLazyApi} from "../hooks/use-lazy-api";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {TabBarLabel} from "./main.page";
import {getString} from "../helper/strings";
import {IconButton} from "react-native-paper";

const Tab = createMaterialTopTabNavigator();

export default function LeaderboardPage() {
    return (
        <Tab.Navigator swipeEnabled={false} lazy={true}>
            <Tab.Screen name="MainHome" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="RM 1v1"/>}}>
                {() => <Leaderboard leaderboardId={3} />}
            </Tab.Screen>
            <Tab.Screen name="MainMatches" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="RM Team"/>}}>
                {() => <Leaderboard leaderboardId={4} />}
            </Tab.Screen>
            <Tab.Screen name="MainMatches2" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="DM 1v1"/>}}>
                {() => <Leaderboard leaderboardId={1} />}
            </Tab.Screen>
            <Tab.Screen name="MainMatches3" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="DM Team"/>}}>
                {() => <Leaderboard leaderboardId={2} />}
            </Tab.Screen>
            <Tab.Screen name="MainMatches4" options={{tabBarLabel: (x) => <TabBarLabel {...x} title="Unr."/>}}>
                {() => <Leaderboard leaderboardId={0} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

function ImageLoader(props: ImageProps) {
    if (props.source == null) {
        return (
            <View {...props} style={[props.style, { height: 'auto', flexDirection: 'row', backgroundColor: 'white', display: 'flex'}]}>
                <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flexDirection: 'row'}]}>
                    <Text style={{color: '#ECE9ED'}} numberOfLines={1}>....................................</Text>
                </View>
            </View>
        );
    }
    return (
        <Image {...props}/>
    )
}


type TextLoaderProps = TextProps & { children?: React.ReactNode }

function TextLoader(props: TextLoaderProps) {
    // console.log("text loader", props);
    const { children, ...rest } = props;
    // console.log('rest', rest);

    // flex: 1.5, padding: 8,

    if (props.children == null) {
        return (
            <View {...rest} style={[rest.style, { flexDirection: 'row', backgroundColor: 'white', display: 'flex'}]}>
                <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flexDirection: 'row'}]}>
                    <Text style={{color: '#ECE9ED'}} numberOfLines={1}>....................................</Text>
                </View>
            </View>
        );
        // return (
        //     <View {...rest}>
        //         <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flex: 1}]}/>
        //     </View>
        // );
        // return (
        //     <View style={{flexDirection: 'row', backgroundColor: 'red', width: '100%'}}>
        //   <Text {...rest}>nulfsdfl</Text>
        //     </View>
        // );
        // return (
        //   <Text {...rest}>null</Text>
        // );
    }
    return (
        <Text {...props}/>
    )
}


const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export function Leaderboard({leaderboardId} : any) {
    const generateTestHook = useCavy();
    const navigation = useNavigation<RootStackProp>();
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(Math.floor((window.height - 250) / 40));//12);

    console.log('window', window);
    console.log('screen', screen);

    const players = useLazyApi(
        // [],
        // state => state.leaderboard[leaderboardId],
        // (state, value) => {
        //     if (state.leaderboard[leaderboardId] == null) {
        //         state.leaderboard[leaderboardId] = [] as any;
        //     }
        //     state.leaderboard[leaderboardId] = value;
        // },
        fetchLeaderboard, 'aoe2de', leaderboardId, {start: page, count: perPage}
    );

    useEffect(() => {
        // if (perPage === 12) return;
        players.refetch('aoe2de', leaderboardId, {start: page * perPage, count: perPage});
    }, [page, perPage]);

    const onSelect = async (player: ILeaderboardPlayer) => {
        console.log('naivigate', {
            id: userIdFromBase(player),
            name: player.name,
        });
        navigation.push('User', {
            id: userIdFromBase(player),
            name: player.name,
        });
    };

    const previousPage = async () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const nextPage = async () => {
        setPage(page + 1);
    };

    const measureView = (event: any) => {
        // if (perPage !== 12) return;
        // console.log(event.nativeEvent.layout.height);
        // console.log(Math.floor(event.nativeEvent.layout.height / 40));
        // const height = event.nativeEvent.layout.height;
        // // setPerPage(Math.floor(height / 40));
        // setPerPage(Math.floor(height / 38));
    };

    const count = players.data?.leaderboard.length;
    const total = players.data?.total;
    const from = page * perPage + 1;
    const to = from + count - 1;
    const canPrevious = page > 0;
    const canNext = to < total;

    const list = [...(players.data?.leaderboard || Array(perPage).fill(null))];
    // const list = [...(players.data?.leaderboard) || [], ...Array(2).fill(null)];

    console.log("list", list);

    // const list = [...(players.data?.leaderboard || Array(0).fill(null))];

    const _renderRow = (player: any, i: number) => {
        // if (player == null) {
        //     return (
        //         <View style={styles.innerRow}>
        //             <Text style={styles.cellRating} numberOfLines={1}>{player.rating}</Text>
        //             <View style={styles.cellName}>
        //                 <Image style={styles.countryIcon} source={getFlagIcon(player.country)}/>
        //                 <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
        //             </View>
        //             <Text style={styles.cellGames}>{player.games}</Text>
        //             {/*<Text style={styles.cellWins}>{player.wins}</Text>*/}
        //         </View>
        //     );
        // }

        // composeUserId(player)

        return (
            <TouchableHighlight style={styles.row} key={i}
                                onPress={() => onSelect(player)} underlayColor="white">
                <View style={styles.innerRow}>


                    {/*<ContentLoader animate={false} style={{backgroundColor: 'white', paddingVertical: 2, width: '100%', height: '100%'}}>*/}
                    {/*    <Rect x="0" y="0" rx="3" ry="3" width="100%" height="100%"/>*/}
                    {/*</ContentLoader>*/}

                    {/*viewBox="0 0 100 26"*/}
                    {/*<View style={[styles.cellRank, {backgroundColor: 'white', height: 40}]}>*/}
                    {/*    <ContentLoader animate={false} style={{backgroundColor: 'white', paddingVertical: 2, width: '100%', height: '100%'}}>*/}
                    {/*        <Rect x="0" y="0" rx="3" ry="3" width="100%" height="100%"/>*/}
                    {/*    </ContentLoader>*/}
                    {/*</View>*/}


                    {/*<Text style={styles.cellRank} numberOfLines={1}>#{player?.rank}</Text>*/}


                    {/*<View style={[styles.cellRank, {backgroundColor: 'white'}]}>*/}
                    {/*    <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flex: 1}]}/>*/}
                    {/*</View>*/}

                    {/*<View style={[styles.cellRating, {backgroundColor: 'white'}]}>*/}
                    {/*    <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flex: 1}]}/>*/}
                    {/*</View>*/}
                    {/*<View style={[styles.cellName2, {backgroundColor: 'white'}]}>*/}
                    {/*    <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flex: 1}]}/>*/}
                    {/*</View>*/}

                    {/*<View style={[styles.cellGames, {backgroundColor: 'white'}]}>*/}
                    {/*    <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flex: 1}]}/>*/}
                    {/*</View>*/}

                    {/*<Text style={styles.cellRating} numberOfLines={1}>{player.rating}</Text>*/}


                    <TextLoader style={styles.cellRank}>{player?.rank}</TextLoader>
                    <TextLoader style={styles.cellRating}>{player?.rating}</TextLoader>
                    <View style={styles.cellName}>
                        <ImageLoader style={styles.countryIcon} source={getFlagIcon(player?.country)}/>
                        <TextLoader style={styles.name} numberOfLines={1}>{player?.name}</TextLoader>
                    </View>
                    <TextLoader style={styles.cellGames}>{player?.games}</TextLoader>

                    {/*{*/}
                    {/*    (player == null || player?.games < 500) &&*/}
                    {/*    <TextLoader style={styles.cellGames}></TextLoader>*/}
                    {/*}*/}
                    {/*{*/}
                    {/*    player?.games >= 500 &&*/}
                    {/*    <TextLoader style={styles.cellGames}>{player?.games}</TextLoader>*/}
                    {/*}*/}


                </View>
            </TouchableHighlight>
        );
        // return (
        //     <TouchableHighlight style={styles.row} key={composeUserId(player)}
        //                         onPress={() => onSelect(player)} underlayColor="white"
        //                         ref={generateTestHook('Leaderboard.Player.' + composeUserId(player))}>
        //         <View style={styles.innerRow}>
        //             <Text style={styles.cellRank} numberOfLines={1}>{player.rank}</Text>
        //             <Text style={styles.cellRating} numberOfLines={1}>{player.rating}</Text>
        //             <View style={styles.cellName}>
        //                 <Image style={styles.countryIcon} source={getFlagIcon(player.country)}/>
        //                 <Text style={styles.name} numberOfLines={1}>{player.name}</Text>
        //             </View>
        //             <Text style={styles.cellGames}>{player.games}</Text>
        //             {/*<Text style={styles.cellWins}>{player.wins}</Text>*/}
        //         </View>
        //     </TouchableHighlight>
        // );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{getString('leaderboard', leaderboardId)}</Text>

            <View style={styles.headerRow}>
                <Text style={styles.cellRank} numberOfLines={1}>Rank</Text>
                <Text style={styles.cellRating} numberOfLines={1}>Rating</Text>
                <Text style={styles.cellName} numberOfLines={1}>Name</Text>
                <Text style={styles.cellGames} numberOfLines={1}>Games</Text>
                {/*<Text style={styles.cellWins} numberOfLines={1}>Wins</Text>*/}
            </View>

            <View style={styles.measureContainer} onLayout={measureView}>
                {
                    list.map((player, i) => _renderRow(player, i))
                }
            </View>

            <View style={styles.footerRow}>
                {
                    players.touched &&
                    <View style={styles.activityInfo}>
                        {
                            players.loading &&
                            <ActivityIndicator animating size="small"/>
                        }
                    </View>
                }

                {
                    players.touched &&
                    <Text style={styles.pageInfo}>{isNaN(to) ? null : `${from}-${to} of ${total}`}</Text>
                }

                <IconButton
                    style={styles.arrowIcon}
                    icon={({ size, color }) => (<Icon name="chevron-left" color={color} size={size}/>)}
                    color={canPrevious ? 'black' : 'grey'}
                    disabled={!canPrevious}
                    onPress={previousPage}
                />
                <IconButton
                    icon={({ size, color }) => (<Icon name="chevron-right" color={color} size={size}/>)}
                    color={canNext ? 'black' : 'grey'}
                    disabled={!canNext}
                    onPress={nextPage}
                />

                {/*<TouchableFeedback style={styles.arrowIcon} onPress={previousPage} disabled={!canPrevious} underlayColor="white">*/}
                {/*    <Icon name={'chevron-left'} color={canPrevious ? 'black' : 'grey'} size={24}/>*/}
                {/*</TouchableFeedback>*/}
                {/*<TouchableFeedback style={styles.arrowIcon} onPress={nextPage} disabled={!canNext} underlayColor="white">*/}
                {/*    <Icon name={'chevron-right'} color={canNext ? 'black' : 'grey'} size={24}/>*/}
                {/*</TouchableFeedback>*/}
            </View>
        </View>
    );
}

const padding = 8;

const styles = StyleSheet.create({
    measureContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'visible',
        // backgroundColor: 'yellow',
        padding: 5,
        width: '100%',
    },
    activityInfo: {
        flex: 1,
        alignItems: 'flex-end'
    },
    pageInfo: {
        flex: 0,
        textAlign: 'right',
        marginLeft: 15,
    },
    arrowIcon: {
        marginLeft: 25,
        // backgroundColor: 'red',
    },
    name: {
        flex: 1,
    },
    cellRank: {
        padding: padding,
        textAlign: 'left',
        flex: 1,
        // marginRight: 20,
        // backgroundColor: 'red',
    },
    cellRating: {
        padding: padding,
        flex: 1.5,
    },
    cellName: {
        padding: padding,
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cellName2: {
        padding: padding,
        flex: 4,
    },
    cellGames: {
        padding: padding,
        flex: 1.5,
        // marginLeft: 5,
    },
    cellWins: {
        padding: padding,
        flex: 1,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 3,
        // padding: 3,
        // paddingVertical: 5,
        padding: 5,
        borderRadius: 5,
        marginRight: 30,
        marginLeft: 30,
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        padding: 3,
        borderRadius: 5,
        marginRight: 30,
        marginLeft: 30,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    row: {
        // marginRight: 30,
        // marginLeft: 30,
        // width: '100%',
        // flex: 3,
        flex: 1,
        backgroundColor: 'white',
    },
    innerRow: {
        flex: 1,
        // height: 40,
        // alignItems: "center",
        // backgroundColor: 'blue',
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    countryIcon: {
        width: 21,
        height: 15,
        // paddingBottom: 4,
        marginRight: 5,
    },
    title: {
        marginBottom: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 20,
        paddingTop: 18,
    },
});

import {ITheme, makeVariants, useTheme} from "../../theming";
import {FlatList, StyleSheet, View} from "react-native";
import {setPrefValue, useMutate, useSelector} from "../../redux/reducer";
import {LeaderboardId} from "../../helper/leaderboards";
import React, {useState} from "react";
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootTabParamList} from "../../../App";
import {capitalize, get} from "lodash-es";
import {usePrevious} from "../../hooks/use-previous";
import {saveCurrentPrefsToStorage} from "../../service/storage";
import {MyText} from "../components/my-text";
import StatsPosition from "../components/stats-position";
import StatsCiv from "../components/stats-civ";
import StatsMap from "../components/stats-map";
import StatsPlayer from "../components/stats-player";
import ButtonPicker from "../components/button-picker";
import TemplatePicker from "../components/template-picker";


export default function MainStats() {
    const styles = useTheme(variants);
    const mutate = useMutate();
    const prefLeaderboardId = useSelector(state => state.prefs.leaderboardId) ?? LeaderboardId.RM1v1;
    const [leaderboardId, setLeaderboardId] = useState(prefLeaderboardId);

    const route = useRoute<RouteProp<RootTabParamList, 'MainProfile'>>();
    const { user } = route.params;

    const currentCachedData = useSelector(state => get(state.statsPlayer, [user.id, leaderboardId]));
    const previousCachedData = usePrevious(currentCachedData);
    const loadingMatchesOrStats = useSelector(state => state.loadingMatchesOrStats);

    const cachedData = currentCachedData ?? previousCachedData;

    console.log('MainStats cachedData', cachedData);
    console.log('MainStats loadingMatchesOrStats', loadingMatchesOrStats);

    let statsPosition = cachedData?.statsPosition;
    let statsPlayer = cachedData?.statsPlayer;
    let statsCiv = cachedData?.statsCiv;
    let statsMap = cachedData?.statsMap;

    const hasStats = cachedData != null;
    const hasMatchesOrStats = hasStats;

    const list = ['stats-header', 'stats-position', 'stats-player', 'stats-civ', 'stats-map'];

    const onLeaderboardSelected = async (leaderboardId: LeaderboardId) => {
        mutate(setPrefValue('leaderboardId', leaderboardId));
        await saveCurrentPrefsToStorage();
        setLeaderboardId(leaderboardId);
    };

    // const values: string[] = [
    //     'Unranked',
    //     'RM 1v1',
    //     'RM Team',
    //     'DM 1v1',
    //     'DM Team',
    // ];

    // const values: string[] = [
    //     'UNR',
    //     'RM',
    //     'RMT',
    //     'DM',
    //     'DMT',
    // ];

    const values: number[] = [
        3,
        4,
        1,
        2,
        0,
    ];
    const ratingHistoryDuration = values[leaderboardId];

    const nav = async (str: any) => {
        mutate(setPrefValue('ratingHistoryDuration', str));
        await saveCurrentPrefsToStorage();
    };

    const valueMapping: any = {
        0: {
            title: 'UNR',
            subtitle: 'Unranked',
        },
        3: {
            title: 'RM',
            subtitle: '1v1',
        },
        4: {
            title: 'RM',
            subtitle: 'Team',
        },
        1: {
            title: 'DM',
            subtitle: '1v1',
        },
        2: {
            title: 'DM',
            subtitle: 'Team',
        },
    };

    const renderLeaderboard = (value: LeaderboardId, selected: boolean) => {
        return <View style={styles.col}>
            <MyText style={[styles.h1, { fontWeight: selected ? 'bold' : 'normal'}]}>{valueMapping[value].title}</MyText>
            <MyText style={[styles.h2, { fontWeight: selected ? 'bold' : 'normal'}]}>{valueMapping[value].subtitle}</MyText>
        </View>;
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <FlatList
                    contentContainerStyle={styles.list}
                    data={list}
                    renderItem={({item, index}) => {
                        switch (item) {
                            case 'stats-header':
                                return <View>

                                    <View style={styles.pickerRow}>
                                        <TemplatePicker value={leaderboardId} values={values} template={renderLeaderboard} onSelect={onLeaderboardSelected}/>
                                        {/*<View style={styles.col}>*/}
                                        {/*    <MyText style={styles.h1}>RM</MyText>*/}
                                        {/*    <MyText style={styles.h2}>1v1</MyText>*/}
                                        {/*</View>*/}
                                        {/*<View style={styles.col}>*/}
                                        {/*    <MyText style={styles.h1}>RM</MyText>*/}
                                        {/*    <MyText style={styles.h2}>Team</MyText>*/}
                                        {/*</View>*/}
                                        {/*<View style={styles.col}>*/}
                                        {/*    <MyText style={styles.h1}>DM</MyText>*/}
                                        {/*    <MyText style={styles.h2}>1v1</MyText>*/}
                                        {/*</View>*/}
                                        {/*<View style={styles.col}>*/}
                                        {/*    <MyText style={styles.h1}>DM</MyText>*/}
                                        {/*    <MyText style={styles.h2}>Team</MyText>*/}
                                        {/*</View>*/}
                                        {/*<View style={styles.col}>*/}
                                        {/*    <MyText style={styles.h1}>UNR</MyText>*/}
                                        {/*    <MyText style={styles.h2}>Unranked</MyText>*/}
                                        {/*</View>*/}
                                    </View>

                                    {/*<FontAwesome5Icon style={styles.menuIcon2} name="user" solid={true} size={16}/>*/}
                                    {/*<FontAwesome5Icon style={styles.menuIcon2} name="user-plus" solid={true} size={16}/>*/}

                                    {/*<View style={styles.pickerRow}>*/}
                                    {/*    <ActivityIndicator animating={loadingMatchesOrStats} size="small"/>*/}
                                    {/*    <ButtonPicker value={ratingHistoryDuration} values={values} onSelect={nav}/>*/}
                                    {/*    /!*<Picker style={styles.picker} disabled={loadingMatchesOrStats} value={leaderboardId} values={leaderboardList} formatter={formatLeaderboardId} onSelect={onLeaderboardSelected}/>*!/*/}
                                    {/*</View>*/}

                                    {
                                        hasStats && statsPlayer?.matchCount != 0 &&
                                        <MyText style={styles.info}>The last {statsPlayer?.matchCount} matches:</MyText>
                                    }
                                </View>;
                            case 'stats-position':
                                if (!hasMatchesOrStats) return <View/>;
                                return <StatsPosition data={statsPosition} user={user} leaderboardId={leaderboardId}/>;
                            case 'stats-civ':
                                if (!hasMatchesOrStats) return <View/>;
                                return <StatsCiv data={statsCiv} user={user}/>;
                            case 'stats-map':
                                if (!hasMatchesOrStats) return <View/>;
                                return <StatsMap data={statsMap} user={user}/>;
                            case 'stats-player':
                                if (!hasMatchesOrStats) return <View/>;
                                return <StatsPlayer data={statsPlayer} user={user} leaderboardId={leaderboardId}/>;
                            default:
                                return <View/>;
                        }
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
}


const getStyles = (theme: ITheme) => {
    return StyleSheet.create({
        info: {
            // textAlign: 'center',
            marginBottom: 10,
            marginLeft: 5,
            // color: theme.textNoteColor,
            // fontSize: 12,
        },

        col: {
            // width: 54,
            // height: 50,
            paddingHorizontal: 7,
            alignItems: 'center',
        },
        h1: {
            // color: 'white',
        },
        h2: {
            // color: 'white',
            fontSize: 11,
        },

        pickerRow: {
            // backgroundColor: 'yellow',
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            paddingRight: 20,
            marginBottom: 20,
            // marginTop: 20,
        },
        sectionHeader: {
            marginVertical: 25,
            fontSize: 15,
            fontWeight: '500',
            textAlign: 'center',
        },
        list: {
            padding: 20,
        },
        container: {
            flex: 1,
            // backgroundColor: '#B89579',
        },
        content: {
            flex: 1,
        },
    });
};

const variants = makeVariants(getStyles);


const b3 = 0;

// import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import React, {useEffect, useState} from 'react';
// import {IMatch} from "@nex/data/api";
// import {TextLoader} from "./loader/text-loader";
// import {orderBy, uniqBy} from 'lodash';
// import {useNavigation} from "@react-navigation/native";
// import {RootStackProp} from "../../../App";
// import {MyText} from "./my-text";
// import {makeVariants, useAppTheme, usePaperTheme, useTheme} from "../../theming";
// import {LeaderboardId} from "@nex/data";
// import {useLazyApi} from "../../hooks/use-lazy-api";
// import { sleep } from '@nex/data';
// import {IRow} from "../../service/stats/stats-player";
// import {Button} from "react-native-paper";
// import Space from "./space";
// import {createStylesheet} from '../../theming-new';
// import {getTranslation} from '../../helper/translate';
// import {CountryImage} from './country-image';
//
// interface IRowProps {
//     data: IRow;
// }
//
// function Row({data}: IRowProps) {
//     const styles = useStyles();
//     const navigation = useNavigation<RootStackProp>();
//
//     const gotoPlayer = () => {
//         navigation.push('User', {
//             id: userIdFromBase(data.player),
//             name: data.player.name,
//         });
//     };
//
//     return (
//             <View style={styles.row}>
//                 <TouchableOpacity style={styles.cellLeaderboard} onPress={gotoPlayer}>
//                     <View style={styles.row}>
//                         <CountryImage country={data.player.country} />
//                         <MyText>{data.player.name}</MyText>
//                     </View>
//                 </TouchableOpacity>
//                 <MyText style={styles.cellGames}>
//                     {data.games}
//                 </MyText>
//                 <MyText style={styles.cellWon}>
//                     {isNaN(data.won) ? '-' : data.won.toFixed(0) + ' %'}
//                 </MyText>
//             </View>
//     )
// }
//
//
// interface IProps {
//     user: UserIdBase;
//     leaderboardId: LeaderboardId;
//     data: IData;
// }
//
// interface IData {
//     rowsAlly: IRow[] | null;
//     rowsOpponent: IRow[] | null;
//     matches?: IMatch[] | null;
//     user: UserIdBase;
//     leaderboardId: LeaderboardId;
// }
//
//
// export default function StatsPlayer(props: IProps) {
//     const styles = useStyles();
//     const [maxRowCountAlly, setMaxRowCountAlly] = useState(12);
//     const [maxRowCountOpponent, setMaxRowCountOpponent] = useState(12);
//     const theme = useAppTheme();
//
//     const { data, user } = props;
//     let { rowsAlly, rowsOpponent, matches, leaderboardId } = data || { leaderboardId: props.leaderboardId };
//
//     const hasAlly = [LeaderboardId.EWTeam, LeaderboardId.RMTeam, LeaderboardId.Unranked].includes(leaderboardId);
//
//     if (rowsOpponent?.length === 0) {
//         return <View/>;
//     }
//
//     const rowsAllyLength = rowsAlly?.length;
//     const rowsOpponentLength = rowsOpponent?.length;
//
//     if (rowsAlly) {
//         rowsAlly = rowsAlly?.filter((r, i) => i < maxRowCountAlly);
//     }
//     if (rowsOpponent) {
//         rowsOpponent = rowsOpponent?.filter((r, i) => i < maxRowCountOpponent);
//     }
//
//     return (
//             <View style={styles.container}>
//                 <View>
//                     {
//                         hasAlly &&
//                         <View style={styles.row}>
//                             <MyText numberOfLines={1} style={styles.cellLeaderboard}>{getTranslation('main.stats.heading.ally')}</MyText>
//                             <MyText numberOfLines={1} style={styles.cellGames}>{getTranslation('main.stats.heading.games')}</MyText>
//                             <MyText numberOfLines={1} style={styles.cellWon}>{getTranslation('main.stats.heading.won')}*</MyText>
//                         </View>
//                     }
//
//                     {
//                         hasAlly && rowsAlly && rowsAlly.map(leaderboard =>
//                                 <Row key={composeUserId(leaderboard.player)} data={leaderboard}/>
//                         )
//                     }
//
//                     {
//                         hasAlly && !rowsAlly && Array(8).fill(0).map((a, i) =>
//                             <View key={i} style={styles.row}>
//                                 <TextLoader style={styles.cellLeaderboard}/>
//                                 <TextLoader style={styles.cellGames}/>
//                                 <TextLoader style={styles.cellWon}/>
//                             </View>
//                         )
//                     }
//
//                     {
//                         rowsAllyLength != null && rowsAllyLength > maxRowCountAlly &&
//                         <Button
//                             labelStyle={{fontSize: 13, marginVertical: 6}}
//                             style={{marginTop: 6, marginHorizontal: 5}}
//                             onPress={() => setMaxRowCountAlly(maxRowCountAlly + 20)}
//                             mode="outlined"
//                             compact
//                             uppercase={false}
//                             dark={true}
//                         >
//                             {getTranslation('main.stats.showmore')}
//                         </Button>
//                     }
//
//                     {
//                         hasAlly &&
//                         <Space/>
//                     }
//
//                     <View style={styles.row}>
//                         <MyText numberOfLines={1} style={styles.cellLeaderboard}>{getTranslation('main.stats.heading.opponent')}</MyText>
//                         <MyText numberOfLines={1} style={styles.cellGames}>{getTranslation('main.stats.heading.games')}</MyText>
//                         <MyText numberOfLines={1} style={styles.cellWon}>{getTranslation('main.stats.heading.won')}*</MyText>
//                     </View>
//
//                     {
//                         rowsOpponent && rowsOpponent.map(leaderboard =>
//                                 <Row key={composeUserId(leaderboard.player)} data={leaderboard}/>
//                         )
//                     }
//
//                     {
//                         !rowsOpponent && Array(8).fill(0).map((a, i) =>
//                             <View key={i} style={styles.row}>
//                                 <TextLoader style={styles.cellLeaderboard}/>
//                                 <TextLoader style={styles.cellGames}/>
//                                 <TextLoader style={styles.cellWon}/>
//                             </View>
//                         )
//                     }
//
//                     {
//                         rowsOpponentLength != null && rowsOpponentLength > maxRowCountOpponent &&
//                         <Button
//                             labelStyle={{fontSize: 13, marginVertical: 6}}
//                             style={{marginTop: 6, marginHorizontal: 5}}
//                             onPress={() => setMaxRowCountOpponent(maxRowCountOpponent + 20)}
//                             mode="outlined"
//                             compact
//                             uppercase={false}
//                             dark={true}
//                         >
//                             {getTranslation('main.stats.showmore')}
//                         </Button>
//                     }
//
//                 </View>
//             </View>
//     )
// }
//
//
// const padding = 5;
//
// const useStyles = createStylesheet(theme => StyleSheet.create({
//     info: {
//         textAlign: 'center',
//         marginBottom: 10,
//         color: theme.textNoteColor,
//         fontSize: 12,
//     },
//     cellLeaderboard: {
//         // backgroundColor: 'red',
//         margin: padding,
//         flex: 4,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     cellGames: {
//         margin: padding,
//         flex: 1,
//         textAlign: 'right',
//         fontVariant: ['tabular-nums'],
//     },
//     cellWon: {
//         margin: padding,
//         flex: 1,
//         textAlign: 'right',
//         fontVariant: ['tabular-nums'],
//     },
//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     container: {
//         // backgroundColor: 'red',
//     },
//     countryIcon: {
//         width: 21,
//         height: 15,
//         marginRight: 5,
//     },
// }));


export const gg = 1;

// import React from 'react';
// import {Dimensions, StyleSheet, TextStyle, View} from 'react-native';
// import {Image} from 'expo-image';
// import {civList, getCivNameById, getMatchTeams} from '@nex/data';
// import {getSlotTypeName, IMatch, IPlayer} from '@nex/data/api';
// import {MyText} from "./my-text";
// import {createStylesheet} from '../../theming-new';
// import {getPlayerBackgroundColorBright} from '../../helper/colors';
// import {getUnitIconColored} from '../../helper/units-colored';
//
//
// interface IPlayerProps {
//     match: IMatch;
//     player: IPlayer;
//     highlight?: boolean;
//     order: number;
// }
//
// export function PlayerIntro({match, player, highlight, order}: IPlayerProps) {
//     const styles = useStyles();
//
//     // const leaderboard = useLazyApi(
//     //     {},
//     //     fetchLeaderboard, 'aoe2de', match.leaderboard_id, { profile_id: player.profile_id, count: 1 }
//     // );
//     // useEffect(() => {
//     //     leaderboard.reload();
//     // }, []);
//     // console.log('player', player);
//
//     const teams = getMatchTeams(match);
//     const fullWidth = Dimensions.get('window').width;
//     const availableWidth = fullWidth - 40 - (teams.length-1)*20;
//     const width = Math.max(0, Math.min(240, availableWidth / teams.length));
//
//     const newCivStyle = [styles.newCiv, {backgroundColor: getPlayerBackgroundColorBright(player.color)}];
//     const boxStyle = [styles.square, {backgroundColor: getPlayerBackgroundColorBright(player.color)}];
//     const playerNameStyle = [{ fontSize: 18, fontWeight: 'bold', color: 'white', textDecorationLine: highlight ? 'underline' : 'none'}] as TextStyle;
//     const containerStyle = [{ borderColor: getPlayerBackgroundColorBright(player.color), width }];
//
//     const winRate = (player.wins / player.games * 100).toFixed(0);
//     const rating = player.rating;
//     const wins = player.wins;
//     const defeats = player.games-player.wins;
//
//     // const leaderboardInfo = leaderboard.data?.leaderboard?.[0];
//     // const rating = leaderboardInfo ? leaderboardInfo.rating : ' ';
//     // const winRate = leaderboardInfo ? (leaderboardInfo.wins / leaderboardInfo.games * 100).toFixed(0) : ' ';
//     // const wins = leaderboardInfo ? leaderboardInfo.wins : ' ';
//     // const defeats = leaderboardInfo ? leaderboardInfo.games-leaderboardInfo.wins : ' ';
//
//     return (
//         <View style={[styles.player, containerStyle]}>
//             {
//                 order == 0 &&
//                 <View style={styles.newCivCol}>
//                     <View style={newCivStyle}>
//                         <MyText style={styles.newCivText}>{getCivNameById(civList[player.civ].name)}</MyText>
//                     </View>
//                 </View>
//             }
//             {
//                 order == 0 &&
//                 <View style={styles.squareCol}>
//                     <View style={boxStyle}>
//                         <MyText style={styles.squareText}>{player.color}</MyText>
//                     </View>
//                 </View>
//             }
//             {
//                 order == 0 &&
//                 <Image fadeDuration={0} style={[styles.unitIcon, { transform: [{rotateY: '180deg'}] }]} source={getUnitIconColored(civList[player.civ].uniqueUnits[0], player.color) as any}/>
//             }
//             {
//                 order == 0 &&
//                 <View style={styles.spacerLeft}/>
//             }
//             <View style={styles.data}>
//                 <MyText style={styles.playerNameCol} numberOfLines={1}>
//                     {player.slot_type != 1 ? getSlotTypeName(player.slot_type) : player.name}
//                 </MyText>
//
//                 <MyText style={styles.playerNameCol}>{player.slot_type != 1 ? ' ' : rating}</MyText>
//
//                 {
//                     player.slot_type === 1 &&
//                     <MyText style={styles.playerNameCol}>{winRate}% - {wins}W {defeats}L</MyText>
//                 }
//                 {
//                     player.slot_type !== 1 &&
//                     <MyText style={styles.playerNameCol}> </MyText>
//                 }
//
//                 {/*<BorderText style={styles.playerNameCol}>R | {player.rating}</BorderText>*/}
//                 {/*<BorderText style={styles.playerNameCol}>{winRate.toFixed(0)}% | {player.wins}W {player.games-player.wins}L</BorderText>*/}
//             </View>
//             {
//                 order == 1 &&
//                 <View style={styles.spacerRight}/>
//             }
//             {
//                 order == 1 &&
//                 <Image fadeDuration={0} style={[styles.unitIcon, { right: 0 }]} source={getUnitIconColored(civList[player.civ].uniqueUnits[0], player.color) as any}/>
//             }
//             {
//                 order == 1 &&
//                 <View style={[styles.squareCol, { right: 0 }]}>
//                     <View style={boxStyle}>
//                         <MyText style={styles.squareText}>{player.color}</MyText>
//                     </View>
//                 </View>
//             }
//             {
//                 order == 1 &&
//                 <View style={[styles.newCivCol, { right: 0 }]}>
//                     <View style={newCivStyle}>
//                         <MyText style={styles.newCivText}>{getCivNameById(civList[player.civ].name)}</MyText>
//                     </View>
//                 </View>
//             }
//         </View>
//     );
// }
//
// const useStyles = createStylesheet(theme => StyleSheet.create({
//     verifiedIcon: {
//         marginLeft: 5,
//         color: theme.linkColor,
//     },
//     skullIcon: {
//         marginLeft: 2,
//     },
//     squareText: {
//         color: '#333',
//         fontSize: 14,
//         fontWeight: 'bold',
//         paddingBottom: 2,
//         paddingRight: 1,
//     },
//     newCivText: {
//         color: '#333',
//         fontSize: 10,
//         fontWeight: 'bold',
//         paddingBottom: 2,
//         paddingRight: 1,
//     },
//     newCivCol: {
//         position: "absolute",
//         zIndex: 100,
//         bottom: 0,
//         // width: 20,
//         // flex: 1,
//         height: '100%',
//         // backgroundColor: 'yellow',
//         justifyContent: 'flex-end',
//         alignItems: 'flex-end',
//     },
//     newCiv: {
//         flexGrow: 0,
//         paddingHorizontal: 4,
//         // width: 20,
//         // height: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//         alignSelf: 'flex-start',
//         // borderWidth: 1,
//         // borderColor: '#333',
//         backgroundColor: 'red',
//         flexDirection: 'row',
//     },
//     squareCol: {
//         position: "absolute",
//         zIndex: 100,
//         width: 20,
//         flex: 1,
//         height: '100%',
//         // backgroundColor: 'yellow',
//         justifyContent: 'flex-start',
//         alignItems: 'flex-start',
//     },
//     square: {
//         flexGrow: 0,
//         width: 20,
//         // height: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//         alignSelf: 'flex-start',
//         // borderWidth: 1,
//         // borderColor: '#333',
//         backgroundColor: 'red',
//         flexDirection: 'row',
//     },
//     playerWonCol: {
//         opacity: 0,
//         marginLeft: 3,
//         width: 22,
//     },
//     playerRecCol: {
//         opacity: 0,
//         marginLeft: 4,
//         width: 16,
//     },
//     playerRatingCol: {
//         marginLeft: 7,
//         width: 48,
//         letterSpacing: -0.5,
//         fontVariant: ['tabular-nums'],
//         fontWeight: 'bold',
//     },
//     playerCol: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginLeft: 2,
//         flex: 1,
//         paddingVertical: 3,
//     },
//     civCol: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginLeft: 5,
//         paddingVertical: 3,
//         fontWeight: 'bold',
//         width: 120,
//     },
//     playerNameCol: {
//         paddingHorizontal: 3,
//         marginLeft: 5,
//         flex: 1,
//         paddingVertical: 1,
//         fontWeight: 'bold',
//         fontFamily: 'Roboto',
//         color: '#DDD',
//         // backgroundColor: 'blue',
//     },
//     playerNameColBirthday: {
//         marginLeft: 5,
//         flex: 0,
//     },
//     row: {
//         marginLeft: 5,
//         flexDirection: 'row',
//         alignItems: 'center',
//         // width: 180,
//         flex: 1,
//         // backgroundColor: 'blue',
//     },
//     unitIcon: {
//         position: 'absolute',
//         // zIndex: 10,
//         // marginRight: 30,
//         width: 65,
//         height: 65,
//         alignSelf: 'flex-end',
//     },
//     countryIcon: {
//         width: 24,
//         height: 24,
//         marginRight: 4,
//     },
//     player: {
//         // position: 'relative',
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#444',
//         borderWidth: 3,
//         borderColor: '#000',
//         marginHorizontal: 10,
//         marginVertical: 2,
//         // minWidth: 180,
//     },
//     spacerLeft: {
//         width: 65,
//     },
//     spacerRight: {
//         width: 30,
//     },
//     data: {
//         flexDirection: 'column',
//         alignItems: 'flex-start',
//         // backgroundColor: 'yellow',
//         padding: 10,
//         flex: 1,
//     },
//     centeredView: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: 'rgba(0,0,0,0.5)',
//     },
//     modalView: {
//         margin: 0,
//         backgroundColor: "white",
//         borderRadius: 5,
//         padding: 15,
//         alignItems: "center",
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5
//     },
//     modalText: {
//         paddingVertical: 3,
//         marginBottom: 15,
//         textAlign: "center",
//         color: 'black',
//     },
//     modalHeader: {
//         flexDirection: 'row',
//         // backgroundColor: 'yellow'
//     },
//     modalCloseIcon: {
//         position: 'absolute',
//         right: 15,
//         top: 15,
//     }
// }));

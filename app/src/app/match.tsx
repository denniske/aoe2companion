
export const zz = 0;

// import React from 'react';
// import {useNavigation} from '@react-navigation/native';
// import {RootStackProp} from '../../App2';
// import {Game} from "./components/game";
// import {StyleSheet, View} from "react-native";
// import {createStylesheet} from "../theming-new";
// import {civs, IPlayerNew} from "@nex/data";
// import {orderBy} from "lodash";
// import {useSelector} from "../redux/reducer";
// import {MyText} from "./components/my-text";
// import {CivCompBig} from "./civ.page";
//
//
// export default function MatchPage() {
//     const styles = useStyles();
//     const navigation = useNavigation<RootStackProp>();
//
//     const match = useSelector(state => state.ingame?.match);
//     const player = useSelector(state => state.ingame?.player);
//     const auth = useSelector(state => state.auth);
//     const following = useSelector(state => state.following);
//
//     if (!match) {
//         return (
//             <View style={styles.container}>
//                 <MyText>No match.</MyText>
//             </View>
//         );
//     }
//
//     const filterAndSortPlayers = (players: IPlayer[]) => {
//         let filteredPlayers = players.filter(p =>
//             following.filter(f => p.profileId === f.profileId).length > 0 || p.profileId === auth?.profileId);
//         filteredPlayers = orderBy(filteredPlayers, p => p.profileId === auth?.profileId);
//         return filteredPlayers;
//     };
//
//     const filteredPlayers = filterAndSortPlayers(match.players as any);
//     return (
//         <View style={styles.container}>
//             <Game match={match} expanded={true} highlightedUsers={filteredPlayers}/>
//             <MyText style={styles.heading}>Your Civ</MyText>
//             <CivCompBig civ={civs[player.civ]}/>
//         </View>
//     );
// }
//
//
// const useStyles = createStylesheet(theme => StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     heading: {
//         marginVertical: 10,
//         lineHeight: 20,
//         fontWeight: 'bold',
//     },
//
// }));

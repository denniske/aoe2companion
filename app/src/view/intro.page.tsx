
export const zz = 0;

// import React, {useEffect, useRef} from 'react';
// import {Animated, StyleSheet, View} from 'react-native';
// import {MyText} from "./components/my-text";
// import {createStylesheet} from '../theming-new';
// import {useLazyApi} from "../hooks/use-lazy-api";
// import {fetchMatchWithFallback} from "@nex/data";
// import {GameIntro} from "./components/game-intro";
// import {RouteProp, useRoute} from "@react-navigation/native";
// import {RootStackParamList} from "../../App2";
// import {closeOverlayWindow, isElectron} from "../helper/electron";
// import {useSelector} from "../redux/reducer";
//
//
// export default function IntroPage() {
//     const styles = useStyles();
//
//     const route = useRoute<RouteProp<RootStackParamList, 'Intro'>>();
//     const match_id = route.params?.match_id;
//
//     const overlayConfig = useSelector(state => state.config.overlay);
//
//     const match = useLazyApi(
//         {},
//         fetchMatchWithFallback, 'aoe2de', { match_id }
//     );
//
//     useEffect(() => {
//         match.reload();
//     }, []);
//
//     const fadeAnim = useRef(new Animated.Value(0)).current;
//     const positionAnim = useRef(new Animated.Value(0)).current;
//
//     const fadeTime = 2000;
//     const showTime = overlayConfig.duration * 1000;
//
//     useEffect(() => {
//         Animated.timing(
//             fadeAnim,
//             {
//                 toValue: 1,
//                 duration: fadeTime,
//                 useNativeDriver: true,
//             }
//         ).start();
//         Animated.timing(
//             positionAnim,
//             {
//                 toValue: 1,
//                 duration: fadeTime,
//                 useNativeDriver: true,
//             }
//         ).start();
//
//         if (!isElectron()) return;
//
//         setTimeout(() => {
//             Animated.timing(
//                 fadeAnim,
//                 {
//                     toValue: 0,
//                     duration: fadeTime,
//                     useNativeDriver: true,
//                 }
//             ).start();
//             setTimeout(closeOverlayWindow, fadeTime);
//         }, showTime);
//     }, [fadeAnim]);
//
//     const fadeInOpacity = {
//         opacity: fadeAnim.interpolate({
//             inputRange: [0, 1],
//             outputRange: [0, overlayConfig.opacity/100],
//         }),
//     };
//
//     const fadeInTransform = {
//         transform: [
//             {
//                 translateY: positionAnim.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [40, 0],
//                 }),
//             },
//         ]
//     };
//
//     if (!match.data) {
//         return <MyText/>;
//         // return <MyText>Loading...</MyText>;
//     }
//
//     // console.log(JSON.stringify(match.data));
//     // console.log(JSON.parse(JSON.stringify(match.data)));
//
//     return (
//         <View style={styles.container}>
//             <Animated.View style={[
//                 styles.wrapper,
//                 fadeInTransform,
//                 fadeInOpacity,
//                 { top: overlayConfig.offset + '%' },
//             ]}>
//                 {/*<View style={styles.titleWrapper}>*/}
//                 {/*    <BorderText style={styles.title}>AoE II Companion</BorderText>*/}
//                 {/*</View>*/}
//                 <GameIntro match={match.data}/>
//             </Animated.View>
//         </View>
//     );
// }
//
// const useStyles = createStylesheet(theme => StyleSheet.create({
//     container: {
//         width: '100%',
//         height: '100%',
//         alignItems: 'center',
//         position: 'relative',
//         // backgroundColor: 'rgba(255,255,0,0.1)',
//     },
//     wrapper: {
//         position: "absolute",
//         overflow: 'hidden',
//         width: '100%',
//         // backgroundColor: 'red',
//     },
//     // title: {
//     //     fontSize: 18,
//     //     fontWeight: '700',
//     //     marginTop: 20,
//     //     marginBottom: 20,
//     // },
//     // titleWrapper: {
//     //     // backgroundColor: 'yellow',
//     //     flexDirection: 'row',
//     //     justifyContent: 'center',
//     // },
// }));

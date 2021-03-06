import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {MyText} from "./components/my-text";
import {createStylesheet} from '../theming-new';
import {useLazyApi} from "../hooks/use-lazy-api";
import {fetchMatchWithFallback} from "@nex/data";
import {GameIntro} from "./components/game-intro";
import {RouteProp, useRoute} from "@react-navigation/native";
import {RootStackParamList} from "../../App";
import {closeOverlayWindow, isElectron} from "../helper/electron";


export default function IntroPage() {
    const styles = useStyles();

    const route = useRoute<RouteProp<RootStackParamList, 'Intro'>>();
    const match_id = route.params?.match_id;

    const match = useLazyApi(
        {},
        fetchMatchWithFallback, 'aoe2de', { match_id }
    );

    useEffect(() => {
        match.reload();
    }, []);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const positionAnim = useRef(new Animated.Value(0)).current;

    const fadeTime = 2000;
    const showTime = 60000;

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: fadeTime,
                useNativeDriver: true,
            }
        ).start();
        Animated.timing(
            positionAnim,
            {
                toValue: 1,
                duration: fadeTime,
                useNativeDriver: true,
            }
        ).start();

        if (!isElectron()) return;

        setTimeout(() => {
            Animated.timing(
                fadeAnim,
                {
                    toValue: 0,
                    duration: fadeTime,
                    useNativeDriver: true,
                }
            ).start();
            Animated.timing(
                positionAnim,
                {
                    toValue: 2,
                    duration: fadeTime,
                    useNativeDriver: true,
                }
            ).start();
            setTimeout(closeOverlayWindow, fadeTime);
        }, showTime);
    }, [fadeAnim]);

    const position = {
        transform: [
            {
                translateY: positionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                }),
            },
        ]
    };

    if (!match.data) {
        return <MyText/>;
        // return <MyText>Loading...</MyText>;
    }

    // console.log(JSON.stringify(match.data));
    // console.log(JSON.parse(JSON.stringify(match.data)));

    return (
        <Animated.View
            style={[styles.container, {
                opacity: fadeAnim,
                ...position,
            }]}
        >
            <View style={styles.wrapper}>

            {/*<View style={styles.titleWrapper}>*/}
            {/*    <BorderText style={styles.title}>AoE II Companion</BorderText>*/}
            {/*</View>*/}

            <GameIntro
                match={match.data}
            />
            </View>
        </Animated.View>
    );
}

const useStyles = createStylesheet(theme => StyleSheet.create({
    container: {
        minHeight: '100%',
        alignItems: 'center',
        paddingTop: 100,
    },
    wrapper: {
        // backgroundColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden',
        width: '100%',
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

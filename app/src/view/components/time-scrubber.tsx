import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    cancelAnimation,
    runOnJS,
    Easing,
} from 'react-native-reanimated';
import {
    GestureDetector,
    Gesture,
} from 'react-native-gesture-handler';

const DURATION = 10000; // 10 seconds
const BAR_WIDTH = 300;

interface Props {
    time: Animated.SharedValue<number>;
}

export default function TimeScrubber({time} : Props) {
    const [isPlaying, setIsPlaying] = useState(false);

    const progress = useSharedValue(0);

    const play = () => {
        setIsPlaying(true);
        const remaining = DURATION - time.value;
        time.value = withTiming(DURATION, { duration: remaining, easing: Easing.linear }, () => {
            runOnJS(setIsPlaying)(false);
        });
    };

    const pause = () => {
        setIsPlaying(false);
        cancelAnimation(time);
    };

    const togglePlay = () => {
        isPlaying ? pause() : play();
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            cancelAnimation(time);
        })
        .onUpdate((e) => {
            // console.log('translationX', e.translationX);
            console.log('x', e.x);
            // console.log('absoluteX', e.absoluteX);
            // console.log('velocityX', e.velocityX);

            time.value = Math.max(0, Math.min(DURATION, e.x / BAR_WIDTH * DURATION));

            // let newX = Math.max(0, Math.min(BAR_WIDTH, e.translationX + progress.value));
            // time.value = (newX / BAR_WIDTH) * DURATION;
        })
        .onEnd(() => {
            progress.value = (time.value / DURATION) * BAR_WIDTH;
        });

    // Progress bar animation based on time
    const progressStyle = useAnimatedStyle(() => {
        const width = (time.value / DURATION) * BAR_WIDTH;
        progress.value = width;
        return {
            width,
        };
    });

    const handleStyle = useAnimatedStyle(() => {
        return {
            left: progress.value - 10,
        };
    });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
                <View style={styles.barContainer}>
                    <View style={styles.track} />
                    <Animated.View style={[styles.progress, progressStyle]} />
                    <Animated.View style={[styles.handle, handleStyle]} />
                </View>
            </GestureDetector>

            <Pressable style={styles.button} onPress={togglePlay}>
                <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        alignItems: 'center',
    },
    barContainer: {
        width: BAR_WIDTH,
        height: 30,
        justifyContent: 'center',
        backgroundColor: 'yellow',
    },
    track: {
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
    },
    progress: {
        position: 'absolute',
        height: 4,
        backgroundColor: 'dodgerblue',
        borderRadius: 2,
    },
    handle: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'blue',
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
});

import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, TextInput } from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    cancelAnimation,
    runOnJS,
    Easing, useAnimatedProps, SharedValue,
} from 'react-native-reanimated';
import {
    GestureDetector,
    Gesture,
} from 'react-native-gesture-handler';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const DURATION = 30 * 60 * 1000; // 30min

interface Props {
    time: SharedValue<number>;
}

export default function TimeScrubber({time} : Props) {
    const [isPlaying, setIsPlaying] = useState(false);

    const barWidth = useSharedValue(0);
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
            time.value = Math.max(0, Math.min(DURATION, e.x / barWidth.value * DURATION));
        })
        .onEnd(() => {
            progress.value = (time.value / DURATION) * barWidth.value;
        });

    const progressStyle = useAnimatedStyle(() => {
        const width = (time.value / DURATION) * barWidth.value;
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

    const animatedProps = useAnimatedProps(() => {
        const formatTime = (milliseconds: number) => {
            const seconds = Math.floor((milliseconds / 1000) % 60);
            const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
            const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }
        return {
            text: `${formatTime(time.value)} / ${formatTime(DURATION)}`, // this won't work with Text, only TextInput's "value"
        };
    });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
                <View style={styles.barContainer}
                      onLayout={(event) => {
                          barWidth.value = event.nativeEvent.layout.width;
                      }}
                >
                    <View style={styles.track} />
                    <Animated.View style={[styles.progress, progressStyle]} />
                    <Animated.View style={[styles.handle, handleStyle]} />
                </View>
            </GestureDetector>

            <View className="flex-row gap-2 items-center">
                <Pressable style={styles.button} onPress={togglePlay}>
                    <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
                </Pressable>
                <AnimatedTextInput
                    editable={false}
                    animatedProps={animatedProps as any}
                    style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'black',
                        top: 8,
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: 'yellow',
    },
    barContainer: {
        flex: 1,
        height: 30,
        justifyContent: 'center',
        backgroundColor: 'red',
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

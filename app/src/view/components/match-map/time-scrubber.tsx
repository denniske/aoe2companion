import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, TextInput, TouchableOpacity } from 'react-native';
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
import { FontAwesome5 } from '@expo/vector-icons';
import { useAppTheme } from '@app/theming';
import { formatTimeFromMs } from '@app/view/components/match-map/match-map';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// const DURATION = 30 * 60 * 1000; // 30min

interface Props {
    time: SharedValue<number>;
    duration: number;
}

export default function TimeScrubber({time, duration} : Props) {
    const theme = useAppTheme();

    const [isPlaying, setIsPlaying] = useState(false);

    const barWidth = useSharedValue(0);
    const progress = useSharedValue(0);

    const play = () => {
        setIsPlaying(true);
        const remaining = duration - time.value;
        time.value = withTiming(duration, { duration: remaining/30, easing: Easing.linear }, () => {
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
        .onStart((e) => {
            cancelAnimation(time);
        })
        .onUpdate((e) => {
            time.value = Math.max(0, Math.min(duration, (e.x - 12) / barWidth.value * duration));
        })
        .onEnd(() => {
            // progress.value = (time.value / duration) * barWidth.value;
        });

    const progressStyle = useAnimatedStyle(() => {
        const width = (time.value / duration) * barWidth.value;
        progress.value = width;
        return {
            width: progress.value,
        };
    });

    const handleStyle = useAnimatedStyle(() => {
        return {
            left: progress.value - 10 + 12, // 10 is half the handle width, 12 is padding of the bar container
        };
    });

    const animatedProps = useAnimatedProps(() => {
        return {
            text: `${formatTimeFromMs(time.value)} / ${formatTimeFromMs(duration)}`, // this won't work with Text, only TextInput's "value"
        };
    });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
                <View style={styles.barContainer} className="px-3"
                      onLayout={(event) => {
                          barWidth.value = event.nativeEvent.layout.width - 12*2; // 12 is padding of the bar container
                      }}
                >
                    <View style={styles.track} />
                    <Animated.View style={[styles.progress, progressStyle]} />
                    <Animated.View style={[styles.handle, handleStyle]} />
                </View>
            </GestureDetector>

            <View className="flex-row gap-2 items-center border-0 border-gray-700">
                {/*<Pressable style={styles.button} onPress={togglePlay}>*/}
                {/*    <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>*/}
                {/*</Pressable>*/}
                <TouchableOpacity className="py-5 px-3" onPress={togglePlay}>
                    <FontAwesome5 name={isPlaying ? 'pause' : 'play'} size={14} color={theme.textNoteColor} />
                </TouchableOpacity>
                <AnimatedTextInput
                    editable={false}
                    animatedProps={animatedProps as any}
                    style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: theme.textNoteColor,
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        // backgroundColor: 'yellow',
    },
    barContainer: {
        height: 30,
        justifyContent: 'center',
        // backgroundColor: 'red',
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
        left: 12, // padding of the bar container need to be applied here too
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

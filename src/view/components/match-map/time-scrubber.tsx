import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, TextInput, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
    cancelAnimation,
    Easing, useAnimatedProps, SharedValue,
} from 'react-native-reanimated';
import {
    GestureDetector,
    Gesture,
} from 'react-native-gesture-handler';
import { useAppTheme } from '@app/theming';
import { Icon } from '@app/components/icon';
import { faPause, faPlay } from '@fortawesome/sharp-solid-svg-icons';
import {scheduleOnRN} from "react-native-worklets";
import { formatTimeFromMs } from '@app/view/components/match-map/map-util';

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

    const play = () => {
        setIsPlaying(true);
        const remaining = duration - time.get();
        time.set(
            withTiming(duration, { duration: remaining / 30, easing: Easing.linear }, () => {
                scheduleOnRN(setIsPlaying, false);
            })
        );
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
            time.set(Math.max(0, Math.min(duration, ((e.x - 12) / barWidth.get()) * duration)));
        })
        .onEnd(() => {});

    // `progress` used to be written from inside progressStyle and read back in
    // handleStyle. Writing a shared value from a style worklet is a side effect in
    // what should be a pure derivation, so both styles now derive the same width
    // directly. `progress` is gone; behaviour is identical because handleStyle only
    // ever saw the value progressStyle had just computed.
    const progressStyle = useAnimatedStyle(() => {
        return {
            width: (time.get() / duration) * barWidth.get(),
        };
    });

    const handleStyle = useAnimatedStyle(() => {
        // 10 is half the handle width, 12 is padding of the bar container
        return {
            left: (time.get() / duration) * barWidth.get() - 10 + 12,
        };
    });

    const animatedProps = useAnimatedProps(() => {
        return {
            text: `${formatTimeFromMs(time.get())} / ${formatTimeFromMs(duration)}`, // this won't work with Text, only TextInput's "value"
        };
    });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
                <View style={styles.barContainer} className="px-3"
                      onLayout={(event) => {
                          // 12 is padding of the bar container
                          barWidth.set(event.nativeEvent.layout.width - 12 * 2);
                      }}
                >
                    <View style={styles.track} />
                    <Animated.View style={[styles.progress, progressStyle]} />
                    <Animated.View style={[styles.handle, handleStyle]} />
                </View>
            </GestureDetector>

            <View className="flex-row gap-2 items-center border-0 border-gray-700">
                <TouchableOpacity className="py-5 px-3" onPress={togglePlay}>
                    <Icon icon={isPlaying ? faPause : faPlay} size={14} />
                </TouchableOpacity>
                <AnimatedTextInput
                    editable={false}
                    animatedProps={animatedProps as any}
                    style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: theme.textNoteColor,
                        flex: 1,
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

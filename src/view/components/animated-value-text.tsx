// import Animated, {SharedValue, useAnimatedProps} from 'react-native-reanimated';
// import {TextInput} from "react-native";
//
// const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
//
// export function AnimatedValueText({ value, style, formatter }: {
//     value: SharedValue<string>,
//     style?: any,
//     formatter?: (n: number) => string
// }) {
//     const animatedProps = useAnimatedProps(() => {
//         return {
//             text: `#${value.value}`,
//             defaultValue: `#${value.value}`,
//         };
//     });
//
//     return (
//         <AnimatedTextInput
//             animatedProps={animatedProps}
//             style={style}
//             editable={false}
//         />
//     );
// }

import React, { useState } from 'react';
import { Text } from 'react-native';
import { SharedValue, useAnimatedReaction } from 'react-native-reanimated';
import {scheduleOnRN} from "react-native-worklets";

export function AnimatedValueText({
                                      value,
                                      style,
                                  }: {
    value: SharedValue<string>;
    style?: any;
}) {
    // Starts empty rather than seeded with `value.value`: reading a shared value
    // during render is what Reanimated's strict mode warns about, and it warned
    // every time this mounted. useAnimatedReaction runs once on mount with
    // oldValue === null, so the first real value arrives immediately anyway.
    const [display, setDisplay] = useState('');

    // React to changes in the shared value
    useAnimatedReaction(
        () => value.value,
        (newValue, oldValue) => {
            if (newValue !== oldValue) {
                scheduleOnRN(setDisplay, newValue);
            }
        },
        []
    );

    return <Text style={style}>{display}</Text>;
}
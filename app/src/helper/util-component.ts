import {Animated, Dimensions, Platform} from "react-native";

export function getValue(animatedValue: Animated.AnimatedValue) {
    // @ts-ignore
    return animatedValue._value;
}

import {Animated} from "react-native";
import {useAnimatedLatestValueRef} from "../../hooks/use-animated-latest-value";
import {MyText} from "./my-text";
import React from "react";

export function AnimatedValueText({value, style, formatter} : {value: Animated.Value, style: any, formatter: any}) {
    const latestValue = useAnimatedLatestValueRef(value).latestValue;
    return <MyText style={style}>#{formatter(latestValue)}</MyText>;
}

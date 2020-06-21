import React from "react"
import { Platform } from "react-native"
import { TouchableNativeFeedback, TouchableOpacity } from "react-native"

export const TouchableFeedback = (props: any) => {
    const { children, ...rest } = props;
    return Platform.OS === 'android'
        ? <TouchableNativeFeedback {...rest}>{children}</TouchableNativeFeedback>
        : <TouchableOpacity {...rest}>{children}</TouchableOpacity>
}

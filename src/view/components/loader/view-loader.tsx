import {Text, TextProps, View} from "react-native";
import React from "react";

type TextLoaderProps = TextProps & { children?: React.ReactNode, ready?: any }

export function ViewLoader(props: TextLoaderProps) {
    // console.log("text loader", props);
    const { children, ...rest } = props;

    if (props.children == null || ('ready' in props && !props.ready)) {
        return (
            <View {...rest} style={[rest.style, { flexDirection: 'row', display: 'flex'}]}>
                <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flexDirection: 'row'}]}>
                    <View style={{opacity: 0}}>{children}</View>
                </View>
            </View>
        );
    }
    return (
        <View>{children}</View>
    )
}

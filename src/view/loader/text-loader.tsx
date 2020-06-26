import {StyleProp, Text, TextProps, TextStyle, View} from "react-native";
import React from "react";

type TextLoaderProps = TextProps & { children?: React.ReactNode, ready?: any, textStyle?: StyleProp<TextStyle> }

export function TextLoader(props: TextLoaderProps) {
    // console.log("text loader", props);
    const { children, ...rest } = props;
    // console.log('rest', rest);

    if (props.children == null || ('ready' in props && !props.ready)) {
        return (
            <View {...rest} style={[rest.style, { flexDirection: 'row', display: 'flex' }]}>
                <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flexDirection: 'row', flex: 1}]}>
                    <Text numberOfLines={1} style={[{color: '#ECE9ED'}]}>....................................</Text>
                </View>
            </View>
        );
    }
    return (
        <Text {...props}/>
    )
}

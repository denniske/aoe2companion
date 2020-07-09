import {StyleProp, Text, TextProps, TextStyle, View} from "react-native";
import React from "react";
import {MyText} from "../my-text";

type TextLoaderProps = TextProps & {
    children?: React.ReactNode,
    ready?: any,
    textStyle?: StyleProp<TextStyle>,
    width?: number,
}

export function TextLoader(props: TextLoaderProps) {
    // console.log("text loader", props);
    const { children, ...rest } = props;
    // console.log('rest', rest);

    const hostStyle: any = { flexDirection: 'row', display: 'flex' };
    if ('width' in props) {
        hostStyle.width = props.width;
    }

    if (props.children == null || ('ready' in props && !props.ready)) {
        return (
            <View {...rest} style={[rest.style, hostStyle]}>
                <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flexDirection: 'row', flex: 1}]}>
                    <MyText numberOfLines={1} style={[{color: '#ECE9ED'}]}>....................................</MyText>
                </View>
            </View>
        );
    }
    return (
        <MyText {...props}/>
    )
}

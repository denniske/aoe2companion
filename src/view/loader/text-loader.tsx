import {Text, TextProps, View} from "react-native";
import React from "react";

type TextLoaderProps = TextProps & { children?: React.ReactNode, ready?: any }

export function TextLoader(props: TextLoaderProps) {
    // console.log("text loader", props);
    const { children, ...rest } = props;
    // console.log('rest', rest);

    if (props.children == null || ('ready' in props && !props.ready)) {
        return (
            <View {...rest} style={[rest.style, { flexDirection: 'row', backgroundColor: 'white', display: 'flex'}]}>
                <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flexDirection: 'row'}]}>
                    <Text style={{color: '#ECE9ED'}} numberOfLines={1}>....................................</Text>
                </View>
            </View>
        );
    }
    return (
        <Text {...props}/>
    )
}

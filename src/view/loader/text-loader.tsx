import {Text, TextProps, View} from "react-native";
import React from "react";

type TextLoaderProps = TextProps & { children?: React.ReactNode, ready?: any }

export function TextLoader(props: TextLoaderProps) {
    // console.log("text loader", props);
    const { children, ...rest } = props;
    // console.log('rest', rest);
    console.log('props.ready', props.ready);

    // flex: 1.5, padding: 8,
    if (props.children == null || ('ready' in props && !props.ready)) {
        return (
            <View {...rest} style={[rest.style, { flexDirection: 'row', backgroundColor: 'white', display: 'flex'}]}>
                <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flexDirection: 'row'}]}>
                    <Text style={{color: '#ECE9ED'}} numberOfLines={1}>....................................</Text>
                </View>
            </View>
        );
        // return (
        //     <View {...rest}>
        //         <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flex: 1}]}/>
        //     </View>
        // );
        // return (
        //     <View style={{flexDirection: 'row', backgroundColor: 'red', width: '100%'}}>
        //   <Text {...rest}>nulfsdfl</Text>
        //     </View>
        // );
        // return (
        //   <Text {...rest}>null</Text>
        // );
    }
    return (
        <Text {...props}/>
    )
}

import {Image, ImageProps, Text, View} from "react-native";
import React from "react";

export function ImageLoader(props: ImageProps) {
    if (props.source == null) {
        return (
            <View {...props} style={[props.style, { height: 'auto', flexDirection: 'row', backgroundColor: 'white', display: 'flex'}]}>
                <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flexDirection: 'row'}]}>
                    <Text style={{color: '#ECE9ED'}} numberOfLines={1}>....................................</Text>
                </View>
            </View>
        );
    }
    return (
        <Image {...props}/>
    )
}

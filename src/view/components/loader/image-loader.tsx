import {Image, ImageProps, ImageSourcePropType, Text, View} from "react-native";
import React from "react";

// interface ImageLoaderProps extends ImageProps {
//     source?: ImageSourcePropType;
// }

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type ImageLoaderProps = Optional<ImageProps, 'source'>;

export function ImageLoader(props: ImageLoaderProps) {
    if (props.source == null) {
        return (
            <View {...props} style={[props.style, { height: 'auto', flexDirection: 'row', display: 'flex'}]}>
                <View style={[{backgroundColor: '#ECE9ED', borderRadius: 5, flexDirection: 'row'}]}>
                    <Text style={{color: '#ECE9ED'}} numberOfLines={1}>....................................</Text>
                </View>
            </View>
        );
    }
    return (
        <Image {...(props as ImageProps)}/>
    )
}

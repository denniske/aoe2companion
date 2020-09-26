import {Image, ImageBackground, ImageBackgroundProps, ImageProps, ScrollView, StyleSheet, View} from "react-native";
import React, {useEffect, useState} from "react";
import {noop} from "../../../../data/src/helper/util";

export default function ImageSized(props: ImageBackgroundProps) {
    const [size, setSize] = useState({ width: 1, height: 1 });
    const [aspectRatio, setAspectRatio] = useState(2.2);
    const { style, imageStyle, ...rest } = props;

    useEffect(() => {
        const info = Image.resolveAssetSource(props.source);
        if (info.width && info.height) {
            setSize({
                width: info.width,
                height: info.height,
            });
            setAspectRatio(info.width/info.height);
            return;
        }
        Image.getSize(info.uri, (width, height) => {
            setSize({width, height});
            setAspectRatio(width/height);
        }, noop);
    }, []);

    return (
        <ImageBackground {...rest} imageStyle={styles.imageInner} style={[styles.image, style, {aspectRatio: aspectRatio}]}/>
    );
}

const styles = StyleSheet.create({
    imageInner: {
        resizeMode: "contain",
    },
    image: {
        width: 300,
    },
});

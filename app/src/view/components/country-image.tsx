import React from 'react';
import {ImageProps, View, Image, StyleSheet} from 'react-native';
import {flagsIcon, getFlagIndex} from '../../helper/flags';
import {createStylesheet} from '../../theming-new';
import {Flag} from '@nex/data';


export interface Props extends ImageProps {
    country?: Flag;
}

export interface LoaderProps extends Props {
    ready?: any,
}

export function CountryImage(props: Props) {
    const styles = useStyles();
    const { style, country, ...rest } = props;

    // console.log('getFlagIndex(country)', getFlagIndex(country));

    return (
        <View style={[styles.wrapper, style]}>
            <Image {...rest} source={flagsIcon} style={[styles.image, {
                left: -1 * getFlagIndex(country) * 21,
            }]} />
        </View>
    );
}

export function CountryImageLoader(props: LoaderProps) {
    const styles = useStyles();
    const { style, country, ready, ...rest } = props;

    // console.log('getFlagIndex(country)', getFlagIndex(country));

    if (!ready) {
        return <View style={[style, styles.container]}></View>
    }

    return (
        <View style={[styles.wrapper, style]}>
            <Image source={flagsIcon} style={[styles.image, {
                left: -1 * getFlagIndex(country) * 21,
            }]} />
        </View>
    );
}


const useStyles = createStylesheet(theme => StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
        // width: 21,
        // height: 15,
    },
    image: {
        position: 'absolute',
    },
    container: {
        backgroundColor: theme.skeletonColor,
        borderRadius: 5,
        flexDirection: 'row',
        height: 17,
    },
}));

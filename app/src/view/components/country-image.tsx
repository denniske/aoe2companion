import React from 'react';
import {flagEmojiDict} from '../../helper/flags';
import {Flag} from '@nex/data';
import {MyText} from './my-text';
import {TextLoader} from './loader/text-loader';
import { TextStyle } from 'react-native';


export interface Props {
    country?: string;
    style?: TextStyle
}

export interface LoaderProps extends Props {
    ready?: any,
}

export function CountryImage(props: Props) {
    const { country } = props;

    return (
        <MyText style={props.style ?? {
            transform: [{ scale: 1.3 }],
            marginLeft: 3,
            marginRight: 4+3,
        }}>{country ? flagEmojiDict[country.toUpperCase() as any] : '🏳'}</MyText>
    );
}

export function CountryImageLoader(props: LoaderProps) {
    const { country, ready } = props;

    return (
        <TextLoader width={21} ready={ready} style={{
            marginRight: 4+3,
        }} textStyle={{
            marginLeft: 3,
            transform: [{ scale: 1.3 }],
        }}>{country ? flagEmojiDict[country.toUpperCase()] : '🏳'}</TextLoader>
    );
}

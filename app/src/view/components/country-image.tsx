import React from 'react';
import {flagEmojiDict} from '../../helper/flags';
import {Flag} from '@nex/data';
import {MyText} from './my-text';
import {TextLoader} from './loader/text-loader';
import { TextProps } from 'react-native';


export interface Props extends TextProps {
    country?: string;
}

export interface LoaderProps extends Props {
    ready?: any,
}

export function CountryImageForDropDown(props: Props) {
    const { country } = props;

    return (
        <MyText>{country ? flagEmojiDict[country.toUpperCase() as any] : '🏳'}</MyText>
    );
}

export function SpecialImageForDropDown(props: { emoji: string }) {
    return (
        <MyText>{props.emoji}</MyText>
    );
}

export function CountryImage({ country, ...props }: Props) {
    return (
        <MyText
            {...props}
            style={
                props.style ?? {
                    transform: [{ scale: 1.3 }],
            marginLeft: 3,
                    marginRight: 4 + 3,
                }
            }
        >
            {country ? flagEmojiDict[country.toUpperCase() as any] : '🏳'}
        </MyText>
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

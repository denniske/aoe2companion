import { Image, ImageProps, View } from 'react-native';
import React from 'react';
import { Text } from '@app/components/text';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
type ImageLoaderProps = Optional<ImageProps, 'source'> & {
    ready?: any,
}

export function ImageLoader(props: ImageLoaderProps) {
    const { className, ...rest } = props;
    if (props.source == null || ('ready' in props && !props.ready)) {
        return (
            <View {...rest} className={`flex-row bg-skeleton rounded-sm h-auto ${className}`}>
                <Text className="text-transparent !leading-[normal]" numberOfLines={1}>....................................</Text>
            </View>
        );
    }
    return (
        <Image {...(props as ImageProps)}/>
    )
}

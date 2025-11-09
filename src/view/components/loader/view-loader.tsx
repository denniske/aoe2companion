import { View, ViewProps } from 'react-native';
import React from 'react';

type TextLoaderProps = ViewProps & { children?: React.ReactNode, ready?: any }

export function ViewLoader(props: TextLoaderProps) {
    const { children, className, ...rest } = props;

    if (props.children == null || ('ready' in props && !props.ready)) {
        return (
            <View {...rest} className={`flex flex-row ${className}`}>
                <View className="flex-row bg-skeleton rounded-md">
                    <View className="opacity-0">{children}</View>
                </View>
            </View>
        );
    }
    return (
        <View>{children}</View>
    )
}

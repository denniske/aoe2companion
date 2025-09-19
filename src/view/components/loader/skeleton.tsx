import { View } from 'react-native';
import React from 'react';
import { useAppTheme } from '@app/theming';

type SkeletonProps = { className?: string }

export function Skeleton(props: SkeletonProps) {
    const { className } = props;

    const theme = useAppTheme();

    return (
        <View className={`${className} rounded-md`} style={{backgroundColor: theme.skeletonColor}}/>
    )
}

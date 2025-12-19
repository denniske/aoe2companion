import { Image, ImageProps } from '@/src/components/uniwind/image';
import { ImageSourcePropType, TouchableOpacity, View } from 'react-native';

import { Text, TextProps } from './text';
import { openLink } from '@app/helper/url';
import React from 'react';
import { Skeleton, SkeletonText } from './skeleton';
import cn from 'classnames';

export interface HeaderTitleProps {
    title: string | true;
    subtitle?: string | React.ReactNode | true;
    subtitleLink?: string;
    iconComponent?: React.ReactNode;
    icon?: ImageSourcePropType | true;
    iconStyle?: ImageProps['style'];
    iconContentFit?: ImageProps['contentFit'];
    align?: TextProps['align'];
}

export const HeaderTitle: React.FC<HeaderTitleProps> = ({
    title,
    subtitle,
    icon,
    iconComponent,
    iconStyle,
    iconContentFit,
    align = 'left',
    subtitleLink,
}) => {
    const isSkeleton = title === true || !title;
    const TextComponent = isSkeleton ? SkeletonText : Text;

    return (
        <View className="items-center flex-row gap-2 flex-1">
            {iconComponent ? (
                iconComponent
            ) : icon === true ? (
                <Skeleton className="w-8 h-8" alt />
            ) : (
                icon && <Image className="w-8 h-8" contentFit={iconContentFit} style={iconStyle} source={icon} />
            )}
            <View className="flex-1">
                <TextComponent
                    alt
                    variant={subtitle ? 'header' : 'header-lg'}
                    color="brand"
                    numberOfLines={1}
                    allowFontScaling={false}
                    align={align}
                    className={cn(isSkeleton && 'w-3xs! md:w-xs!')}
                >
                    {title}
                </TextComponent>
                {subtitle && (
                    <TouchableOpacity onPress={() => openLink(subtitleLink!)} disabled={!subtitleLink}>
                        <TextComponent
                            alt
                            variant="label"
                            numberOfLines={1}
                            allowFontScaling={false}
                            align={align}
                            color={!subtitleLink ? 'default' : 'link'}
                            className={cn(isSkeleton && 'w-3xs! md:w-xs!')}
                        >
                            {subtitle}
                        </TextComponent>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

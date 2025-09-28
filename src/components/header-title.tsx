import { Image, ImageProps } from 'expo-image';
import { ImageSourcePropType, TouchableOpacity, View } from 'react-native';

import { Text, TextProps } from './text';
import { openLink } from '@app/helper/url';
import { MyText } from '@app/view/components/my-text';
import React from 'react';

export interface HeaderTitleProps {
    title: string;
    subtitle?: string | React.ReactNode;
    subtitleLink?: string;
    iconComponent?: React.ReactNode;
    icon?: ImageSourcePropType;
    iconStyle?: ImageProps['style'];
    iconContentFit?: ImageProps['contentFit'];
    align?: TextProps['align'];
}

export const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, subtitle, icon, iconComponent, iconStyle, iconContentFit, align = 'left', subtitleLink }) => {
    return (
        <View className="items-center flex-row gap-2 flex-1">
            {iconComponent ? iconComponent : icon && <Image className="w-8 h-8" contentFit={iconContentFit} style={iconStyle} source={icon} />}
            <View className="flex-1">
                <Text variant={subtitle ? 'header' : 'header-lg'} color="brand" numberOfLines={1} allowFontScaling={false} align={align}>
                    {title}
                </Text>
                {subtitle && (
                    <TouchableOpacity onPress={() => openLink(subtitleLink!)} disabled={!subtitleLink}>
                        <Text variant="label" numberOfLines={1} allowFontScaling={false} align={align} color={!subtitleLink ? 'default' : 'link'}>
                            {subtitle}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

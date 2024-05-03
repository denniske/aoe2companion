import { Image, ImageProps } from 'expo-image';
import { ImageSourcePropType, View } from 'react-native';

import { Text, TextProps } from './text';

export interface HeaderTitleProps {
    title: string;
    subtitle?: string | React.ReactNode;
    iconComponent?: React.ReactNode;
    icon?: ImageSourcePropType;
    iconStyle?: ImageProps['style'];
    align?: TextProps['align'];
}

export const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, subtitle, icon, iconComponent, iconStyle, align = 'left' }) => {
    return (
        <View className="items-center flex-row gap-2 flex-1">
            {iconComponent ? iconComponent : icon && <Image className="w-8 h-8" style={iconStyle} source={icon} />}
            <View className="flex-1">
                <Text variant={subtitle ? 'header' : 'header-lg'} color="brand" numberOfLines={1} allowFontScaling={false} align={align}>
                    {title}
                </Text>
                {subtitle && (
                    <Text variant="label" numberOfLines={1} allowFontScaling={false} align={align}>
                        {subtitle}
                    </Text>
                )}
            </View>
        </View>
    );
};

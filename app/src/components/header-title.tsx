import { Image } from 'expo-image';
import { ImageSourcePropType, View } from 'react-native';

import { Text } from './text';

export interface HeaderTitleProps {
    title: string;
    subtitle?: string;
    icon?: ImageSourcePropType;
}

export const HeaderTitle: React.FC<HeaderTitleProps> = ({ title, subtitle, icon }) => {
    return (
        <View className="items-center flex-row gap-2">
            {icon && <Image className="w-8 h-8" source={icon} />}
            <View>
                <Text variant={subtitle ? 'header' : 'header-lg'} color="brand" numberOfLines={1}>
                    {title}
                </Text>
                {subtitle && (
                    <Text variant="label" numberOfLines={1}>
                        {subtitle}
                    </Text>
                )}
            </View>
        </View>
    );
};

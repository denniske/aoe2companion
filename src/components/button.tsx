import {TextVariant} from '@app/utils/text.util';
import {router} from 'expo-router';
import {Pressable, TouchableOpacityProps} from 'react-native';

import {Icon, IconProps} from './icon';
import {Text, TextProps} from './text';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
    children?: string;
    icon?: IconProps['icon'];
    href?: string;
    size?: 'small' | 'medium' | 'large';
    align?: TextProps['align'];
    textStyle?: TextProps['style'];
}

export const Button: React.FC<ButtonProps> = ({ className, children, icon, onPress, href, size = 'medium', disabled, align, textStyle, ...props }) => {
    const textSizes: Record<NonNullable<ButtonProps['size']>, TextVariant> = {
        small: 'label-sm',
        medium: 'header-xs',
        large: 'header',
    };

    const spacingSizes: Record<NonNullable<ButtonProps['size']>, string> = {
        small: 'gap-1 py-1 px-2',
        medium: 'gap-1 py-1.5 px-2.5',
        large: 'gap-2 py-2 px-3 w-full',
    };

    const backgroundColor = disabled ? 'bg-gray-500' : 'bg-blue-800 dark:bg-gold-700';
    const color = disabled ? 'text-gray-600' : 'text-white';

    return (
        <Pressable
            className={`flex-row rounded items-center ${spacingSizes[size]} ${backgroundColor} ${className ?? ''}`}
            onPress={(e) => {
                if (href) {
                    router.push(href);
                }
                onPress?.(e);
            }}
        >
            {icon && <Icon color="white" icon={icon} size={14} />}
            {children && (
                <Text
                    variant={textSizes[size]}
                    color={color}
                    className={`uppercase ${align ? 'flex-1' : ''}`}
                    align={align}
                    style={textStyle}
                    allowFontScaling={false}
                >
                    {children}
                </Text>
            )}
        </Pressable>
    );
};

import { TextVariant } from '@app/utils/text.util';
import { router } from 'expo-router';
import {
    LayoutRectangle,
    Modal,
    Platform,
    Pressable,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';

import { Icon, IconProps } from './icon';
import { Text, TextProps } from './text';
import { useAppTheme } from '@app/theming';
import { v3Shadow } from '@app/components/shadow';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export interface MenuProps extends Omit<TouchableOpacityProps, 'children'> {
    icon?: IconProps['icon'];
    href?: string;
    size?: 'small' | 'medium' | 'large';
    align?: TextProps['align'];
    textStyle?: TextProps['style'];
    contentStyle?: ViewProps['style'];
    children: React.ReactNode;
    anchor: React.ReactNode;
    visible: boolean;
    onDismiss?: () => void;
}

export const MenuNew: React.FC<MenuProps> = ({
    anchor,
    onDismiss,
    visible,
    contentStyle,
    children,
    icon,
    onPress,
    href,
    size = 'medium',
    disabled,
    align,
    textStyle,
    ...props
}) => {
    const theme = useAppTheme();

    const [anchorLayout, setAnchorLayout] = React.useState({ x: 0, y: 0, top: 0, left: 0, width: 0, height: 0 });
    const [modalLayout, setModalLayout] = React.useState({ x: 0, y: 0, top: 0, left: 0, width: 0, height: 0 });

    const textSizes: Record<NonNullable<MenuProps['size']>, TextVariant> = {
        small: 'label-sm',
        medium: 'header-xs',
        large: 'header',
    };

    const spacingSizes: Record<NonNullable<MenuProps['size']>, string> = {
        small: 'gap-1 py-1 px-2',
        medium: 'gap-1 py-1.5 px-2.5',
        large: 'gap-2 py-2 px-3 w-full',
    };

    const backgroundColor = disabled ? 'bg-gray-500' : 'bg-blue-800 dark:bg-gold-700';
    const color = disabled ? 'text-gray-600' : 'text-white';

    const roundness = 4;

    console.log('visible', visible);

    const handleDismiss = React.useCallback(() => {
        if (visible) {
            onDismiss?.();
        }
    }, [onDismiss, visible]);

    return (
        <View>
            <Modal visible={visible} onRequestClose={onDismiss} animationType="fade" transparent

                   onLayout={(event) => {
                       const a = event.nativeEvent.layout.width;
                       console.log('11 event.nativeEvent', event.nativeEvent);
                       console.log('11 event.nativeEvent.layout', event.nativeEvent.layout);
                       setModalLayout(event.nativeEvent.layout as any);
                   }}
            >
                <SafeAreaProvider
                    className={
                        Platform.OS === 'web'
                            ? 'overflow-hidden w-[450px] max-w-full max-h-[900px] mx-auto my-auto border border-gray-200 dark:border-gray-800 rounded-lg pt-12'
                            : 'flex-1'
                    }
                >
                    <Pressable
                        onPress={onDismiss}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.0)',
                            ...Platform.select({
                                web: {
                                    cursor: 'auto',
                                },
                            }),
                            ...StyleSheet.absoluteFillObject,
                            width: '100%',
                        }}
                    />

                    <View
                        style={
                            [
                                {
                                    position: 'fixed',
                                    top: anchorLayout.top + anchorLayout.height,
                                    left: anchorLayout.left,
                                    right: modalLayout.width - anchorLayout.left - anchorLayout.width,
                                    backgroundColor: theme.backgroundColor,
                                    zIndex: 9919999,
                                    borderRadius: roundness,
                                    marginTop: 15,
                                },
                                contentStyle,
                                v3Shadow(3),
                            ] as StyleProp<ViewStyle>
                        }
                    >
                        {children}
                    </View>
                </SafeAreaProvider>
            </Modal>

            <TouchableOpacity
                onLayout={(event) => {
                    const a = event.nativeEvent.layout.width;
                    console.log('event.nativeEvent', event.nativeEvent);
                    console.log('event.nativeEvent.layout', event.nativeEvent.layout);
                    setAnchorLayout(event.nativeEvent.layout as any);
                }}
                {...props}
                disabled={disabled}
                // className={`flex-row rounded items-center ${spacingSizes[size]}`}
                onPress={(e) => {
                    if (href) {
                        router.push(href);
                    }
                    onPress?.(e);
                }}
            >
                {icon && <Icon color="text-white" icon={icon} size={14} />}
                {anchor}
                {/*{children && (*/}
                {/*    <Text*/}
                {/*        variant={textSizes[size]}*/}
                {/*        color={color}*/}
                {/*        className={`uppercase ${align ? 'flex-1' : ''}`}*/}
                {/*        align={align}*/}
                {/*        style={textStyle}*/}
                {/*        allowFontScaling={false}*/}
                {/*    >*/}
                {/*        OPEN*/}
                {/*    </Text>*/}
                {/*)}*/}
            </TouchableOpacity>
        </View>
    );
};

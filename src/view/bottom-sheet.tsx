import { Text } from '@app/components/text';
import { useEffect, useState } from 'react';
import { Modal, View, ScrollView, Pressable, StyleSheet, ViewStyle, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from '@/src/components/uniwind/safe-area-context';
import { createStylesheet } from '../theming-new';
import { Icon } from '@app/components/icon';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
    Easing,
} from "react-native-reanimated";
import {scheduleOnRN} from "react-native-worklets";
import cn from 'classnames';
import { containerScrollClassName } from '@app/styles';

export type BottomSheetProps = {
    title?: string;
    isActive?: boolean;
    isFullHeight?: boolean;
    extendBottom?: boolean;
    container?: 'scroll' | 'none';
    onClose?: () => void;
    onCloseComplete?: () => void;
    children: React.ReactNode;
    style?: ViewStyle;
    closeButton?: boolean;
    containerClassName?: string;
};

export function BottomSheet({
    title,
    onClose,
    onCloseComplete,
    isActive = false,
    isFullHeight = false,
    extendBottom = false,
    container = 'scroll',
    children,
    style,
    closeButton,
    containerClassName,
}: BottomSheetProps) {
    const bottom = useSharedValue(0);
    const [isVisible, setIsVisible] = useState(isActive);
    const [height, setHeight] = useState(0);
    const styles = useStyles();

    const easing = Easing.inOut(Easing.quad);
    const duration = 250;

    const triggerOpen = () => bottom.value = withTiming(0, { duration, easing });
    const triggerClose = () => bottom.value = withTiming(height, { duration, easing }, () => {
        scheduleOnRN(setIsVisible, false)
        if (onCloseComplete) {
            scheduleOnRN(onCloseComplete);
        }
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            flex: isFullHeight ? 1 : undefined,
            marginBottom: interpolate(bottom.value, [-1, 0, 1], [0, 0, -1]),
            paddingBottom: interpolate(bottom.value, [-1, 0, 1], [1, 0, 0]),
        };
    }, [isFullHeight]);

    const shouldTriggerOpen = isActive && isVisible && height > 0;
    const shouldTriggerClose = !isActive;

    useEffect(() => {
        if (shouldTriggerOpen) {
            triggerOpen();
        }
        if (shouldTriggerClose) {
            triggerClose();
        }
    }, [shouldTriggerOpen, shouldTriggerClose]);

    useEffect(() => {
        if (isActive) {
            setIsVisible(true);
        }
    }, [isActive]);

    return (
        <Modal visible={isVisible} onRequestClose={onClose} animationType="fade" transparent>
            <SafeAreaProvider className="flex-1">
                <Pressable disabled={!onClose} onPress={onClose} style={[styles.overlay, StyleSheet.absoluteFill]} />

                <SafeAreaView edges={['top']} style={{ flex: 1, pointerEvents: Platform.OS === 'web' ? 'none' : 'box-none' }}>
                    <View className="flex-1 justify-end web:justify-center" style={{ pointerEvents: Platform.OS === 'web' ? 'none' : 'box-none' }}>
                        <Animated.View
                            onLayout={(e) => {
                                const newHeight = Math.round(e.nativeEvent.layout.height);
                                if (height === 0) {
                                    bottom.value = newHeight;
                                }
                                setHeight(newHeight);
                            }}
                            className={cn(
                                'bg-gold-50 dark:bg-blue-950 rounded-t-lg overflow-hidden max-h-full',
                                containerClassName,
                                containerScrollClassName,
                                Platform.OS === 'web' && 'border border-gray-200 dark:border-gray-800 rounded-lg max-w-4xl! my-12'
                            )}
                            style={animatedStyle}
                            pointerEvents={Platform.OS === 'web' ? 'box-none' : undefined}
                        >
                            <SafeAreaView
                                edges={extendBottom ? [] : ['bottom']}
                                style={{
                                    maxHeight: '100%',
                                    flex: isFullHeight ? 1 : undefined,
                                }}
                            >
                                {/*{showHandle && (*/}
                                {/*    <PanGestureHandler*/}
                                {/*        onGestureEvent={Animated.event([{ nativeEvent: { translationY: modalAnimation } }], {*/}
                                {/*            useNativeDriver: false,*/}
                                {/*        })}*/}
                                {/*        onEnded={(e) => {*/}
                                {/*            const shouldClose = Number(e.nativeEvent.translationY) > 150;*/}

                                {/*            if (shouldClose) {*/}
                                {/*                onClose?.();*/}
                                {/*            } else {*/}
                                {/*                triggerOpen();*/}
                                {/*            }*/}
                                {/*        }}*/}
                                {/*    >*/}
                                {/*        <Animated.View className={`items-center pt-2 pb-4 ${title ? '-mb-4 z-10' : ''}`}>*/}
                                {/*            <View style={styles.handle} />*/}
                                {/*        </Animated.View>*/}
                                {/*    </PanGestureHandler>*/}
                                {/*)}*/}

                                {container === 'scroll' ? (
                                    <ScrollView contentContainerStyle={[styles.contentContainer, style]} style={style}>
                                        {title && (
                                            <View className={closeButton ? 'relative px-6 flex-row' : 'flex-row'}>
                                                <Text color="brand" variant="header-lg" className="text-center flex-1">
                                                    {title}
                                                </Text>
                                                {closeButton && (
                                                    <TouchableOpacity className="absolute right-0 h-full justify-center" onPress={onClose}>
                                                        <Icon size={24} prefix="fasr" icon="times" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )}
                                        {children}
                                    </ScrollView>
                                ) : null}

                                {container === 'none' ? (
                                    <>
                                        {title && (
                                            <View className={closeButton ? 'relative px-6 flex-row' : 'flex-row'}>
                                                <Text color="brand" variant="header-lg" className="text-center flex-1">
                                                    {title}
                                                </Text>
                                                {closeButton && (
                                                    <TouchableOpacity className="absolute right-0 h-full justify-center" onPress={onClose}>
                                                        <Icon size={24} prefix="fasr" icon="times" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )}
                                        {children}
                                    </>
                                ) : null}
                            </SafeAreaView>
                        </Animated.View>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        handle: {
            height: 4,
            width: 120,
            borderRadius: 2,
            backgroundColor: theme.hoverBackgroundColor,
        },
        contentContainer: {
            padding: Platform.OS === 'web' ? 24 : 12,
        },
    })
);

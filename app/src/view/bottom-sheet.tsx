import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, View, ScrollView, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createStylesheet } from '../theming-new';
import { PanGestureHandler } from 'react-native-gesture-handler';

export type BottomSheetProps = {
    isActive?: boolean;
    isFullHeight?: boolean;
    showHandle?: boolean;
    onClose?: () => void;
    onCloseComplete?: () => void;
    children: React.ReactNode;
    style: ViewStyle;
};

function BottomSheet({ onClose, onCloseComplete, showHandle, isActive = false, isFullHeight = false, children, style }: BottomSheetProps) {
    const modalAnimation = useRef(new Animated.Value(0)).current;
    const [isVisible, setIsVisible] = useState(isActive);
    const [height, setHeight] = useState(0);
    const styles = useStyles();

    const animateToValue = (toValue: number, callback?: () => void) => {
        Animated.timing(modalAnimation, {
            toValue,
            duration: 250,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
        }).start(callback);
    };

    const triggerOpen = () => animateToValue(0);
    const triggerClose = () =>
        animateToValue(height, () => {
            setIsVisible(false);
            if (onCloseComplete) {
                onCloseComplete();
            }
        });
    const shouldTriggerOpen = isActive && isVisible && height > 0;
    const shouldTriggerClose = !isActive;

    useEffect(() => {
        if (shouldTriggerOpen) {
            triggerOpen();
        }

        if (shouldTriggerClose) {
            triggerClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldTriggerOpen, shouldTriggerClose]);

    useEffect(() => {
        if (isActive) {
            setIsVisible(true);
        }
    }, [isActive]);

    return (
        <Modal visible={isVisible} onRequestClose={onClose} animationType="fade" transparent>
            <SafeAreaProvider>
                <Pressable disabled={!onClose} onPress={onClose} style={[styles.overlay, StyleSheet.absoluteFill]} />

                <View style={styles.container} pointerEvents="box-none">
                    <Animated.View
                        onLayout={(e) => {
                            const newHeight = Math.round(e.nativeEvent.layout.height);
                            if (height === 0) {
                                modalAnimation.setValue(newHeight);
                            }
                            setHeight(newHeight);
                        }}
                        style={[
                            styles.animatedContainer,
                            {
                                flex: isFullHeight ? 1 : undefined,
                                marginBottom: modalAnimation.interpolate({
                                    inputRange: [-1, 0, 1],
                                    outputRange: [0, 0, -1],
                                }),
                                paddingBottom: modalAnimation.interpolate({
                                    inputRange: [-1, 0, 1],
                                    outputRange: [1, 0, 0],
                                }),
                            },
                        ]}
                    >
                        <SafeAreaView
                            edges={['bottom']}
                            style={{
                                maxHeight: '100%',
                                flex: isFullHeight ? 1 : undefined,
                            }}
                        >
                            {showHandle && (
                                <PanGestureHandler
                                    onGestureEvent={Animated.event([{ nativeEvent: { translationY: modalAnimation } }], { useNativeDriver: false })}
                                    onEnded={(e) => {
                                        const shouldClose = height - Number(e.nativeEvent.translationY) < 100;

                                        if (shouldClose) {
                                            onClose?.();
                                        } else {
                                            triggerOpen();
                                        }
                                    }}
                                >
                                    <Animated.View style={styles.handleContainer}>
                                        <View style={styles.handle} />
                                    </Animated.View>
                                </PanGestureHandler>
                            )}
                            <ScrollView contentContainerStyle={[styles.contentContainer, style]}>{children}</ScrollView>
                        </SafeAreaView>
                    </Animated.View>
                </View>
            </SafeAreaProvider>
        </Modal>
    );
}

const useStyles = createStylesheet((theme) =>
    StyleSheet.create({
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        handleContainer: {
            paddingTop: 8,
            paddingBottom: 16,
            alignItems: 'center',
        },
        handle: {
            height: 4,
            width: 120,
            borderRadius: 2,
            backgroundColor: theme.hoverBackgroundColor,
        },
        container: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        animatedContainer: {
            backgroundColor: theme.backgroundColor,
            borderTopStartRadius: 8,
            borderTopEndRadius: 8,
            overflow: 'hidden',
            maxHeight: '100%',
        },
        contentContainer: {
            padding: 12,
        },
    })
);

export { BottomSheet };
export default BottomSheet;

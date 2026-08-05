import { TextVariant } from '@app/utils/text.util';
import {
    Dimensions,
    EmitterSubscription,
    LayoutRectangle,
    NativeEventSubscription,
    Platform,
    Pressable,
    StyleProp,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';

import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { PressableOpacityProps } from '@app/components/pressable-opacity';
import { IconProps } from './icon';
import { TextProps } from './text';
import { useAppTheme } from '@app/theming';
import { v3Shadow } from '@app/components/shadow';
import { Gesture, GestureDetector, TapGestureHandler } from 'react-native-gesture-handler';
import { RenderInPortal } from '@app/components/portal/render-in-portal';
import * as React from 'react';
import { FC, MutableRefObject, ReactNode, useEffect, useRef, useState } from 'react';
import { KeyboardEvent as RNKeyboardEvent } from 'react-native/Libraries/Components/Keyboard/Keyboard';

const WINDOW_LAYOUT = Dimensions.get('window');

const BACKDROP_COLOR = Platform.OS === 'web' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.1)';
const BACKDROP_FADE_DURATION = 300;

export interface MenuProps extends Omit<PressableOpacityProps, 'children'> {
    icon?: IconProps['icon'];
    href?: string;
    size?: 'small' | 'medium' | 'large';
    align?: TextProps['align'];
    textStyle?: TextProps['style'];
    contentStyle?: ViewProps['style'];
    children: ReactNode;
    anchor: ReactNode;
    visible: boolean;
    onDismiss?: () => void;
}

export const MenuNew: FC<MenuProps> = ({
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

    const roundness = 8;

    // console.log('visible', visible);

    const [rendered, setRendered] = useState(visible);
    const [left, setLeft] = useState(2000);
    const [top, setTop] = useState(2000);
    const [right, setRight] = useState(2000);
    const [menuLayout, setMenuLayout] = useState({ width: 0, height: 0 });
    const [anchorLayout, setAnchorLayout] = useState({
        width: 0,
        height: 0,
    });
    const [windowLayout, setWindowLayout] = useState({
        width: WINDOW_LAYOUT.width,
        height: WINDOW_LAYOUT.height,
    });

    const backdropProgress = useSharedValue(0);

    const keyboardHeightRef = useRef(0);
    const prevVisible = useRef<boolean | null>(null);
    const anchorRef = useRef<View | null>(null);
    const menuRef = useRef<View | null>(null);
    const prevRendered = useRef(false);

    const keyboardDidShow = (e: RNKeyboardEvent) => {
        const keyboardHeight = e.endCoordinates.height;
        keyboardHeightRef.current = keyboardHeight;
    };

    const keyboardDidHide = () => {
        keyboardHeightRef.current = 0;
    };

    const keyboardDidShowListenerRef: MutableRefObject<EmitterSubscription | undefined> = useRef(undefined);
    const keyboardDidHideListenerRef: MutableRefObject<EmitterSubscription | undefined> = useRef(undefined);

    const backHandlerSubscriptionRef: MutableRefObject<NativeEventSubscription | undefined> = useRef(undefined);
    const dimensionsSubscriptionRef: MutableRefObject<NativeEventSubscription | undefined> = useRef(undefined);

    const handleDismiss = () => {
        if (visible) {
            onDismiss?.();
        }
    };

    const handleKeypress = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onDismiss?.();
        }
    };

    const removeListeners = () => {
        // backHandlerSubscriptionRef.current?.remove();
        // dimensionsSubscriptionRef.current?.remove();
        // isBrowser() && document.removeEventListener('keyup', handleKeypress);
    };

    const attachListeners = () => {
        // backHandlerSubscriptionRef.current = addEventListener(
        //     BackHandler,
        //     'hardwareBackPress',
        //     handleDismiss
        // );
        // dimensionsSubscriptionRef.current = addEventListener(
        //     Dimensions,
        //     'change',
        //     handleDismiss
        // );
        // Platform.OS === 'web' && document.addEventListener('keyup', handleKeypress);
    };

    const measureMenuLayout = () =>
        new Promise<LayoutRectangle>((resolve) => {
            if (menuRef.current) {
                menuRef.current.measureInWindow((x: any, y: any, width: any, height: any) => {
                    resolve({ x, y, width, height });
                });
            }
        });

    const measureAnchorLayout = () =>
        new Promise<LayoutRectangle>((resolve) => {
            if (anchorRef.current) {
                anchorRef.current.measureInWindow((x: any, y: any, width: any, height: any) => {
                    resolve({ x, y, width, height });
                });
            }
        });

    // console.log('left, top', left, top);
    // console.log('anchorLayout', anchorLayout);
    // console.log('menuLayout', menuLayout);
    // console.log('windowLayout', windowLayout);

    const show = async () => {
        // console.log('==> SHOW');

        const windowLayoutResult = Dimensions.get('window');
        const [menuLayoutResult, anchorLayoutResult] = await Promise.all([measureMenuLayout(), measureAnchorLayout()]);

        // When visible is true for first render
        // native views can be still not rendered and
        // measureMenuLayout/measureAnchorLayout functions
        // return wrong values e.g { x:0, y: 0, width: 0, height: 0 }
        // so we have to wait until views are ready
        // and rerun this function to show menu
        if (
            !windowLayoutResult.width ||
            !windowLayoutResult.height ||
            !menuLayoutResult.width ||
            !menuLayoutResult.height ||
            !anchorLayoutResult.width ||
            !anchorLayoutResult.height
        ) {
            // console.log('===> requestAnimationFrame')
            requestAnimationFrame(show);
            return;
        }

        // console.log('anchorLayoutResult.x', anchorLayoutResult.x)
        // console.log('anchorLayoutResult.width', anchorLayoutResult.width)

        setLeft(anchorLayoutResult.x);
        setTop(anchorLayoutResult.y + (Platform.OS === 'web' ? window.scrollY : 0));
        // Use the freshly measured window width, not the `windowLayout` state: on the
        // first show that state is still the module-level default, so `right` was
        // computed from the wrong width.
        setRight(windowLayoutResult.width - anchorLayoutResult.x - anchorLayoutResult.width);

        // console.log('windowLayout.width', windowLayout.width)
        // console.log('_left', _left)
        // console.log('anchorLayout.width', anchorLayout.width)
        // console.log('webMarginX', webMarginX)

        setAnchorLayout({
            height: anchorLayoutResult.height,
            width: anchorLayoutResult.width,
        });

        setMenuLayout({
            height: menuLayoutResult.height,
            width: menuLayoutResult.width,
        });

        setWindowLayout({
            height: windowLayoutResult.height, // - keyboardHeightRef.current,
            width: windowLayoutResult.width,
        });

        attachListeners();
        // const { animation } = theme;
        // Animated.parallel([
        //     Animated.timing(scaleAnimationRef.current, {
        //         toValue: { x: menuLayoutResult.width, y: menuLayoutResult.height },
        //         duration: ANIMATION_DURATION * animation.scale,
        //         easing: EASING,
        //         useNativeDriver: true,
        //     }),
        //     Animated.timing(opacityAnimationRef.current, {
        //         toValue: 1,
        //         duration: ANIMATION_DURATION * animation.scale,
        //         easing: EASING,
        //         useNativeDriver: true,
        //     }),
        // ]).start(({ finished }) => {
        //     if (finished) {
        //         focusFirstDOMNode(menuRef.current);
        //         prevRendered.current = true;
        //     }
        // });

        prevRendered.current = true;
    };

    const hide = () => {
        // console.log('==> HIDE');

        removeListeners();

        // const { animation } = theme;
        //
        // Animated.timing(opacityAnimationRef.current, {
        //     toValue: 0,
        //     duration: ANIMATION_DURATION * animation.scale,
        //     easing: EASING,
        //     useNativeDriver: true,
        // }).start(({ finished }) => {
        //     if (finished) {
        //         setMenuLayout({ width: 0, height: 0 });
        //         setRendered(false);
        //         prevRendered.current = false;
        //         focusFirstDOMNode(anchorRef.current);
        //     }
        // });

        setMenuLayout({ width: 0, height: 0 });
        setRendered(false);
        prevRendered.current = false;
    };

    const updateVisibility = async (display: boolean) => {
        // console.log('==> updateVisibility', display);

        // Menu is rendered in Portal, which updates items asynchronously
        // We need to do the same here so that the ref is up-to-date
        await Promise.resolve().then(() => {
            if (display && !prevRendered.current) {
                show();
            } else {
                if (rendered) {
                    hide();
                }
            }

            return;
        });
    };

    useEffect(() => {
        // const opacityAnimation = opacityAnimationRef.current;
        // const scaleAnimation = scaleAnimationRef.current;
        // keyboardDidShowListenerRef.current = Keyboard.addListener(
        //     'keyboardDidShow',
        //     keyboardDidShow
        // );
        // keyboardDidHideListenerRef.current = Keyboard.addListener(
        //     'keyboardDidHide',
        //     keyboardDidHide
        // );

        return () => {
            removeListeners();
            // keyboardDidShowListenerRef.current?.remove();
            // keyboardDidHideListenerRef.current?.remove();
            // scaleAnimation.removeAllListeners();
            // opacityAnimation?.removeAllListeners();
        };
    }, [removeListeners, keyboardDidHide, keyboardDidShow]);

    useEffect(() => {
        // console.log('==> EFFECT visible', visible, 'rendered', rendered);
        // console.log('==> EFFECT prevVisible.current', prevVisible.current);

        if (prevVisible.current !== visible) {
            prevVisible.current = visible;

            if (visible !== rendered) {
                setRendered(visible);
            }
        }
    }, [visible, rendered]);

    useEffect(() => {
        updateVisibility(rendered);
    }, [rendered, updateVisibility]);

    useEffect(() => {
        // The backdrop is unmounted as soon as `visible` flips to false, so only the
        // fade in is ever seen; resetting to 0 keeps the next open starting from clear.
        backdropProgress.value = visible ? withTiming(1, { duration: BACKDROP_FADE_DURATION }) : 0;
    }, [visible, backdropProgress]);

    const tapGesture = Gesture.Tap()
        .runOnJS(true)
        .numberOfTaps(1)
        .shouldCancelWhenOutside(true)
        .onEnd((event, success) => {
            // 'worklet';
            console.log('ondismiss', event, success);
            if (success) {
                onDismiss?.();
            }
        });

    const noopGesture = Gesture.Tap().onEnd(() => {
        // do nothing
    });

    const backdropStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(backdropProgress.value, [0, 1], ['rgba(0, 0, 0, 0)', BACKDROP_COLOR]),
    }));

    return (
        <View>
            <View ref={(ref) => (anchorRef.current = ref) as any} collapsable={false}>
                {/* biome-ignore lint/suspicious/noLeakedRender: anchor is a ReactNode, never a leakable primitive */}
                {anchor == null ? null : anchor}
            </View>
            {!!(visible) && (
                <>
                    <RenderInPortal>
                        <GestureDetector gesture={tapGesture}>
                            <Animated.View className="w-full h-full cursor-pointer" style={backdropStyle}>
                                <GestureDetector gesture={noopGesture}>
                                    <View
                                        ref={(ref) => (menuRef.current = ref) as any}
                                        style={
                                            [
                                                {
                                                    position: 'absolute',
                                                    top: top,
                                                    left: left,
                                                    right: right,
                                                    backgroundColor: theme.backgroundColor,
                                                    zIndex: 110000,
                                                    borderRadius: roundness,
                                                    cursor: 'auto'
                                                },
                                                contentStyle,
                                                v3Shadow(3),
                                            ] as StyleProp<ViewStyle>
                                        }
                                    >
                                        {children}
                                    </View>
                                </GestureDetector>
                            </Animated.View>
                        </GestureDetector>
                    </RenderInPortal>
                </>
            )}
        </View>
    );
};

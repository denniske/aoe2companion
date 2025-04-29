import { TextVariant } from '@app/utils/text.util';
import { router } from 'expo-router';
import {
    Animated,
    Dimensions, EmitterSubscription, Keyboard,
    LayoutRectangle, NativeEventSubscription, Platform,
    StyleProp,
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
import { TapGestureHandler } from 'react-native-gesture-handler';
import { RenderInPortal } from '@app/components/portal/render-in-portal';
import * as React from 'react';
import { FC, MutableRefObject, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { addEventListener } from 'react-native-paper/src/utils/addEventListener';
import { BackHandler } from 'react-native-paper/src/utils/BackHandler/BackHandler';
import { KeyboardEvent as RNKeyboardEvent } from 'react-native/Libraries/Components/Keyboard/Keyboard';

const WINDOW_LAYOUT = Dimensions.get('window');

export interface MenuProps extends Omit<TouchableOpacityProps, 'children'> {
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

export const MenuNew: FC<MenuProps> = ({ anchor, onDismiss, visible, contentStyle, children, icon, onPress, href, size = 'medium', disabled, align, textStyle, ...props }) => {
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

    const roundness = 4;

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


    const keyboardHeightRef = useRef(0);
    const prevVisible = useRef<boolean | null>(null);
    const anchorRef = useRef<View | null>(null);
    const menuRef = useRef<View | null>(null);
    const prevRendered = useRef(false);

    const keyboardDidShow = useCallback((e: RNKeyboardEvent) => {
        const keyboardHeight = e.endCoordinates.height;
        keyboardHeightRef.current = keyboardHeight;
    }, []);

    const keyboardDidHide = useCallback(() => {
        keyboardHeightRef.current = 0;
    }, []);

    const keyboardDidShowListenerRef: MutableRefObject<
        EmitterSubscription | undefined
    > = useRef();
    const keyboardDidHideListenerRef: MutableRefObject<
        EmitterSubscription | undefined
    > = useRef();

    const backHandlerSubscriptionRef: MutableRefObject<
        NativeEventSubscription | undefined
    > = useRef();
    const dimensionsSubscriptionRef: MutableRefObject<
        NativeEventSubscription | undefined
    > = useRef();

    const handleDismiss = useCallback(() => {
        if (visible) {
            onDismiss?.();
        }
    }, [onDismiss, visible]);

    const handleKeypress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onDismiss?.();
            }
        },
        [onDismiss]
    );


    const removeListeners = useCallback(() => {
        // backHandlerSubscriptionRef.current?.remove();
        // dimensionsSubscriptionRef.current?.remove();
        // isBrowser() && document.removeEventListener('keyup', handleKeypress);
    }, [handleKeypress]);

    const attachListeners = useCallback(() => {
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
    }, [handleDismiss, handleKeypress]);

    const measureMenuLayout = () =>
        new Promise<LayoutRectangle>((resolve) => {
            if (menuRef.current) {
                menuRef.current.measureInWindow((x: any, y: any, width: any, height: any) => {
                    resolve({ x, y, width, height });
                });
            }
        });

    const measureAnchorLayout = useCallback(
        () =>
            new Promise<LayoutRectangle>((resolve) => {
                if (anchorRef.current) {
                    anchorRef.current.measureInWindow((x: any, y: any, width: any, height: any) => {
                        resolve({ x, y, width, height });
                    });
                }
            }),
        [anchor]
    );

    // console.log('left, top', left, top);
    // console.log('anchorLayout', anchorLayout);
    // console.log('menuLayout', menuLayout);
    // console.log('windowLayout', windowLayout);

    const show = useCallback(async () => {
        // console.log('==> SHOW');

        const windowLayoutResult = Dimensions.get('window');
        const [menuLayoutResult, anchorLayoutResult] = await Promise.all([
            measureMenuLayout(),
            measureAnchorLayout(),
        ]);

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


        const webMarginX = Platform.OS === 'web' ? (windowLayout.width - 450) / 2 : 0;
        const webMarginY = Platform.OS === 'web' ? (windowLayout.height - 900) / 2 : 0;
        const _left = anchorLayoutResult.x - webMarginX;

        if (Platform.OS === 'web') {
            // For some reason the left value is always in relation to the 450x900 viewport
            // But the top value is relative to window top

            setLeft(anchorLayoutResult.x - webMarginX);
            setTop(anchorLayoutResult.y - webMarginY);

            const _right = 450 - _left - anchorLayoutResult.width;
            // console.log('_right', _right)
            setRight(_right);
        } else {
            setLeft(anchorLayoutResult.x);
            setTop(anchorLayoutResult.y);
            setRight(windowLayout.width - _left - anchorLayoutResult.width);
        }

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
    }, [anchor, attachListeners, measureAnchorLayout, theme]);

    const hide = useCallback(() => {
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
    }, [removeListeners, theme]);

    const updateVisibility = useCallback(
        async (display: boolean) => {
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
        },
        [hide, show, rendered]
    );

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


    const stopPropagation = (event: any) => {
        event.nativeEvent.stopHandling = true;
        // console.log('stopPropagation: Tapped inside component.');
    };

    return (
        <View>
            <View ref={(ref) => (anchorRef.current = ref)} collapsable={false}>
                {anchor == null ? null : anchor}
            </View>
            {
                visible &&
                <>
                    <RenderInPortal>
                        <TapGestureHandler onActivated={onDismiss} numberOfTaps={1}>
                            <View style={{
                                width: '100%',
                                height:'100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)'
                            }} >
                                <View

                                    ref={(ref) => (menuRef.current = ref)}

                                    style={[
                                        {
                                            position: 'absolute',
                                            top: top,
                                            left: left,
                                            right: right,
                                            backgroundColor: theme.backgroundColor,
                                            zIndex: 110000,
                                            borderRadius: roundness,
                                        },
                                        contentStyle,
                                        v3Shadow(3),
                                    ] as StyleProp<ViewStyle>}
                                >
                                    {children}
                                </View>
                            </View>
                        </TapGestureHandler>
                    </RenderInPortal>
                </>
            }
        </View>
    );
};

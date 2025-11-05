import * as React from 'react';
import {
    Text, StyleProp, StyleSheet, ViewStyle, View, ActivityIndicator, Platform, StatusBar
} from 'react-native';
import {useEffect, useState} from "react";
import {usePrevious} from "@nex/data/hooks";
import { useAppTheme } from '@app/theming';
import { Button } from '@app/components/button';
import { v3Shadow } from '@app/components/shadow';
import { SafeAreaView } from '@/src/components/uniwind/safe-area-context';;
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming, interpolate,
} from "react-native-reanimated";
import {scheduleOnRN} from "react-native-worklets";

type Props = React.ComponentProps<typeof View> & {
    visible: boolean;
    actions?: {
        label: string;
        accessibilityLabel?: string;
        onPress: () => void;
    }[];
    onDismiss: () => void;
    children: React.ReactNode;
    wrapperStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    ref?: React.RefObject<View>;
    working?: boolean;
};


export default function Snackbar(props: Props) {
    const {
        children,
        visible,
        actions,
        onDismiss,
        style,
        wrapperStyle,
        working,
        ...rest
    } = props;

    const theme = useAppTheme();
    const dark = theme.dark;
    const roundness = 4;
    const colors = dark ? {
        "accent": "#3498db",
        "onSurface": "#FFFFFF",
        "surface": "#121212",
    } : {
        "accent": "#3498db",
        "onSurface": "#000000",
        "surface": "#ffffff",
    }

    const opacity = useSharedValue(0);
    const [hidden, setHidden] = useState(!visible);
    const prevVisible = usePrevious(visible);

    useEffect(() => {
        if (visible === prevVisible) return;
        if (visible) {
            show();
        }
        if (!visible) {
            hide();
        }
    }, [visible]);

    const show = () => {
        setHidden(false);
        opacity.value = withTiming(1, { duration: 200 });
    };

    const hide = () => {
        opacity.value = withTiming(0, { duration: 100 }, (finished) => {
            if (finished) {
                scheduleOnRN(setHidden, true);
            }
        });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            borderRadius: roundness,
            opacity: opacity.value,
            transform: [
                {
                    scale: visible
                        ? interpolate(opacity.value, [0, 1], [0.9, 1])
                        : 1,
                },
            ],
            backgroundColor: colors.onSurface,
        };
    }, [visible]);

    if (hidden) {
        return null;
    }

    return (
        <SafeAreaView
            style={[styles.wrapper, wrapperStyle]}
        >
            <Animated.View
                style={
                    [
                        styles.container,
                        animatedStyle,
                        style,
                        v3Shadow(3),
                    ] as StyleProp<ViewStyle>
                }
                {...rest}
            >
                <View
                    className="flex-1 flex-row gap-x-2 items-center justify-between"
                    >
                    {
                        working &&
                        <ActivityIndicator animating size="small" color="#999"/>
                    }
                    <View style={styles.content}>
                        <Text style={{color: colors.surface}}>
                            {children}
                        </Text>
                    </View>
                    {actions ? actions.map(action => (
                        <Button
                            key={action.label}
                            accessibilityLabel={action.accessibilityLabel}
                            onPress={() => {
                                action.onPress();
                                // onDismiss();
                            }}
                        >
                            {action.label}
                        </Button>
                    )) : null}
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        width: '100%',
        pointerEvents: 'box-none',
    },
    container: {
        elevation: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 8,
        borderRadius: 4,
        paddingLeft: 16,
        paddingRight: 8,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        flexWrap: 'wrap',
        flex: 1,
    },
});





// {
//     "dark": true,
//     "roundness": 4,
//     "version": 2,
//     "isV3": false,
//     "colors": {
//     "primary": "#3498db",
//         "accent": "#3498db",
//         "background": "#121212",
//         "surface": "#121212",
//         "error": "#CF6679",
//         "text": "#ffffff",
//         "onSurface": "#FFFFFF",
//         "disabled": "rgba(255, 255, 255, 0.38)",
//         "placeholder": "rgba(255, 255, 255, 0.54)",
//         "backdrop": "rgba(0, 0, 0, 0.5)",
//         "notification": "#ff80ab",
//         "tooltip": "rgba(230, 225, 229, 1)"
// },
//     "fonts": {
//     "regular": {
//         "fontFamily": "Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
//             "fontWeight": "400"
//     },
//     "medium": {
//         "fontFamily": "Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
//             "fontWeight": "500"
//     },
//     "light": {
//         "fontFamily": "Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
//             "fontWeight": "300"
//     },
//     "thin": {
//         "fontFamily": "Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
//             "fontWeight": "100"
//     }
// },
//     "animation": {
//     "scale": 1
// },
//     "mode": "adaptive"
// }

// {
//     "dark": false,
//     "roundness": 4,
//     "version": 2,
//     "isV3": false,
//     "colors": {
//     "primary": "#3498db",
//         "accent": "#3498db",
//         "background": "#f6f6f6",
//         "surface": "#ffffff",
//         "error": "#B00020",
//         "text": "#000000",
//         "onSurface": "#000000",
//         "disabled": "rgba(0, 0, 0, 0.26)",
//         "placeholder": "rgba(0, 0, 0, 0.54)",
//         "backdrop": "rgba(0, 0, 0, 0.5)",
//         "notification": "#f50057",
//         "tooltip": "rgba(28, 27, 31, 1)"
// },
//     "fonts": {
//     "regular": {
//         "fontFamily": "Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
//             "fontWeight": "400"
//     },
//     "medium": {
//         "fontFamily": "Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
//             "fontWeight": "500"
//     },
//     "light": {
//         "fontFamily": "Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
//             "fontWeight": "300"
//     },
//     "thin": {
//         "fontFamily": "Roboto, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
//             "fontWeight": "100"
//     }
// },
//     "animation": {
//     "scale": 1
// }
// }

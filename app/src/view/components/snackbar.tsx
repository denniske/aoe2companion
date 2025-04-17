import * as React from 'react';
import {
    Animated, SafeAreaView, Text, StyleProp, StyleSheet, ViewStyle, View, ActivityIndicator, Platform, StatusBar
} from 'react-native';
import {useEffect, useState} from "react";
import {usePrevious} from "@nex/data/hooks";
import { usePaperTheme } from '@app/theming';
import { Button } from '@app/components/button';

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
    const [opacity, setOpacity] = useState(new Animated.Value(0.0));
    const [hidden, setHidden] = useState(!props.visible);
    const prevVisible = usePrevious(props.visible);

    useEffect(() => {
        if (props.visible === prevVisible) return;
        if (props.visible) {
            show();
        }
        if (!props.visible) {
            hide();
        }
    }, [props.visible]);

    const show = () => {
        // console.log("show");
        setHidden(false);
        const scale = 1;
        Animated.timing(opacity, {
            toValue: 1,
            duration: 200 * scale,
            useNativeDriver: Platform.OS !== 'web',
        }).start(({finished}) => {
            if (finished) {

            }
        });
    };

    const hide = () => {
        const scale = 1;
        Animated.timing(opacity, {
            toValue: 0,
            duration: 100 * scale,
            useNativeDriver: Platform.OS !== 'web',
        }).start(({finished}) => {
            if (finished) {
                setHidden(true);
            }
        });
    };

    const {
        children,
        visible,
        actions,
        onDismiss,
        style,
        wrapperStyle,
        working,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...rest
    } = props;

    const paperTheme = usePaperTheme();
    const dark = paperTheme.dark;
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

    if (hidden) {
        return null;
    }

    return (
        <SafeAreaView
            pointerEvents="box-none"
            style={[styles.wrapper, wrapperStyle]}
        >
            <Animated.View
                // pointerEvents="box-none"
                accessibilityLiveRegion="polite"
                style={
                    [
                        styles.container,
                        {
                            borderRadius: roundness,
                            opacity: opacity,
                            transform: [
                                {
                                    scale: visible
                                        ? opacity.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.9, 1],
                                        })
                                        : 1,
                                },
                            ],
                        },
                        {backgroundColor: colors.onSurface},
                        style,
                        v3Shadow(3),
                    ] as StyleProp<ViewStyle>
                }
                {...rest}
            >
                {
                    working &&
                    <ActivityIndicator style={styles.indicator} animating size="small" color="#999"/>
                }
                <View style={[
                    styles.content,
                    {marginRight: actions ? 0 : 16},
                ]}>
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
                        style={styles.button}
                    >
                        {action.label}
                    </Button>
                )) : null}
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    indicator: {
        marginRight: 10,
    },
    wrapper: {
        position: 'absolute',
        top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        width: '100%',
    },
    container: {
        elevation: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 8,
        borderRadius: 4,
        paddingLeft: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginLeft: 16,
        marginVertical: 15,
        // minHeight: 30,
        flexWrap: 'wrap',
        flex: 1,
    },
    button: {
        marginHorizontal: 8,
        marginVertical: 6,
    },
});

const MD3_SHADOW_OPACITY = 0.3;
const MD3_SHADOW_COLOR = 'rgba(0, 0, 0, 1)';

function v3Shadow(elevation: number | Animated.Value = 0) {
    const inputRange = [0, 1, 2, 3, 4, 5];
    const shadowHeight = [0, 1, 2, 4, 6, 8];
    const shadowRadius = [0, 3, 6, 8, 10, 12];

    if (elevation instanceof Animated.Value) {
        return {
            shadowColor: MD3_SHADOW_COLOR,
            shadowOffset: {
                width: new Animated.Value(0),
                height: elevation.interpolate({
                    inputRange,
                    outputRange: shadowHeight,
                }),
            },
            shadowOpacity: elevation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, MD3_SHADOW_OPACITY],
                extrapolate: 'clamp',
            }),
            shadowRadius: elevation.interpolate({
                inputRange,
                outputRange: shadowRadius,
            }),
        };
    } else {
        return {
            shadowColor: MD3_SHADOW_COLOR,
            shadowOpacity: elevation ? MD3_SHADOW_OPACITY : 0,
            shadowOffset: {
                width: 0,
                height: shadowHeight[elevation],
            },
            shadowRadius: shadowRadius[elevation],
        };
    }
}




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

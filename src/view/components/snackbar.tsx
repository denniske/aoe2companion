import * as React from 'react';
import {Animated, SafeAreaView, StyleProp, StyleSheet, ViewStyle, View} from 'react-native';
import {Button, Surface, Theme, Text, withTheme} from "react-native-paper";
import {useEffect, useState} from "react";

type Props = React.ComponentProps<typeof Surface> & {
    visible: boolean;
    action?: {
        label: string;
        accessibilityLabel?: string;
        onPress: () => void;
    };
    onDismiss: () => void;
    children: React.ReactNode;
    wrapperStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    ref?: React.RefObject<View>;
    theme: Theme;
};

function Snackbar(props: Props) {

    const [opacity, setOpacity] = useState(new Animated.Value(0.0));
    const [hidden, setHidden] = useState(!props.visible);

    useEffect(() => {
        if (props.visible) {
            show();
        }
    }, []);

    // componentDidUpdate(prevProps: Props) {
    //     if (prevProps.visible !== props.visible) {
    //         toggle();
    //     }
    // }
    //
    // componentWillUnmount() {
    //     if (hideTimeout) {
    //         clearTimeout(hideTimeout);
    //     }
    // }

    // private toggle = () => {
    //     if (props.visible) {
    //         show();
    //     } else {
    //         hide();
    //     }
    // };

    const show = () => {
        setHidden(false);
        const {scale} = props.theme.animation;
        Animated.timing(opacity, {
            toValue: 1,
            duration: 200 * scale,
            useNativeDriver: true,
        }).start(({finished}) => {
            if (finished) {

            }
        });
    };

    const hide = () => {
        const {scale} = props.theme.animation;
        Animated.timing(opacity, {
            toValue: 0,
            duration: 100 * scale,
            useNativeDriver: true,
        }).start(({finished}) => {
            if (finished) {
                setHidden(true);
            }
        });
    };

    const {
        children,
        visible,
        action,
        onDismiss,
        theme,
        style,
        wrapperStyle,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...rest
    } = props;
    const {colors, roundness, dark} = theme;

    console.log("theme dark:", dark);

    if (hidden) {
        return null;
    }

    return (
        <SafeAreaView
            pointerEvents="box-none"
            style={[styles.wrapper, wrapperStyle]}
        >
            <Surface
                pointerEvents="box-none"
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
                    ] as StyleProp<ViewStyle>
                }
                {...rest}
            >
                <Text
                    style={[
                        styles.content,
                        {marginRight: action ? 0 : 16, color: colors.surface},
                    ]}
                >
                    {children}
                </Text>
                {action ? (
                    <Button
                        accessibilityLabel={action.accessibilityLabel}
                        onPress={() => {
                            action.onPress();
                            onDismiss();
                        }}
                        style={styles.button}
                        color={colors.accent}
                        compact
                        mode="text"
                    >
                        {action.label}
                    </Button>
                ) : null}
            </Surface>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0,
        width: '100%',
    },
    container: {
        elevation: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 8,
        borderRadius: 4,
    },
    content: {
        marginLeft: 16,
        marginVertical: 14,
        flexWrap: 'wrap',
        flex: 1,
    },
    button: {
        marginHorizontal: 8,
        marginVertical: 6,
    },
});

export default withTheme(Snackbar);

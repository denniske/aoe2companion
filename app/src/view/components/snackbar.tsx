import * as React from 'react';
import {
    Animated, SafeAreaView, StyleProp, StyleSheet, ViewStyle, View, ActivityIndicator, Platform, StatusBar
} from 'react-native';
import {Button, Surface, Text, withTheme} from "react-native-paper";
import {useEffect, useState} from "react";
import {usePrevious} from "@nex/data/hooks";

type Props = React.ComponentProps<typeof Surface> & {
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
    theme: any;
    working?: boolean;
};

function Snackbar(props: Props) {
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
        const {scale} = props.theme.animation;
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
        const {scale} = props.theme.animation;
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
        theme,
        style,
        wrapperStyle,
        working,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ...rest
    } = props;
    const {colors, roundness, dark} = theme;

    if (hidden) {
        return null;
    }

    return (
        <SafeAreaView
            pointerEvents="box-none"
            style={[styles.wrapper, wrapperStyle]}
        >
            <Surface
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
                        color={colors.accent}
                        compact
                        mode="text"
                    >
                        {action.label}
                    </Button>
                )) : null}
            </Surface>
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

export default withTheme(Snackbar);

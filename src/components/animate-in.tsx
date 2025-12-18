import { PropsWithChildren, useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import cn from 'classnames';

export const AnimateIn: React.FC<PropsWithChildren<{ skipFirstAnimation?: boolean }>> = ({ children, skipFirstAnimation }) => {
    const [hasFirstAnimationRun, setHasFirstAnimationRun] = useState(false);
    const canHaveAnimationStyles = hasFirstAnimationRun || !skipFirstAnimation;
    const height = useSharedValue(32);
    const opacity = useSharedValue(0);

    const style = useAnimatedStyle(() => {
        return {
            height: height.value,
            opacity: opacity.value
        };
    });

    useEffect(() => {
        console.log('mount')
    }, [])

    return (
        <Animated.View
            style={[
                {
                    position: 'relative',
                    overflow: 'hidden',
                    margin: -16,
                },
                canHaveAnimationStyles && style,
            ]}
        >
            <View
                className={cn(canHaveAnimationStyles ? 'absolute top-4 left-4 right-4' : 'p-4')}
                onLayout={(e) => {
                    if (skipFirstAnimation && !hasFirstAnimationRun) {
                        height.value = e.nativeEvent.layout.height + 32;
                        opacity.value = e.nativeEvent.layout.height > 32 ? 1 : 0;
                        setHasFirstAnimationRun(true);
                    } else {
                        height.value = withTiming(e.nativeEvent.layout.height + 32, { duration: 250 });
                        opacity.value = withTiming(e.nativeEvent.layout.height > 32 ? 1 : 0, { duration: 250 });
                    }
                }}
            >
                {children}
            </View>
        </Animated.View>
    );
};

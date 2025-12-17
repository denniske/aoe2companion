import { PropsWithChildren, useState } from 'react';
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import cn from 'classnames';

export const AnimateIn: React.FC<PropsWithChildren<{ skipFirstAnimation?: boolean }>> = ({ children, skipFirstAnimation }) => {
    const [hasFirstAnimationRun, setHasFirstAnimationRun] = useState(false);
    const canHaveAnimationStyles = hasFirstAnimationRun || !skipFirstAnimation;
    const height = useSharedValue(0);
    const opacity = useSharedValue(0);

    const style = useAnimatedStyle(() => {
        return {
            height: height.value,
            opacity: opacity.value,
        };
    });

    return (
        <Animated.View
            style={[
                {
                    position: 'relative',
                },
                canHaveAnimationStyles && style,
            ]}
        >
            <View
                className={cn(canHaveAnimationStyles && 'absolute top-0 left-0 right-0')}
                onLayout={(e) => {
                    if (skipFirstAnimation && !hasFirstAnimationRun) {
                        height.value = e.nativeEvent.layout.height;
                        opacity.value = e.nativeEvent.layout.height > 0 ? 1 : 0;
                        setHasFirstAnimationRun(true);
                    } else {
                        height.value = withTiming(e.nativeEvent.layout.height, { duration: 250 });
                        opacity.value = withTiming(e.nativeEvent.layout.height > 0 ? 1 : 0, { duration: 250 });
                    }
                }}
            >
                {children}
            </View>
        </Animated.View>
    );
};

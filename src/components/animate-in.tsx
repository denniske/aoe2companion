import { PropsWithChildren, useState } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import cn from 'classnames';

export const AnimateIn: React.FC<PropsWithChildren<{ skipFirstAnimation?: boolean }>> = ({ children, skipFirstAnimation }) => {
    const [hasFirstAnimationRun, setHasFirstAnimationRun] = useState(false);
    const canHaveAnimationStyles = hasFirstAnimationRun || !skipFirstAnimation;
    const height = useSharedValue(0);

    const style = useAnimatedStyle(() => {
        return {
            height: height.value,
        };
    });

    return (
        <Animated.View
            style={[
                {
                    position: 'relative',
                    overflow: 'hidden',
                },
                canHaveAnimationStyles && style,
            ]}
        >
            <View
                className={cn(canHaveAnimationStyles && 'absolute top-0 left-0 right-0')}
                onLayout={(e) => {
                    if (skipFirstAnimation && !hasFirstAnimationRun) {
                        height.value = e.nativeEvent.layout.height;
                        setHasFirstAnimationRun(true);
                    } else {
                        height.value = withTiming(e.nativeEvent.layout.height, { duration: 250 });
                    }
                }}
            >
                {children}
            </View>
        </Animated.View>
    );
};

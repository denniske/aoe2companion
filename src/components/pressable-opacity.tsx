import { forwardRef } from 'react';
import { Pressable, PressableProps, View } from 'react-native';

export interface PressableOpacityProps extends PressableProps {
    className?: string;
}

/**
 * A more performant drop-in replacement for TouchableOpacity.
 *
 * TouchableOpacity animates its opacity on the JS thread via Animated, which
 * costs a bridge roundtrip per press. This applies the pressed opacity through
 * uniwind's `active:` variant instead, so the style change happens without any
 * JS-driven animation.
 */
export const PressableOpacity = forwardRef<View, PressableOpacityProps>(({ className, ...props }, ref) => {
    return <Pressable ref={ref} className={`active:opacity-20 ${className ?? ''}`} {...props} />;
});

PressableOpacity.displayName = 'PressableOpacity';

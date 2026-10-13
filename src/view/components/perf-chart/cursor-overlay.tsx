import React, { useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { type SharedValue, useAnimatedProps, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';

export interface CursorLookup {
    /** Pixel x of every distinct x value across the series, ascending. */
    xs: number[];
    /** Header label per entry of `xs`. */
    xLabels: string[];
    /** Per series, the row text per entry of `xs` ('' hides the row there). */
    rows: { id: string; color: string; texts: string[] }[];
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ROW_PADDING_X = 9;

/**
 * Hover cursor: a vertical rule and a stack of value plates.
 *
 * Deliberately *not* Skia. A Skia canvas repaints its whole scene every frame,
 * so drawing the cursor beside the series meant re-rasterizing thousands of
 * points per pointer move. As plain views the chart canvas is never touched.
 *
 * Nothing here uses React state either: the pointer position lives in a shared
 * value and every visual is an animated style/prop applied on the UI thread.
 * Label text is formatted up front (date-fns is not worklet-safe) and indexed
 * from a worklet.
 */
export function CursorOverlay({
    lookup,
    bounds,
    dark,
}: {
    lookup: CursorLookup;
    bounds: { left: number; right: number; top: number; bottom: number };
    dark: boolean;
}) {
    // The only piece of hover state. -1 means "pointer is away".
    const cursorX = useSharedValue(-1);
    // Written from onLayout, so the flip near the right edge needs no manual
    // text measurement — layout reports the real width.
    const boxWidth = useSharedValue(0);

    const overlayRef = useRef<View | null>(null);

    useEffect(() => {
        // Listen on the document and resolve our own node at event time. Binding
        // to the container directly needs its ref to be populated when the effect
        // runs, which it is not — the listener then never attaches and the cursor
        // silently does nothing. `document` is absent on native, where hover does
        // not apply anyway.
        if (typeof document === 'undefined') return;

        const onMove = (event: PointerEvent) => {
            const node = overlayRef.current as unknown as HTMLElement | null;
            if (!node) return;

            const rect = node.getBoundingClientRect();
            const inside =
                event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;

            cursorX.value = inside ? event.clientX - rect.left : -1;
        };

        document.addEventListener('pointermove', onMove);
        return () => document.removeEventListener('pointermove', onMove);
    }, [cursorX]);

    const { xs, xLabels, rows } = lookup;
    const { left, right, top, bottom } = bounds;

    // Index of the most recent datum at or before the pointer.
    const index = useDerivedValue(() => {
        const x = cursorX.value;
        if (x < left || x > right || xs.length === 0) return -1;

        let lo = 0;
        let hi = xs.length - 1;
        let found = -1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (xs[mid]! <= x) {
                found = mid;
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return found;
    }, [xs, left, right]);

    const ruleStyle = useAnimatedStyle(() => ({
        opacity: index.value >= 0 ? 1 : 0,
        transform: [{ translateX: cursorX.value }],
    }));

    const boxStyle = useAnimatedStyle(() => {
        // Flip to the left of the rule near the right edge so it stays inside.
        const width = boxWidth.value;
        const x = cursorX.value + width > right ? cursorX.value - width + 1 : cursorX.value + 1;
        return {
            opacity: index.value >= 0 ? 1 : 0,
            transform: [{ translateX: x }],
        };
    }, [right]);

    const headerProps = useAnimatedProps(() => ({ text: index.value >= 0 ? xLabels[index.value]! : '' }) as never, [xLabels]);

    return (
        <View ref={overlayRef} pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        left: 0,
                        top,
                        width: 1,
                        height: Math.max(0, bottom - top),
                        backgroundColor: dark ? '#DDDDDD' : '#222222',
                    },
                    ruleStyle,
                ]}
            />

            <Animated.View
                onLayout={(event) => {
                    boxWidth.value = event.nativeEvent.layout.width;
                }}
                style={[{ position: 'absolute', left: 0, top, alignItems: 'flex-start' }, boxStyle]}
            >
                <AnimatedLabel animatedProps={headerProps} background={dark ? '#111111' : '#1A1A1A'} fallback={xLabels[0] ?? ''} />

                {rows.map((row) => (
                    <CursorRow key={row.id} color={row.color} texts={row.texts} index={index} />
                ))}
            </Animated.View>
        </View>
    );
}

/** One series row of the hover plate. Own component so it can own its hooks. */
function CursorRow({ color, texts, index }: { color: string; texts: string[]; index: SharedValue<number> }) {
    const animatedProps = useAnimatedProps(() => ({ text: index.value >= 0 ? texts[index.value]! : '' }) as never, [texts]);

    return <AnimatedLabel animatedProps={animatedProps} background={color} fallback={texts[0] ?? ''} />;
}

/**
 * A text plate whose content is driven from the UI thread.
 *
 * Uses TextInput rather than Text because only TextInput exposes a `text` prop
 * that Reanimated can set natively — the standard way to animate text content
 * without a React render.
 */
function AnimatedLabel({
    animatedProps,
    background,
    fallback,
}: {
    animatedProps: ReturnType<typeof useAnimatedProps>;
    background: string;
    fallback: string;
}) {
    return (
        <AnimatedTextInput
            editable={false}
            defaultValue={fallback}
            animatedProps={animatedProps}
            style={{
                backgroundColor: background,
                color: '#FFFFFF',
                fontSize: 11,
                lineHeight: 14,
                paddingHorizontal: ROW_PADDING_X,
                paddingVertical: 4,
                borderWidth: 0,
                alignSelf: 'stretch',
            }}
        />
    );
}

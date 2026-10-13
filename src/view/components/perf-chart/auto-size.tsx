import React, { useState } from 'react';
import { View, type ViewProps } from 'react-native';

/**
 * Measures the box it is given and hands the size to `children`, which only
 * renders once both sides are known. PerfChart draws at an explicit pixel size,
 * so this is how it fills a flex layout.
 */
export function AutoSize({
    children,
    ...props
}: Omit<ViewProps, 'children'> & { children: (size: { width: number; height: number }) => React.ReactNode }) {
    const [size, setSize] = useState({ width: 0, height: 0 });
    return (
        <View
            {...props}
            onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
            }}
        >
            {size.width > 0 && size.height > 0 ? children(size) : null}
        </View>
    );
}

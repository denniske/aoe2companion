import type { ImageSourceProp } from '@app/components/uniwind/image';
import { StyleProp, View, ViewStyle } from 'react-native';
import React from 'react';
import { Button } from '@app/components/button';
import { TextColor, textColors } from '@app/utils/text.util';
import { useResolveClassNames } from 'uniwind';


interface IPickerProps<T> {
    value?: T;
    values: T[];
    formatter?: (value: T, props: { color: string }) => string;
    image?: (value: T) => ImageSourceProp;
    onSelect: (value: T) => void;
    style?: StyleProp<ViewStyle>;
    flex?: boolean;
    /** Let the buttons wrap onto more rows instead of running past the screen edge. */
    wrap?: boolean;
    className?: string;
    disabled?: boolean;
}

// Hoisted rather than written inline as a default value: React Compiler cannot
// reorder an arrow function used as a destructuring default, and bails out on the
// whole component. Also saves re-creating it on every render.
const defaultFormatter = (value: unknown) => `${value}`;

// HMR reload breaks this component at least in tech tree. Why?
export default function ButtonPicker<T>(props: IPickerProps<T>) {
    const { value, values, onSelect, image, style, flex = false, wrap = false, className = '', disabled, formatter = defaultFormatter } = props;

    return (
        <View className={`rounded-lg overflow-hidden flex-row ${wrap ? 'flex-wrap' : ''} ${className} bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800`}>
            {
                values!.map((val, i) => {
                    const selected = val == value;
                    return (
                        <Button
                            key={i}
                            image={image?.(val)}
                            className={`py-2 ${flex ? `flex-1` : wrap ? `px-4 grow` : `px-6`} justify-center ${selected ? '' : 'bg-transparent dark:bg-transparent hover:bg-white/50! dark:hover:bg-black/50!'}`}
                            onPress={() => onSelect(val)}
                            color={selected ? 'white' : 'subtle'}
                            disabled={disabled}
                        >
                            {formatter(val, { color: selected ? 'white' : 'subtle' })}
                        </Button>
                    );
                }
                )
            }
        </View>
    );
}

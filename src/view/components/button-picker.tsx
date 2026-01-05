import { ImageSourcePropType, StyleProp, View, ViewStyle } from 'react-native';
import React from 'react';
import { Button } from '@app/components/button';
import { TextColor, textColors } from '@app/utils/text.util';
import { useResolveClassNames } from 'uniwind';


interface IPickerProps<T> {
    value?: T;
    values: T[];
    formatter?: (value: T, inList?: boolean) => string;
    image?: (value: T) => ImageSourcePropType;
    onSelect: (value: T) => void;
    style?: StyleProp<ViewStyle>;
    flex?: boolean;
    disabled?: boolean;
}

// HMR reload breaks this component at least in tech tree. Why?
export default function ButtonPicker<T>(props: IPickerProps<T>) {
    const { value, values, onSelect, image, style, flex = false, disabled, formatter = (x) => `${x}` } = props;

    return (
        <View className="rounded-lg overflow-hidden flex-row bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            {
                values!.map((val, i) => {
                    const selected = val == value;
                    return (
                        <Button
                            key={i}
                            image={image?.(val)}
                            className={`py-2 ${flex ? `flex-1` : `px-6`} justify-center ${selected ? '' : 'bg-transparent dark:bg-transparent hover:bg-white/50! dark:hover:bg-black/50!'}`}
                            onPress={() => onSelect(val)}
                            color={selected ? 'white' : 'subtle'}
                            disabled={disabled}
                        >
                            {formatter(val)}
                        </Button>
                    );
                }
                )
            }
        </View>
    );
}

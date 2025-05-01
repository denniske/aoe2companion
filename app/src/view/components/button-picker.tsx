import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import React from "react";
import { Button } from '@app/components/button';
import tw from '@app/tailwind';
import { textColors } from '@app/utils/text.util';


interface IPickerProps<T> {
    value?: T;
    values: T[];
    formatter?: (value: T, inList?: boolean) => string;
    onSelect: (value: T) => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

// HMR reload breaks this component at least in tech tree. Why?
export default function ButtonPicker<T>(props: IPickerProps<T>) {
    const { value, values, onSelect, style, disabled, formatter = (x) => `${x}`} = props;

    return (
        <View className="rounded-lg overflow-hidden flex-row bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            {
                values!.map((val, i) => {
                    const selected = val == value;
                    return (
                        <Button
                            key={i}
                            className={`py-2 px-6 justify-center ${selected ? '' : 'bg-transparent'}`}
                            onPress={() => onSelect(val)}
                            textStyle={tw.style(selected ? 'text-white' : textColors.subtle)}
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

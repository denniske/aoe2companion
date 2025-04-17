import { Button } from '@app/components/button';
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import React from "react";
import {useAppTheme, usePaperTheme} from "../../theming";
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

export default function ButtonPicker<T>(props: IPickerProps<T>) {
    const paperTheme = usePaperTheme();
    const theme = useAppTheme();

    const { value, values, onSelect, style, disabled, formatter = (x) => `${x}`} = props;

    return (
        <View className="rounded-lg overflow-hidden flex-row bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        {
                values!.map((val, i) =>
                    <ButtonPickerItem key={i} v={val} i={i} {...props}></ButtonPickerItem>
                )
            }
        </View>
    );
}

const ButtonPickerItem = <T,>({ v, i, value, values, onSelect, formatter }: IPickerProps<T> & { v: T, i: number }) => {
    const paperTheme = usePaperTheme();
    const theme = useAppTheme();

    let style: ViewStyle = {};
    const first = i === 0;
    const last = i === values.length - 1;
    const selected = v == value;
    if (!first) {
        style.borderTopLeftRadius = 0;
        style.borderBottomLeftRadius = 0;
    }
    if (!last) {
        style.borderTopRightRadius = 0;
        style.borderBottomRightRadius = 0;
    }
    return (
        <Button
            key={i}
            align="center"
            className={`flex-1 p-2 px-6 justify-center ${selected ? '' : 'bg-transparent'}`}
            onPress={() => onSelect(v)}
            textStyle={tw.style(selected ? 'text-white' : textColors.subtle)}
        >
            {formatter?.(v)}
        </Button>
    );
};

const styles = StyleSheet.create({
    row: {
        // backgroundColor: 'green',
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        // backgroundColor: 'red',
        maxWidth: 160,
    },
});

import {Button, TouchableRipple} from "react-native-paper";
import {StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle} from "react-native";
import React from "react";
import {useAppTheme, usePaperTheme} from "../../theming";


interface IPickerProps<T> {
    value?: T;
    values: T[];
    template?: (value: T, selected: boolean) => React.ReactNode;
    onSelect: (value: T) => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

export default function TemplatePicker<T>(props: IPickerProps<T>) {
    const paperTheme = usePaperTheme();
    const theme = useAppTheme();

    const { value, values, onSelect, style, disabled, template = (x) => x} = props;

    const renderItem = (v: T, i: number) => {
        let style: ViewStyle = {};
        const selected = v == value;
        style.borderTopLeftRadius = 5;
        style.borderBottomLeftRadius = 5;
        style.borderTopRightRadius = 5;
        style.borderBottomRightRadius = 5;
        style.paddingVertical = 5;
        return (
            <TouchableHighlight
                key={i}
                style={[style]}
                onPress={() => onSelect(v)}
                underlayColor={theme.hoverBackgroundColor}
            >
                {template(v, selected)}
            </TouchableHighlight>
        );
    };

    return (
        <View style={[styles.row, style]}>
            {values!.map((val, i) => renderItem(val, i))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        // backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        // backgroundColor: 'red',
        maxWidth: 160,
    },
});

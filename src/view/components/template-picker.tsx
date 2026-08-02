import {StyleProp, StyleSheet, TouchableHighlight, View, ViewStyle} from "react-native";
import {useAppTheme} from "../../theming";
import {ReactNode} from "react";


interface IPickerProps<T> {
    value?: T;
    values: T[];
    template?: (value: T, selected: boolean) => ReactNode;
    onSelect: (value: T) => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

// Hoisted rather than written inline as a default value: React Compiler cannot
// reorder an arrow function used as a destructuring default, and bails out on the
// whole component. Also saves re-creating it on every render.
const defaultTemplate = (value: unknown) => value as ReactNode;

export default function TemplatePicker<T>(props: IPickerProps<T>) {
    const theme = useAppTheme();

    const { value, values, onSelect, style, disabled, template = defaultTemplate } = props;

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
                {template(v, selected) as any}
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

import {Button} from "react-native-paper";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import React from "react";
import {useAppTheme, usePaperTheme} from "../../theming";


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

    const renderItem = (v: T, i: number) => {
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
                labelStyle={{fontSize: 13, marginVertical: 6}}
                style={style}
                onPress={() => onSelect(v)}
                mode="contained"
                compact
                uppercase={false}
                dark={true}
                buttonColor={selected ? paperTheme.colors.primary : theme.lightBackgroundColor}
            >
                {formatter(v)}
            </Button>
        );
    };

    return (
        <View style={[styles.row, style]}>
            {
                values!.map((val, i) =>
                    <ButtonPickerItem key={i} v={val} i={i} {...props}></ButtonPickerItem>
                )
            }
            {/*{values!.map((val, i) => renderItem(val, i))}*/}
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
            labelStyle={{ fontSize: 13, marginVertical: 6 }}
            style={style}
            onPress={() => onSelect(v)}
            mode="contained"
            compact
            uppercase={false}
            dark={true}
            buttonColor={selected ? paperTheme.colors.primary : theme.lightBackgroundColor}
        >
            {formatter(v)}
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

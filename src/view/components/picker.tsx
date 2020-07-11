import {Menu} from "react-native-paper";
import {StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from "react-native";
import {MyText} from "./my-text";
import Icon from "react-native-vector-icons/FontAwesome";
import React, {useState} from "react";
import {usePaperTheme} from "../theming";

interface IPickerProps<T> {
    value: T;
    values: T[];
    formatter: (value: T) => string;
    onSelect: (value: T) => void;
    style?: StyleProp<ViewStyle>;
}

export default function Picker<T>(props: IPickerProps<T>) {
    const theme = usePaperTheme();
    const [menu, setMenu] = useState(false);

    const { value, values, onSelect, style, formatter = (x) => x } = props;

    return (
        <View style={[style]}>
            <Menu
                contentStyle={{marginLeft: -5, marginTop: -10}}
                visible={menu}
                onDismiss={() => setMenu(false)}
                anchor={
                    <TouchableOpacity style={[styles.anchor]} onPress={() => setMenu(true)}>
                        <View style={styles.row}>
                            <MyText style={styles.text}>{formatter(value)}</MyText>
                            <Icon style={styles.handle} name="chevron-down" color={theme.colors.text} size={12} />
                        </View>
                    </TouchableOpacity>
                }
            >
                {
                    values.map((v, i) =>
                        <Menu.Item titleStyle={[styles.menuItem, {fontWeight: v == value ? 'bold' : 'normal'}]}
                                   onPress={() => { onSelect(v); setMenu(false); }} title={formatter(v)} key={i} />
                    )
                }
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        fontSize: 14,
    },
    anchor: {
        // backgroundColor: 'blue',
        flexDirection: 'row',
    },
    row: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        padding: 12,
    },
    handle: {
        marginLeft: 0,
    },
});

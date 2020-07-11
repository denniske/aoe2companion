import {Menu} from "react-native-paper";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {MyText} from "./my-text";
import Icon from "react-native-vector-icons/FontAwesome";
import React, {useState} from "react";
import {usePaperTheme} from "../theming";

interface IPickerProps {
    value: string;
    values: string[];
    onSelect: (value: string) => void;
}

export default function Picker(props: IPickerProps) {
    const theme = usePaperTheme();
    const [menu, setMenu] = useState(false);

    const { value, values, onSelect } = props;

    return (
        <Menu
            contentStyle={{marginLeft: -5, marginTop: -10}}
            visible={menu}
            onDismiss={() => setMenu(false)}
            anchor={
                <TouchableOpacity style={styles.anchor} onPress={() => setMenu(true)}>
                    <View style={styles.row}>
                        <MyText style={styles.text}>{value}</MyText>
                        <Icon style={styles.handle} name="chevron-down" color={theme.colors.text} size={12} />
                    </View>
                </TouchableOpacity>
            }
        >
            {
                values.map(v =>
                    <Menu.Item titleStyle={[styles.menuItem, {fontWeight: v == value ? 'bold' : 'normal'}]}
                               onPress={() => { onSelect(v); setMenu(false); }} title={v} key={v} />
                )
            }
        </Menu>
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

import {Divider, Menu} from "react-native-paper";
import {Dimensions, FlatList, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from "react-native";
import {MyText} from "./my-text";
import Icon from "react-native-vector-icons/FontAwesome";
import React, {useState} from "react";
import {usePaperTheme} from "../../theming";

interface IPickerProps<T> {
    value?: T;
    values: T[];
    formatter: (value: T, inList?: boolean) => string;
    icon?: (value: T) => React.ReactNode;
    divider?: (value: T, index?: number) => boolean;
    cell?: (props: {}) => React.ReactNode;
    onSelect: (value: T) => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    flatlist?: boolean;
}


function defaultCell(props: any) {
    const {value, color, icon, formatter, selected} = props;
    return (
        <View style={styles.row}>
            {icon && icon(value)}
            <MyText numberOfLines={1} style={[styles.text, { color: color, fontWeight: selected ? 'bold' : 'normal' }]}>{formatter(value)}</MyText>
        </View>
    );
}

export default function Picker<T>(props: IPickerProps<T>) {
    const theme = usePaperTheme();
    const [menu, setMenu] = useState(false);

    const { value, values, onSelect, style, disabled, formatter = (x) => x, icon = x => undefined, cell = defaultCell, divider = x => false, flatlist = false } = props;

    const color = disabled ? theme.colors.disabled : theme.colors.text;

    const renderItem = (v: T, i: number) => (
        <View key={i}>
            <TouchableOpacity onPress={() => {onSelect(v); setMenu(false);}} disabled={disabled}>
                <View style={styles.menuItem}>
                    {cell({value: v, selected: v == value, formatter: (x: any, i: any) => formatter(x, true), color, icon})}
                </View>
            </TouchableOpacity>
            {
                divider && divider(v, i) &&
                <Divider/>
            }
        </View>
    );

    return (
        <View style={[style]}>
            <Menu
                contentStyle={{marginLeft: -5, marginTop: -10}}
                visible={menu}
                onDismiss={() => setMenu(false)}
                anchor={
                    <TouchableOpacity style={[styles.anchor]} onPress={() => setMenu(true)} disabled={disabled}>
                        <View style={styles.row}>
                            {cell({value, formatter: (x: any, i: any) => formatter(x, false), color, icon})}
                            <Icon style={styles.handle} name="chevron-down" color={color} size={12} />
                        </View>
                    </TouchableOpacity>
                }
            >
                {
                    flatlist &&
                    <FlatList
                        keyboardShouldPersistTaps={'always'}
                        data={values}
                        style={{height: Dimensions.get('screen').height-200}}
                        renderItem={({v, i}: any) => renderItem(v, i)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                }
                {
                    !flatlist && values.map(renderItem)
                }
                {/*{*/}
                {/*    values.map((v, i) =>*/}
                {/*        <Menu.Item titleStyle={[styles.menuItem, {fontWeight: v == value ? 'bold' : 'normal'}]}*/}
                {/*                   onPress={() => { onSelect(v); setMenu(false); }} title={formatter(v)} key={i} />*/}
                {/*    )*/}
                {/*}*/}
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        // backgroundColor: 'yellow',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    anchor: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
    },
    row: {
        // backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        // backgroundColor: 'red',
        maxWidth: 160,
        paddingHorizontal: 5,
    },
    handle: {
        marginLeft: 4,
        paddingBottom: 2,
    },
});

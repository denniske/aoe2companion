import {Divider, Menu} from "react-native-paper";
import {
    Dimensions, FlatList, FlatListProps, SectionList, SectionListData, StyleProp, StyleSheet, Text, TouchableOpacity,
    View,
    ViewStyle
} from "react-native";
import {MyText} from "./my-text";
import Icon from "react-native-vector-icons/FontAwesome";
import React, {useState} from "react";
import {usePaperTheme} from "../../theming";

interface IPickerProps<T> {
    value?: T;
    values?: T[];
    sections?: SectionListData<T>[];
    formatter: (value: T, inList?: boolean) => string;
    sectionFormatter?: (value: string) => string;
    icon?: (value: T, inList?: boolean) => React.ReactNode;
    divider?: (value: T, index: number) => boolean;
    cell?: (props: {}) => React.ReactNode;
    onSelect: (value: T) => void;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    container?: 'flatlist' | 'sectionlist';
    textMinWidth?: number;
    itemHeight?: number;
}


function defaultCell(props: any) {
    const {value, color, icon, formatter, selected, textMinWidth} = props;
    return (
        <View style={styles.row}>
            {icon && icon(value)}
            <View style={styles.row}>
                <MyText numberOfLines={1} style={[styles.text, { minWidth: textMinWidth, color: color, fontWeight: selected ? 'bold' : 'normal' }]}>{formatter(value)}</MyText>
            </View>
        </View>
    );
}

export default function  Picker<T>(props: IPickerProps<T>) {
    const theme = usePaperTheme();
    const [menu, setMenu] = useState(false);

    const { value, values, sections, onSelect, style, disabled,
            formatter = (x) => x, sectionFormatter = (x) => x, icon = x => undefined, cell = defaultCell, divider = x => false, container,
            textMinWidth = 0, itemHeight
    } = props;

    const color = disabled ? theme.colors.disabled : theme.colors.text;

    const renderItem = (v: T, i: number) => (
        <View key={i} style={{ height: itemHeight, flexDirection: 'column' }}>
            <TouchableOpacity onPress={() => {onSelect(v); setMenu(false);}} disabled={disabled} style={styles.menuItem}>
                {cell({value: v, selected: v == value, formatter: (x: any, i: any) => formatter(x, true), color, icon: (x: any, i: any) => icon(x, true), textMinWidth})}
            </TouchableOpacity>
            {
                divider && divider(v, i) &&
                <Divider/>
            }
        </View>
    );

    const renderSectionHeader = (title: string) => (
        <View key={title} style={{ height: itemHeight }}>
            <View style={styles.menuItem}>
                <View style={styles.row}>
                    <MyText numberOfLines={1} style={[styles.text, { minWidth: textMinWidth, color: color }]}>{sectionFormatter(title)}</MyText>
                </View>
            </View>
        </View>
    );

    const flatListProps: Partial<FlatListProps<T>> = {};
    if (container === 'flatlist' && itemHeight) {
        flatListProps.getItemLayout = (data, index) => (
            {length: itemHeight, offset: itemHeight * index, index}
        );
        flatListProps.initialScrollIndex = value !== undefined ? Math.max(0, values!.indexOf(value)) : 0;
    }

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
                    container === 'flatlist' &&
                    <View style={{height: Dimensions.get('window').height-250, minWidth: 200}}>
                        <FlatList
                            {...flatListProps}
                            keyboardShouldPersistTaps={'always'}
                            data={values}
                            renderItem={({item, index}) => renderItem(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                }
                {
                    container === 'sectionlist' &&
                    <View style={{height: Dimensions.get('window').height-450, minWidth: 200}}>
                        <SectionList
                            stickySectionHeadersEnabled={false}
                            keyboardShouldPersistTaps={'always'}
                            sections={sections!}
                            renderItem={({item, index}) => renderItem(item, index)}
                            renderSectionHeader={({section: { title }}) => renderSectionHeader(title)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                }
                {
                    !container &&
                    <View style={{minWidth: 200}}>
                        {values!.map(renderItem)}
                    </View>
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
        flex: 1,
    },
    anchor: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
    },
    row: {
        // backgroundColor: 'green',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        // backgroundColor: 'red',
        maxWidth: 160,
    },
    handle: {
        // backgroundColor: 'red',
        marginLeft: 4,
        paddingBottom: 2,
    },
});

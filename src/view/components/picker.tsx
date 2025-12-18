import {
    Dimensions,
    FlatList,
    FlatListProps,
    Platform,
    SectionList,
    SectionListData,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { MyText } from './my-text';
import { FontAwesome } from '@expo/vector-icons';
import React, { type CSSProperties, useState } from 'react';
import { useAppTheme } from '../../theming';
import { MenuNew } from '@app/components/menu';
import { Icon } from '@app/components/icon';

interface IPickerProps<T> {
    value?: T;
    values?: T[];
    sections?: SectionListData<T>[];
    formatter: (value: T, inList?: boolean) => string;
    sectionFormatter?: (value: string) => string;
    icon?: (value: T, inList?: boolean) => React.ReactNode;
    divider?: (value: T, index: number) => boolean;
    cell?: (props: object) => React.ReactNode;
    anchor?: (props: object) => React.ReactNode;
    onSelect: (value: T) => void;
    style?: StyleProp<ViewStyle>;
    anchorStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    container?: 'flatlist' | 'sectionlist';
    textMinWidth?: number;
    itemHeight?: number;
    popupAlign?: 'left' | 'right';
}

function defaultCell(props: any) {
    const { value, color, icon, formatter, selected, textMinWidth } = props;
    return (
        <View style={styles.row}>
            {icon && icon(value)}
            <MyText numberOfLines={1} style={[styles.text, { minWidth: textMinWidth, color: color, fontWeight: selected ? 'bold' : 'normal' }]}>
                {formatter(value)}
            </MyText>
        </View>
    );
}

export default function Picker<T>(props: IPickerProps<T>) {
    const theme = useAppTheme();
    const [menu, setMenu] = useState(false);

    const {
        value,
        values,
        sections,
        onSelect,
        style,
        disabled,
        formatter = (x) => x,
        sectionFormatter = (x) => x,
        icon = (x) => undefined,
        cell = defaultCell,
        divider = (x) => false,
        container,
        textMinWidth = 0,
        itemHeight,
        anchor,
        anchorStyle,
        popupAlign = 'left',
    } = props;

    const color = disabled ? undefined : theme.textColor;

    const renderItem = (v: T, i: number) => {
        return (
            <View key={i} style={{ height: itemHeight, flexDirection: 'column' }}>
                <TouchableOpacity
                    onPress={() => {
                        console.log('onSelect', v);
                        onSelect(v);
                        setMenu(false);
                    }}
                    disabled={disabled}
                    style={styles.menuItem}
                >
                    {cell({
                        value: v,
                        selected: v == value,
                        formatter: (x: any, i: any) => formatter(x, true),
                        color,
                        icon: (x: any, i: any) => icon(x, true),
                        textMinWidth,
                    })}
                </TouchableOpacity>
                {divider && divider(v, i) && <View style={{ height: 1, backgroundColor: theme.lightBorderColor }}></View>}
            </View>
        );
    };

    const renderSectionHeader = (title: string, index: number) => (
        <>
            {index !== 0 && <View className="h-px bg-border mt-1"></View>}
            <View key={title} style={{ height: itemHeight }}>
                <View style={styles.menuItem}>
                    <View style={styles.row}>
                        <MyText numberOfLines={1} style={[styles.text, { minWidth: textMinWidth, color: color }]}>
                            {sectionFormatter(title)}
                        </MyText>
                    </View>
                </View>
            </View>
        </>
    );

    const flatListProps: Partial<FlatListProps<T>> = {};
    if (container === 'flatlist' && itemHeight) {
        flatListProps.getItemLayout = (data, index) => ({ length: itemHeight, offset: itemHeight * index, index });

        // flatListProps.initialScrollIndex = value !== undefined ? Math.max(0, values!.indexOf(value)) : 0;

        // const index = value !== undefined ? Math.max(0, values!.indexOf(value)) : 0;
        // flatListProps.contentOffset = {x: 0, y: index*40};
    }

    // console.log('flatListProps.initialScrollIndex', flatListProps.initialScrollIndex)
    // console.log('flatListProps.contentOffset', flatListProps.contentOffset)

    const contentStyleForAlign = popupAlign === 'left' ? { right: 'auto' } : { left: 'auto' };

    const valuesHeight = values ? values.length * (itemHeight || 40) : 100;
    const sectionsHeight = sections ? sections.filter((s) => s.title != null).length * (itemHeight || 40) : 0;
    const valuesAndSectionsHeight = valuesHeight + sectionsHeight;
    const [isFocused, setIsFocused] = useState(false);

    if (Platform.OS === 'web') {
        const renderWebItem = (item: T, index: number | string) => (
            <option key={index} value={index}>
                {formatter(item, isFocused) as string}
            </option>
        );

        return (
            <View style={style} className="relative">
                <select
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-blue-900 h-11 appearance-none shadow-xs"
                    style={anchorStyle as CSSProperties}
                    onChange={(e) => {
                        if (container === 'flatlist') {
                            const value = values?.[Number(e.target.value)];

                            if (value !== undefined) {
                                onSelect(value);
                            }
                        } else if (container === 'sectionlist') {
                            const [sectionIndex, valueIndex] = e.target.value.split('-').map(Number);
                            const value = sections?.[sectionIndex]?.data[valueIndex];

                            if (value !== undefined) {
                                onSelect(value);
                            }
                        }

                        e.target.blur();
                    }}
                >
                    {container === 'flatlist' && values?.map(renderWebItem)}
                    {container === 'sectionlist' &&
                        sections?.map((section, index) =>
                            section.title ? (
                                <optgroup label={sectionFormatter(section.title)} key={index} data-section-index={index}>
                                    {section.data.map((item, itemIndex) => renderWebItem(item, `${index}-${itemIndex}`))}
                                </optgroup>
                            ) : (
                                section.data.map((item, itemIndex) => renderWebItem(item, `${index}-${itemIndex}`))
                            )
                        )}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <Icon icon="angle-down" />
                </div>
            </View>
        );
    }

    return (
        <View style={[style]}>
            <MenuNew
                contentStyle={
                    {
                        ...contentStyleForAlign,
                        padding: 0,
                        borderColor: theme.hoverBackgroundColor, // '#EEE',
                        borderWidth: 1,
                    } as ViewStyle
                }
                visible={menu}
                onDismiss={() => setMenu(false)}
                anchor={
                    <TouchableOpacity
                        className="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-800 shadow-xs"
                        style={[styles.anchor, anchorStyle, { backgroundColor: theme.backgroundColor }]}
                        onPress={() => setMenu(true)}
                        disabled={disabled}
                    >
                        {anchor && anchor({})}
                        {!anchor && (
                            <View style={styles.row}>
                                {cell({ value, formatter: (x: any, i: any) => formatter(x, false), color, icon })}
                                <FontAwesome style={styles.handle} name="chevron-down" color={color} size={12} />
                            </View>
                        )}
                    </TouchableOpacity>
                }
            >
                {container === 'flatlist' && (
                    <View
                        style={{
                            height: Math.min(valuesAndSectionsHeight, Dimensions.get('window').height - 350),
                            minWidth: 210,
                            overflow: 'hidden',
                        }}
                    >
                        <FlatList
                            {...flatListProps}
                            style={{ flex: 1 }}
                            initialNumToRender={15}
                            // style={{height: Dimensions.get('window').height-360}}
                            keyboardShouldPersistTaps={'always'}
                            data={values}
                            renderItem={({ item, index }) => renderItem(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                )}
                {container === 'sectionlist' && (
                    <View style={{ height: Math.min(valuesAndSectionsHeight, Dimensions.get('window').height - 350), minWidth: 210 }}>
                        <SectionList
                            initialNumToRender={15}
                            stickySectionHeadersEnabled={false}
                            keyboardShouldPersistTaps={'always'}
                            sections={sections!.map((s, index) => ({ ...s, index }))}
                            renderItem={({ item, index }) => renderItem(item, index)}
                            renderSectionHeader={({ section: { title, index } }) => (title ? renderSectionHeader(title, index) : null)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                )}
                {!container && <View style={{ minWidth: 210 }}>{values!.map(renderItem)}</View>}
                {/*{*/}
                {/*    values.map((v, i) =>*/}
                {/*        <Menu.Item titleStyle={[styles.menuItem, {fontWeight: v == value ? 'bold' : 'normal'}]}*/}
                {/*                   onPress={() => { onSelect(v); setMenu(false); }} title={formatter(v)} key={i} />*/}
                {/*    )*/}
                {/*}*/}
            </MenuNew>
        </View>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        // backgroundColor: 'yellow',
        paddingHorizontal: 15,
        paddingVertical: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    anchor: {
        // backgroundColor: 'pink',
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    row: {
        // backgroundColor: 'green',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 33,
    },
    text: {
        // backgroundColor: 'violet',
        maxWidth: 160,
        flex: 1,
    },
    handle: {
        // backgroundColor: 'red',
        marginLeft: 6,
        marginRight: 2,
        paddingBottom: 2,
    },
});

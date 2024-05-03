import { TextVariant, textColors } from '@app/utils/text.util';
import { useState } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { Icon } from './icon';
import { Text } from './text';

interface Item<ValueType extends string> {
    value: ValueType;
    label: string;
    abbreviated?: string;
}

export interface DropdownProps<ValueType extends string> {
    style?: ViewStyle;
    placeholder?: string;
    value?: ValueType;
    options: Item<ValueType>[];
    onChange?: (value: Item<ValueType>['value'], item: Item<ValueType>) => void;
    textVariant?: TextVariant;
}

export const Dropdown = <ValueType extends string>({
    value,
    options,
    placeholder = 'Select',
    onChange = () => {},
    style,
    textVariant,
}: DropdownProps<ValueType>) => {
    const color = textColors['default'];
    const selected = options.find((option) => option.value === value);
    const [isOpen, setIsOpen] = useState(false);
    const variant = textVariant ?? 'body';
    const isSmall = variant.includes('sm');

    return (
        <View className="relative">
            <Pressable
                onPress={() => setIsOpen((prev) => !prev)}
                style={style}
                className={`bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800 py-3.5 px-4 flex-row items-center justify-between active:bg-gray-50 dark:active:bg-gray-900 ${isSmall ? 'gap-1' : 'gap-1.5'}`}
            >
                <View style={{ marginTop: -2 }}>
                    <Text variant={variant} color={selected ? color : 'text-[#a3a3a3]'}>
                        {selected?.abbreviated ?? selected?.label ?? placeholder}
                    </Text>

                    {/* Ensures width doesn't change when switching items */}
                    {options.map((option) => (
                        <Text variant={variant} key={option.value} style={{ height: 0 }}>
                            {option.abbreviated ?? option.label}
                        </Text>
                    ))}
                </View>

                <Icon size={isSmall ? 14 : 16} prefix={isSmall ? 'fasr' : 'fass'} icon="angle-down" />
            </Pressable>

            {isOpen && (
                <View className="absolute top-12 z-10 w-full shadow-sm">
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled
                        data={options}
                        className="bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800 max-h-[300px] overflow-hidden"
                        keyExtractor={(item) => String(item.value)}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    onChange(item.value, item);
                                    setIsOpen(false);
                                }}
                                className="px-2.5 py-2 border-b border-gray-200 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-900"
                                key={item.value}
                            >
                                <Text variant={textVariant ?? 'label-sm'} numberOfLines={1}>
                                    {item.label}
                                </Text>
                            </Pressable>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

import {
    GestureResponderEvent,
    ImageSourcePropType,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { createStylesheet } from '../../theming-new';
import { useRef, useState } from 'react';
import { MyText } from './my-text';
import { Image } from 'expo-image';

interface FilterProps<Value> {
    options: Array<{ value: Value; label: string; icon?: ImageSourcePropType }>;
    icon?: ImageSourcePropType;
    label: string;
    value: Value;
    onChange: (value: Value) => void;
}

export const Filter = <Value,>({ options, label, value, onChange, icon }: FilterProps<Value>) => {
    const styles = useStyles();
    const initialValue = options.find((o) => o.value === value)?.label ?? '';
    const [search, setSearch] = useState<string>();
    const filterField = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);
    const filteredOptions = search ? options.filter(
        (option) =>
            option.label.toLowerCase().startsWith(search.toLowerCase()) ||
            search === 'All' ||
            (isFocused && search === initialValue && options.map((o) => o.label).includes(search))
    ) : options;
    const topOption = filteredOptions[0];

    return (
        <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterPressable} onPress={() => filterField.current?.focus()}>
                {icon ? <Image style={styles.filterIcon} source={icon} /> : null}
                <View style={styles.filter}>
                    <MyText style={styles.filterLabel}>{label}</MyText>
                    <TextInput
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setTimeout(() => {
                                setIsFocused(false);
                            }, 250);
                        }}
                        ref={filterField}
                        selectTextOnFocus
                        autoCorrect={false}
                        returnKeyType="search"
                        accessibilityRole="search"
                        onChangeText={setSearch}
                        value={search ?? options.find(o => o.value === value)?.label}
                        style={[styles.filterInput, isFocused && styles.filterInputFocused]}
                        contextMenuHidden={true}
                        onSubmitEditing={() => {
                            if (topOption) {
                                setSearch(topOption.label);
                                onChange(topOption.value);
                            }
                        }}
                    />
                </View>
            </TouchableOpacity>

            {isFocused && (
                <View style={styles.resultsContainer}>
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        style={styles.results}
                        scrollEnabled
                        data={filteredOptions}
                        keyExtractor={(item) => String(item.value)}
                        renderItem={({ item, index }) => (
                            <ResultRow
                                index={index}
                                {...item}
                                onPress={() => {
                                    setSearch(item.label);
                                    onChange(item.value);
                                    setIsFocused(false);
                                    filterField.current?.blur();
                                }}
                            />
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const ResultRow: React.FC<{
    index: number;
    label: string;
    icon?: ImageSourcePropType;
    onPress: (e: GestureResponderEvent) => void;
}> = ({ label, icon, onPress, index }) => {
    const styles = useStyles();

    return (
        <TouchableOpacity style={[styles.result, index === 0 && styles.highlightedResult]} onPress={onPress}>
            {icon && <Image style={styles.icon} source={icon} />}
            <MyText style={styles.name}>{label}</MyText>
        </TouchableOpacity>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        resultsContainer: {
            marginVertical: 10,
            elevation: 4,
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            position: 'absolute',
            top: 30,
            zIndex: 100,
            flex: 1,
            left: -5,
            right: -5,
        },
        results: {
            borderRadius: 10,
            overflow: 'hidden',
            maxHeight: 300,
            backgroundColor: theme.backgroundColor,
        },
        name: {
            color: theme.textColor,
        },
        highlightedResult: {
            borderTopWidth: 0,
            backgroundColor: theme.skeletonColor,
        },
        result: {
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            borderTopColor: theme.borderColor,
            borderTopWidth: 1,
            paddingHorizontal: 6,
            paddingVertical: 8,
            backgroundColor: theme.backgroundColor,
        },
        icon: {
            width: 20,
            height: 20,
        },
        filterPressable: {
            flexDirection: 'row',
            gap: 8,
            flex: 1,
        },
        filterContainer: {
            position: 'relative',
            flexDirection: 'row',
            flex: 1,
        },
        filterIcon: {
            width: 25,
            height: 25,
        },
        filter: {
            flex: 1,
        },
        filterLabel: {
            fontSize: 10,
            color: theme.textNoteColor,
        },
        filterInput: {
            color: theme.textColor,
            pointerEvents: 'none',
        },
        filterInputFocused: {
            pointerEvents: 'auto',
        },
    } as const)
);

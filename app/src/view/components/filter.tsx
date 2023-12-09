import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  TextInput,
  ImageSourcePropType,
} from "react-native";
import { createStylesheet } from "../../theming-new";
import { useRef, useState } from "react";
import { MyText } from "./my-text";
import { Image } from "expo-image";

interface FilterProps<Value> {
  options: Array<{ value: Value; label: string; icon?: ImageSourcePropType }>;
  icon?: ImageSourcePropType;
  label: string;
  value: Value;
  onChange: (value: Value) => void;
}

export const Filter = <Value,>({
  options,
  label,
  value,
  onChange,
  icon,
}: FilterProps<Value>) => {
  const styles = useStyles();
  const initialValue = options.find((o) => o.value === value)?.label ?? "";
  const [search, setSearch] = useState<string>(initialValue);
  const filterField = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().startsWith(search.toLowerCase()) ||
      search === "All" ||
      (isFocused &&
        search === initialValue &&
        options.map((o) => o.label).includes(search))
  );
  const topOption = filteredOptions[0];

  return (
    <>
      <TouchableOpacity
        style={styles.filterContainer}
        onPress={() => filterField.current?.focus()}
      >
        {icon ? <Image style={styles.filterIcon} source={icon} /> : null}
        <View style={styles.filter}>
          <MyText style={styles.filterLabel}>{label}</MyText>
          <TextInput
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={filterField}
            selectTextOnFocus
            autoCorrect={false}
            returnKeyType="search"
            accessibilityRole="search"
            onChangeText={setSearch}
            value={search}
            style={styles.filterInput}
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
        <View style={styles.results}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            scrollEnabled={true}
            data={filteredOptions}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item, index }) => (
              <ResultRow
                index={index}
                {...item}
                onPress={() => {
                  setSearch(item.label);
                  onChange(item.value);
                  filterField.current?.blur();
                }}
              />
            )}
          />
        </View>
      )}
    </>
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
    <TouchableOpacity
      activeOpacity={0.95}
      style={[styles.result, index === 0 && styles.highlightedResult]}
      onPress={onPress}
    >
      {icon && <Image style={styles.icon} source={icon} />}
      <MyText style={styles.name}>{label}</MyText>
    </TouchableOpacity>
  );
};

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
    results: {
      marginVertical: 10,
      elevation: 4,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      position: "absolute",
      top: 30,
      zIndex: 100,
      width: "100%",
      height: 350,
    },
    name: {
      color: theme.textColor,
    },
    highlightedResult: {
      borderTopWidth: 0,
      backgroundColor: theme.skeletonColor,
    },
    result: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      borderTopColor: theme.borderColor,
      borderTopWidth: 1,
      padding: 10,
      backgroundColor: theme.backgroundColor,
    },
    icon: {
      width: 25,
      height: 25,
    },
    filterContainer: {
      flexDirection: "row",
      gap: 8,
      flex: 1,
    },
    filterIcon: {
      width: 25,
      height: 25,
    },
    filter: {},
    filterLabel: {
      fontSize: 10,
      color: theme.textNoteColor,
    },
    filterInput: {
      color: theme.textColor,
    },
  })
);

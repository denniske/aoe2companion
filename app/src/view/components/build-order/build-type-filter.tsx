import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  GestureResponderEvent,
  TextInput,
} from "react-native";
import { createStylesheet } from "../../../theming-new";
import { useRef, useState } from "react";
import { MyText } from "../my-text";
import { startCase } from "lodash";

interface BuildTypeFilterProps {
  options: string[];
  buildType: string;
  onBuildTypeChange: (buildType: string) => void;
}

export const BuildTypeFilter: React.FC<BuildTypeFilterProps> = ({
  buildType,
  onBuildTypeChange,
  options,
}) => {
  const styles = useStyles();
  const [search, setSearch] = useState<string>(buildType);
  const [isFocused, setIsFocused] = useState(false);
  const filteredOptions = options.filter(
    (c) =>
      startCase(c).startsWith(startCase(search)) ||
      c === "All" ||
      (isFocused && options.includes(search))
  );
  const topOption = filteredOptions[0];
  const filterField = useRef<TextInput>(null);

  return (
    <>
      <View style={styles.filterContainer}>
        <View style={styles.filter}>
          <MyText style={styles.filterLabel}>Filter by Type</MyText>
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
                setSearch(startCase(topOption));
                onBuildTypeChange(topOption);
              }
            }}
          />
        </View>
      </View>

      {isFocused && (
        <View style={styles.results}>
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <SearchRow
                index={index}
                buildType={item}
                onPress={() => {
                  setSearch(startCase(item));
                  onBuildTypeChange(item);
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

const SearchRow: React.FC<{
  index: number;
  buildType: string;
  onPress: (e: GestureResponderEvent) => void;
}> = ({ buildType, onPress, index }) => {
  const styles = useStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      style={[styles.searchBlock, index === 0 && styles.highlightedSearchBlock]}
      onPress={onPress}
    >
      <MyText style={styles.name}>{startCase(buildType)}</MyText>
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
    },
    name: {
      color: theme.textColor,
    },
    highlightedSearchBlock: {
      borderTopWidth: 0,
      backgroundColor: theme.skeletonColor,
    },
    searchBlock: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      borderTopColor: theme.borderColor,
      borderTopWidth: 1,
      padding: 10,
      backgroundColor: theme.backgroundColor,
    },
    filterContainer: {
      flexDirection: "row",
      gap: 8,
      flex: 1,
    },
    filter: {},
    filterLabel: {
      fontSize: 10,
      color: theme.textNoteColor,
    },
    filterInput: {},
  })
);

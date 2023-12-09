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
import { getDifficultyName } from "../../../helper/difficulties";

type Difficulty = 1 | 2 | 3 | "All";

interface DifficultyFilterProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export const DifficultyFilter: React.FC<DifficultyFilterProps> = ({
  difficulty,
  onDifficultyChange,
}) => {
  const styles = useStyles();
  const [search, setSearch] = useState<string>(
    getDifficultyName(difficulty) ?? "All"
  );
  const [isFocused, setIsFocused] = useState(false);
  const options: Array<{ label: string; value: Difficulty }> = (
    ["All", 1, 2, 3] as const
  ).map((d) => ({ label: getDifficultyName(d) ?? "All", value: d }));
  const filteredOptions = options.filter(
    (c) =>
      c.label.toLowerCase().startsWith(search.toLowerCase()) ||
      c.label === "All" ||
      (isFocused && options.some((o) => o.label === search))
  );
  const topOption = filteredOptions[0];
  const filterField = useRef<TextInput>(null);

  return (
    <>
      <View style={styles.filterContainer}>
        <View style={styles.filter}>
          <MyText style={styles.filterLabel}>Filter by Difficulty</MyText>
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
                onDifficultyChange(topOption.value);
              }
            }}
          />
        </View>
      </View>

      {isFocused && (
        <View style={styles.results}>
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item, index }) => (
              <SearchRow
                index={index}
                difficulty={item.label}
                onPress={() => {
                  setSearch(item.label);
                  onDifficultyChange(item.value);
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
  difficulty: string;
  onPress: (e: GestureResponderEvent) => void;
}> = ({ difficulty, onPress, index }) => {
  const styles = useStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      style={[styles.searchBlock, index === 0 && styles.highlightedSearchBlock]}
      onPress={onPress}
    >
      <MyText style={styles.name}>{difficulty}</MyText>
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

import { Civ, civs, getCivNameById, orderCivs } from "@nex/data";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  GestureResponderEvent,
  TextInput,
} from "react-native";
import { createStylesheet } from "../../../theming-new";
import { useRef, useState } from "react";
import { MyText } from "../my-text";
import { genericCivIcon, getCivIconLocal } from "../../../helper/civs";

type CivOption = Civ | "All";

interface CivFilterProps {
  civilization: CivOption;
  onCivilizationChange: (civilization: Civ | "All") => void;
}

export const CivFilter: React.FC<CivFilterProps> = ({
  civilization,
  onCivilizationChange,
}) => {
  const styles = useStyles();
  const [civSearch, setCivSearch] = useState<string>(civilization);
  const civIcon = getCivIconLocal(civilization) ?? genericCivIcon;
  const civOptions: CivOption[] = [
    "All",
    ...orderCivs(civs.filter((civ) => civ !== "Indians")),
  ];
  const filterField = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const filteredCivOptions = civOptions.filter(
    (c) =>
      c.toLowerCase().startsWith(civSearch.toLowerCase()) ||
      c === "All" ||
      (isFocused && civOptions.includes(civSearch as CivOption))
  );
  const topOption = filteredCivOptions[0];

  return (
    <>
      <View style={styles.filterContainer}>
        {civIcon ? <Image style={styles.filterIcon} source={civIcon} /> : null}
        <View style={styles.filter}>
          <MyText style={styles.filterLabel}>Filter by Civ</MyText>
          <TextInput
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={filterField}
            selectTextOnFocus
            autoCorrect={false}
            returnKeyType="search"
            accessibilityRole="search"
            onChangeText={setCivSearch}
            value={civSearch}
            style={styles.filterInput}
            onSubmitEditing={() => {
              if (topOption) {
                setCivSearch(topOption);
                onCivilizationChange(topOption);
              }
            }}
          />
        </View>
      </View>

      {isFocused && (
        <View style={styles.results}>
          <FlatList
            style={{ flex: 1 }}
            scrollEnabled={true}
            data={filteredCivOptions}
            keyExtractor={(item) => item}
            renderItem={({ item, index }) => (
              <CivRow
                index={index}
                civ={item}
                onPress={() => {
                  setCivSearch(item);
                  onCivilizationChange(item);
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

const CivRow: React.FC<{
  index: number;
  civ: CivOption;
  onPress: (e: GestureResponderEvent) => void;
}> = ({ civ, onPress, index }) => {
  const styles = useStyles();
  const civIcon = getCivIconLocal(civ) ?? genericCivIcon;

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      style={[styles.civBlock, index === 0 && styles.highlightedCivBlock]}
      onPress={onPress}
    >
      <Image style={styles.icon} source={civIcon} />
      <MyText style={styles.name}>
        {civ === "All" ? "All" : getCivNameById(civ)}
      </MyText>
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
    highlightedCivBlock: {
      borderTopWidth: 0,
      backgroundColor: theme.skeletonColor,
    },
    civBlock: {
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
    filterInput: {},
  })
);

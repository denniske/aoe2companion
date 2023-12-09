import { createStylesheet } from "../../../theming-new";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MyText } from "../my-text";
import { IBuildOrder } from "../../../../../data/src/helper/builds";
import { genericCivIcon, getCivIconLocal } from "../../../helper/civs";
import { useNavigation } from "@react-navigation/native";
import { RootStackProp } from "../../../../App2";
import { reverse, startCase } from "lodash";
import { BuildRating } from "./build-rating";
import { getDifficultyIcon } from "../../../helper/difficulties";
import { getAgeIcon } from "../../..//helper/units";
import { FontAwesome5 } from "@expo/vector-icons";
import { Tag } from "../tag";
import { Image } from "expo-image";
import { memo } from "react";

const BuildCard: React.FC<
  IBuildOrder & { favorited: boolean; toggleFavorite: () => void }
> = ({ favorited, toggleFavorite, ...build }) => {
  const styles = useStyles();
  const title = build.title.replace(build.civilization, "");
  const civIcon = getCivIconLocal(build.civilization) ?? genericCivIcon;
  const difficultyIcon = getDifficultyIcon(build.difficulty);
  const navigation = useNavigation<RootStackProp>();
  const ages = reverse(Object.entries(build.pop));

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.push("Guide", { build: build.id })}
    >
      <View style={styles.cardHeader}>
        {civIcon ? <Image style={styles.civImage} source={civIcon} /> : null}
        <MyText style={styles.civName}>{build.civilization}</MyText>
        <TouchableOpacity
          hitSlop={12}
          onPress={() =>
            navigation.push("Guide", { build: build.id, focusMode: true })
          }
        >
          <MyText style={styles.startButtonText}>Start</MyText>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <MyText style={styles.title} numberOfLines={1}>
          {title}
        </MyText>

        <View style={styles.row}>
          <MyText style={styles.author} numberOfLines={1}>
            {build.author}
          </MyText>
          <BuildRating {...build} />
        </View>

        <View style={styles.tagsContainer}>
          {difficultyIcon && <Tag icon={difficultyIcon} />}
          {ages.map(([ageName, agePop]) => (
            <Tag
              key={ageName}
              icon={getAgeIcon(startCase(ageName.replace("Age", "")) as any)}
            >
              {ageName === "feudalAge" ? "" : "+"}
              {agePop}
            </Tag>
          ))}
          {build.attributes.map((attribute) => (
            <Tag key={attribute}>{startCase(attribute)}</Tag>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.favoriteButton}
        hitSlop={10}
        onPress={toggleFavorite}
      >
        <FontAwesome5
          solid={favorited}
          name="heart"
          size={20}
          color="#ef4444"
        />
      </TouchableOpacity>
      <Image source={{ uri: build.imageURL }} style={styles.mainImage} />
    </TouchableOpacity>
  );
};

export default memo(BuildCard);

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      borderRadius: 4,
      elevation: 4,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      position: "relative",
      height: 135,
    },
    cardBody: {
      marginVertical: 8,
      marginLeft: 12,
      marginRight: 50,
      flex: 1,
      overflow: "hidden",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 18,
    },
    author: {
      fontSize: 16,
      color: theme.textNoteColor,
      flexShrink: 1,
    },
    mainImage: {
      width: 50,
      height: 50,
      position: "absolute",
      bottom: 0,
      right: 0,
    },
    cardHeader: {
      gap: 8,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.skeletonColor,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    civImage: {
      width: 20,
      height: 20,
    },
    civName: {
      color: theme.textNoteColor,
      flex: 1,
    },
    row: {
      flexDirection: "row",
      gap: 12,
    },
    tagsContainer: {
      flexDirection: "row",
      gap: 4,
    },
    favoriteButton: {
      position: "absolute",
      right: 0,
      top: 36,
      padding: 12,
    },
    startButtonText: {
      color: theme.linkColor,
      textTransform: "uppercase",
    },
  })
);

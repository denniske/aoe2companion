import React, { useState } from "react";
import { StyleSheet, Image, View, Linking } from "react-native";
import { createStylesheet } from "../../theming-new";
import { IBuildOrder } from "data/src/helper/builds";
import { MyText } from "../components/my-text";
import { BuildFocus } from "./build-focus";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../../../App2";
import { Button } from "../components/button";
import { Tag } from "../components/tag";
import {
  getDifficultyIcon,
  getDifficultyName,
} from "../../helper/difficulties";
import { reverse, startCase } from "lodash";
import { getAgeIcon } from "../../helper/units";
import { BuildRating } from "../components/build-order/build-rating";

export const BuildDetail: React.FC<IBuildOrder> = (build) => {
  const styles = useStyles();
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Guide">>();
  const route = useRoute<RouteProp<RootStackParamList, "Guide">>();
  const [focused, setFocused] = useState(!!route.params.focusMode);
  const difficultyIcon = getDifficultyIcon(build.difficulty);
  const ages = reverse(Object.entries(build.pop));
  const uptimes: Record<string, any> = build.uptime;

  return (
    <View style={styles.container}>
      <MyText>{build.description}</MyText>

      <MyText>
        Created by {build.author}{" "}
        {build.reference && (
          <MyText
            onPress={() => Linking.openURL(build.reference ?? "")}
            style={styles.link}
          >
            (Source)
          </MyText>
        )}
      </MyText>

      <Image source={{ uri: build.imageURL }} style={styles.image} />

      <View style={styles.tagsContainer}>
        {ages.map(([ageName, agePop]) => (
          <Tag
            key={ageName}
            icon={getAgeIcon(startCase(ageName.replace("Age", "")) as any)}
          >
            {ageName === "feudalAge" ? `${agePop} pop` : `+${agePop} vills`} -{" "}
            {uptimes[ageName]}
          </Tag>
        ))}
      </View>

      <View style={styles.tagsContainer}>
        {difficultyIcon && (
          <Tag icon={difficultyIcon}>{getDifficultyName(build.difficulty)}</Tag>
        )}
        {build.attributes.map((attribute) => (
          <Tag key={attribute}>{startCase(attribute)}</Tag>
        ))}
      </View>

      <View style={styles.tagsContainer}>
        <BuildRating {...build} />
      </View>

      <Button onPress={() => setFocused(true)}>Focus</Button>

      <BuildFocus
        build={build}
        visible={focused}
        onClose={() => {
          setFocused(false);
          if (route.params.focusMode) {
            navigation.goBack();
          }
        }}
      />
    </View>
  );
};

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      gap: 16,
    },
    tagsContainer: {
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
    },
    image: {
      height: 100,
      width: 100,
      alignSelf: "center",
    },
    link: {
      color: theme.linkColor,
    },
  })
);

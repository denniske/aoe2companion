import BuildCard from "../components/build-order/build-card";
import { reverse, sortBy } from "lodash";
import { FlatList, StyleSheet, View } from "react-native";
import { createStylesheet } from "../../theming-new";
import { buildsData } from "../../../../data/src/data/builds";
import { useBuildFilters, useFavoritedBuilds } from "../../service/storage";
import { BuildFilters } from "../components/build-order/build-filters";
import { MyText } from "../components/my-text";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getTranslation } from "../../helper/translate";

export const BuildListPage = () => {
  const styles = useStyles();
  const { favoriteIds, favorites, toggleFavorite, refetch } =
    useFavoritedBuilds();
  const buildFilters = useBuildFilters();
  const { civilization, buildType, difficulty } = buildFilters.filters;

  const formattedBuilds = (
    buildType === "favorites" ? favorites : buildsData
  ).map((build) => ({
    ...build,
    avg_rating: build.avg_rating ?? 0,
    number_of_ratings: build.number_of_ratings ?? 0,
    favorited: favoriteIds.includes(build.id),
    toggleFavorite: () => toggleFavorite(build.id),
  }));
  const sortedBuilds = reverse(
    sortBy(formattedBuilds, ["avg_rating", "number_of_ratings"])
  );

  const filteredBuilds = sortedBuilds.filter(
    (build) =>
      (civilization === "all" || build.civilization === civilization) &&
      (buildType === "all" ||
        buildType === "favorites" ||
        build.attributes.includes(buildType)) &&
      (difficulty === "all" || difficulty === build.difficulty)
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  if (buildFilters.loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BuildFilters builds={buildsData} {...buildFilters} />

      <FlatList
        initialNumToRender={5}
        snapToInterval={150}
        style={styles.container}
        data={filteredBuilds}
        renderItem={({ item }) => <BuildCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={
          <MyText>{getTranslation("builds.noResults")}</MyText>
        }
      />
    </View>
  );
};

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      gap: 15,
      padding: 10,
    },
  })
);

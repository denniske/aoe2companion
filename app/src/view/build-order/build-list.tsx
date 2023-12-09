import { BuildCard } from "../components/build-order/build-card";
import { flatten, reverse, sortBy, startCase, uniq } from "lodash";
import { FlatList, StyleSheet, View } from "react-native";
import { createStylesheet } from "../../theming-new";
import { buildsData } from "../../../../data/src/data/builds";
import { useBuildFilters, useFavoritedBuilds } from "../../service/storage";
import { Button } from "../components/button";
import { CivFilter } from "../components/build-order/civ-filter";
import { BuildTypeFilter } from "../components/build-order/build-type-filter";
import { MyText } from "../components/my-text";
import { DifficultyFilter } from "../components/build-order/difficulty-filter";

export const BuildListPage = () => {
  const styles = useStyles();
  const { favoriteIds, favorites, toggleFavorite } = useFavoritedBuilds();
  const {
    setFilter,
    filters: { civilization, buildType, difficulty },
    loading,
  } = useBuildFilters();

  const buildTypeOptions = [
    "All",
    "Favorites",
    ...uniq(flatten(buildsData.map((build) => build.attributes))),
  ];

  const formattedBuilds = (
    buildType === "Favorites" ? favorites : buildsData
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
      (civilization === "All" || build.civilization === civilization) &&
      (buildType === "All" ||
        buildType === "Favorites" ||
        build.attributes.includes(buildType)) &&
      (difficulty === "All" || difficulty === build.difficulty)
  );

  if (loading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtersContainer}>
        {civilization && (
          <CivFilter
            civilization={civilization}
            onCivilizationChange={(civ) => setFilter("civilization", civ)}
          />
        )}

        {difficulty && (
          <DifficultyFilter
            difficulty={difficulty}
            onDifficultyChange={(diff) => setFilter("difficulty", diff)}
          />
        )}

        {buildType && (
          <BuildTypeFilter
            buildType={buildType}
            onBuildTypeChange={(type) => setFilter("buildType", type)}
            options={buildTypeOptions}
          />
        )}
      </View>
      <FlatList
        keyboardShouldPersistTaps="handled"
        snapToInterval={150}
        style={styles.container}
        data={filteredBuilds}
        renderItem={({ item }) => <BuildCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<MyText>No Results Found</MyText>}
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
    filtersContainer: {
      zIndex: 1,
      gap: 15,
      padding: 10,
      position: "relative",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

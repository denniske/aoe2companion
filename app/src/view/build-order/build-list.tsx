import { BuildCard } from "../components/build-order/build-card";
import { reverse, sortBy } from "lodash";
import { FlatList, StyleSheet } from "react-native";
import { createStylesheet } from "../../theming-new";
import { buildsData } from "../../../../data/src/data/builds";

export const BuildListPage = () => {
  const styles = useStyles();
  const formattedBuilds = buildsData.map((build) => ({
    ...build,
    avg_rating: build.avg_rating ?? 0,
    number_of_ratings: build.number_of_ratings ?? 0,
  }));
  const sortedBuilds = reverse(
    sortBy(formattedBuilds, ["avg_rating", "number_of_ratings"])
  );

  return (
    <FlatList
      snapToInterval={150}
      style={styles.container}
      data={sortedBuilds}
      renderItem={({ item }) => <BuildCard {...item} />}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.contentContainer}
    />
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

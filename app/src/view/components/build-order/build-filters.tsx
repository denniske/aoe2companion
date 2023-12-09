import { StyleSheet, View } from "react-native";
import { createStylesheet } from "../../../theming-new";
import { flatten, startCase, uniq } from "lodash";
import { IBuildOrder } from "../../../../../data/src/helper/builds";
import { useBuildFilters } from "../../../service/storage";
import { genericCivIcon, getCivIconLocal } from "../../../helper/civs";
import { Civ, civs, orderCivs } from "@nex/data";
import { Filter } from "../filter";
import { getDifficultyName } from "../../../helper/difficulties";

type FiltersStore = ReturnType<typeof useBuildFilters>;

interface BuildFiltersProps extends FiltersStore {
  builds: IBuildOrder[];
}

export const BuildFilters: React.FC<BuildFiltersProps> = ({
  builds,
  filters: { civilization, difficulty, buildType },
  setFilter,
}) => {
  const styles = useStyles();
  const buildTypeOptions = [
    "All",
    "Favorites",
    ...uniq(flatten(builds.map((build) => build.attributes))),
  ];

  const civIcon = getCivIconLocal(civilization) ?? genericCivIcon;
  const civOptions: Array<Civ | "All"> = [
    "All",
    ...orderCivs(civs.filter((civ) => civ !== "Indians")),
  ];

  return (
    <View style={styles.filtersContainer}>
      {civilization && (
        <Filter
          icon={civIcon}
          onChange={(civ) => setFilter("civilization", civ)}
          label="Filter by Civ"
          value={civilization}
          options={civOptions.map((value) => ({
            value,
            label: value,
            icon: getCivIconLocal(value) ?? genericCivIcon,
          }))}
        />
      )}

      {difficulty && (
        <Filter
          onChange={(diff) => setFilter("difficulty", diff)}
          label="Filter by Difficulty"
          value={difficulty}
          options={(["All", 1, 2, 3] as const).map((d) => ({
            label: getDifficultyName(d) ?? "All",
            value: d,
          }))}
        />
      )}

      {buildType && (
        <Filter
          onChange={(type) => setFilter("buildType", type)}
          label="Filter by Type"
          value={buildType}
          options={buildTypeOptions.map((value) => ({
            value,
            label: startCase(value),
          }))}
        />
      )}
    </View>
  );
};

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
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

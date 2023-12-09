import { createStylesheet } from "../../../theming-new";
import { IBuildOrderStep } from "data/src/helper/builds";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { getTechIcon } from "../../../helper/techs";
import { getOtherIcon, getUnitIcon } from "../../../helper/units";
import { FontAwesome5 } from "@expo/vector-icons";
import { getBuildingIcon } from "../../../helper/buildings";
import { MyText } from "../my-text";
import { startCase } from "lodash";
import { Fragment } from "react";

const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const taskMap: Record<
  NonNullable<IBuildOrderStep["task"]>,
  ImageSourcePropType
> = {
  wood: getOtherIcon("Wood"),
  food: getOtherIcon("Food"),
  gold: getOtherIcon("Gold"),
  stone: getOtherIcon("Stone"),
  boar: getUnitIcon("Boar"),
  sheep: getUnitIcon("Sheep"),
  farm: getBuildingIcon("Farm"),
  berries: getOtherIcon("BerryBush"),
  build: 0,
  deer: 0,
  forward: 0,
  shoreFish: 0,
  foodUnderTC: 0,
  stragglerTree: 0,
  collect10GoldAfterBarracksIsBuilt: 0,
  collect10GoldWithNewVillager: 0,
  collect30GoldWithNewVillager: 0,
  collect40GoldWithTwoNewVillagers: 0,
};

const PlusIcon: React.FC<{ move?: boolean }> = ({ move }) => {
  const styles = useStyles();

  return (
    <FontAwesome5
      name={move ? "arrow-right" : "plus"}
      size={14}
      style={styles.plusIcon}
    />
  );
};

const TaskIcon: React.FC<{ item?: string }> = ({ item }) => {
  const styles = useStyles();
  const taskIcon = item
    ? taskMap[item as unknown as NonNullable<IBuildOrderStep["task"]>]
    : getBuildingIcon("House");

  return (
    <Image
      source={taskIcon}
      style={item === "berries" ? styles.pic2 : styles.pic}
    />
  );
};

export const StepActions: React.FC<
  IBuildOrderStep & { pop?: string | number }
> = (step) => {
  const styles = useStyles();
  const { buildings, tech, type, count, task, from, to, age, unit, pop } = step;
  const hasBuildings = !!buildings?.length;
  const hasTech = !!tech?.length;
  const hasBuildingsOrTech = hasBuildings || hasTech;

  return (
    <View style={styles.row}>
      {hasBuildings && <MyText style={styles.text}>Build</MyText>}
      {buildings?.map((building, index) => (
        <Fragment key={`${building.type}-${index}`}>
          {index > 0 ? <PlusIcon /> : null}
          {Array(building.count)
            .fill(0)
            .map((_, count) => (
              <Image
                key={`${building.type}-${count}-${index}`}
                source={getBuildingIcon(capitalize(building.type) as any)}
                style={styles.buildingPic}
                alt={building.type}
              />
            ))}
        </Fragment>
      ))}

      {hasTech && <MyText style={styles.text}>Research</MyText>}
      {tech?.map((tech, index) => (
        <Fragment key={tech}>
          {index > 0 ? <PlusIcon /> : null}

          <Image
            source={
              getTechIcon(capitalize(tech) as any) ||
              getUnitIcon(capitalize(tech) as any)
            }
            style={styles.buildingPic}
          />
        </Fragment>
      ))}

      {hasBuildingsOrTech &&
      [
        "newVillagers",
        "moveVillagers",
        "trainUnit",
        "ageUp",
        "newAge",
      ].includes(type) ? (
        <PlusIcon />
      ) : null}

      {type == "newVillagers" && (
        <>
          <MyText style={styles.text}>{count} on</MyText>
          <TaskIcon item={task} />
        </>
      )}
      {type == "moveVillagers" && (
        <>
          <MyText style={styles.text}>{count}</MyText>
          <TaskIcon item={from} />
          <PlusIcon move />
          <MyText style={styles.text}>{count}</MyText>
          <TaskIcon item={to} />
        </>
      )}

      {type == "trainUnit" && (
        <>
          {count === "∞" ? (
            <MyText style={styles.text}>
              Start Training {startCase(unit)}s
            </MyText>
          ) : (
            <MyText style={styles.text}>
              Train {count} {startCase(unit)}
              {count > 1 && "s"}
            </MyText>
          )}
        </>
      )}
      {type == "ageUp" && (
        <>
          <MyText style={styles.text}>Research{pop && ` ${pop} pop`}</MyText>
          <Image
            source={getOtherIcon(capitalize(age!) as any)}
            style={styles.pic}
          />
        </>
      )}
      {type == "newAge" && (
        <>
          <MyText style={styles.text}>Enter{pop && ` ${pop} pop`}</MyText>
          <Image
            source={getOtherIcon(capitalize(age!) as any)}
            style={styles.pic}
          />
        </>
      )}
    </View>
  );
};

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
    text: {
      fontSize: 18,
      fontWeight: "bold",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    buildingPic: {
      width: 40,
      height: 40,
      borderColor: theme.borderColor,
      borderWidth: 1,
    },
    pic: {
      width: 30,
      height: 30,
    },
    pic2: {
      width: 43,
      height: 30,
    },
    plusIcon: {
      color: theme.textNoteColor,
    },
  })
);

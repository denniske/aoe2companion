import { createStylesheet } from "../../../theming-new";
import {
  IBuildOrder,
  IBuildOrderStep,
} from "../../../../../data/src/helper/builds";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { MyText } from "../my-text";
import { ResourceAlloc } from "./step-resource";
import { StepActions } from "./step-actions";

export interface StepProps {
  highlighted: boolean;
  index: number;
  step: IBuildOrderStep;
  build: IBuildOrder;
  onPress: (event: GestureResponderEvent) => void;
}

export const Step: React.FC<StepProps> = ({
  highlighted,
  step,
  build,
  onPress,
}) => {
  const { resources } = step;
  const styles = useStyles();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.step, highlighted && styles.highlightedStep]}
    >
      <View style={styles.stepCentered}>
        <View style={styles.stepBody}>
          <StepActions
            {...step}
            pop={step.age === "feudalAge" ? build.pop[step.age] : undefined}
          />

          <MyText style={styles.text}>{step.text}</MyText>
        </View>
      </View>
      <View style={styles.stepFooter}>
        <ResourceAlloc resource="Wood" count={resources.wood} />
        <ResourceAlloc resource="Food" count={resources.food} />
        <ResourceAlloc resource="Gold" count={resources.gold} />
      </View>
    </Pressable>
  );
};

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
    step: {
      flexDirection: "column",
      height: 235,
      opacity: 0.1,
      backgroundColor: theme.skeletonColor,
      borderRadius: 4,
      elevation: 4,
      shadowColor: "#000000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    stepCentered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    stepBody: {
      padding: 15,
    },
    stepFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.skeletonColor,
      padding: 15,
      borderBottomLeftRadius: 4,
      borderBottomRightRadius: 4,
    },
    highlightedStep: {
      opacity: 1,
      backgroundColor: theme.backgroundColor,
    },
    text: {
      fontSize: 18,
      fontWeight: "bold",
    },
  })
);

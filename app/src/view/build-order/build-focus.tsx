import React, { useRef, useState } from "react";
import {
  FlatList,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
  Modal,
} from "react-native";
import { createStylesheet } from "../../theming-new";
import { Step } from "../components/build-order/step";
import { IBuildOrder } from "data/src/helper/builds";
import { MyText } from "../components/my-text";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { Button } from "../components/button";

export const BuildFocus: React.FC<{
  build: IBuildOrder;
  visible: boolean;
  onClose: (event: GestureResponderEvent) => void;
}> = ({ build, visible, onClose }) => {
  const styles = useStyles();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const flatListRef = useRef<FlatList>(null);

  const viewAbilityConfigCallbackPairs = useRef(
    ({
      changed,
      viewableItems,
    }: {
      viewableItems: Array<ViewToken>;
      changed: Array<ViewToken>;
    }) => {
      if (changed) {
        const viewableSteps = viewableItems.map((item) => item.index ?? 0);
        setCurrentStep(viewableSteps[0]);
      }
    }
  );

  const goToStep = (step: number) => {
    const newStep = Math.max(step, 0);

    setCurrentStep(newStep);
    flatListRef?.current?.scrollToIndex({
      animated: true,
      index: newStep,
      viewOffset: 10,
    });
  };

  return (
    <Modal style={styles.container} visible={visible} animationType="slide">
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.headingContainer}>
            <MyText style={styles.heading}>{build.title}</MyText>

            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times" size={24} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <FlatList
            decelerationRate="fast"
            snapToInterval={250}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 100,
            }}
            onViewableItemsChanged={viewAbilityConfigCallbackPairs.current}
            style={styles.container}
            data={build.build}
            ref={flatListRef}
            renderItem={({ item, index }) => (
              <Step
                count={build.build.length}
                build={build}
                step={item}
                highlighted={index === currentStep}
                index={index}
                onPress={() => goToStep(index)}
              />
            )}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.contentContainer}
          />

          <View style={styles.buttonsContainer}>
            <Button
              fullWidth
              disabled={currentStep === 0}
              onPress={() => goToStep(currentStep - 1)}
            >
              Previous
            </Button>
            <Button
              fullWidth
              disabled={currentStep === build.build.length - 1}
              onPress={() => goToStep(currentStep + 1)}
            >
              Next
            </Button>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

const useStyles = createStylesheet((theme, darkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    contentContainer: {
      gap: 15,
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    headingContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      paddingBottom: 8,
    },
    heading: {
      fontSize: 20,
      fontWeight: "bold",
    },
    buttonsContainer: {
      flexDirection: "row",
      padding: 16,
      gap: 12,
    },
    icon: {
      color: theme.textColor,
    },
  })
);

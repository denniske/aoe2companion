import React, { useMemo, useRef, useState } from 'react';
import {
    FlatList,
    GestureResponderEvent,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewToken,
    Modal,
    Platform
} from 'react-native';
import { createStylesheet } from '../../theming-new';
import { Step } from '../components/build-order/step';
import { IBuildOrder, IBuildOrderStandardResources, IBuildOrderStep } from 'data/src/helper/builds';
import { MyText } from '../components/my-text';
import { SafeAreaProvider, SafeAreaView } from '@/src/components/uniwind/safe-area-context';;
import { FontAwesome5 } from '@expo/vector-icons';
import { BuildOrderButton } from '../components/build-order-button';
import { useTranslation } from '@app/helper/translate';

export const BuildFocus: React.FC<{
    build: IBuildOrder;
    visible: boolean;
    shownResources: Array<keyof IBuildOrderStandardResources>;
    onClose: (event: GestureResponderEvent) => void;
}> = ({ build, visible, onClose, shownResources }) => {
    const getTranslation = useTranslation();
    const styles = useStyles();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);

    const viewAbilityConfigCallbackPairs = useRef(({ changed, viewableItems }: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
        if (changed) {
            const viewableSteps = viewableItems.map((item) => item.index ?? 0);
            setCurrentStep(viewableSteps[0]);
        }
    });

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
            <SafeAreaProvider
                className={
                    Platform.OS === 'web'
                        ? 'overflow-hidden w-[450px] max-w-full max-h-[900px] mx-auto my-auto border border-gray-200 dark:border-gray-800 rounded-lg pt-12'
                        : 'flex-1'
                }
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.headingContainer}>
                        <MyText style={styles.heading}>{build.title}</MyText>

                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome5 name="times" size={24} style={styles.icon} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        decelerationRate={0.1}
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
                                shownResources={shownResources}
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
                        <BuildOrderButton fullWidth disabled={currentStep === 0} onPress={() => goToStep(currentStep - 1)}>
                            {getTranslation('builds.focus.previous')}
                        </BuildOrderButton>
                        <BuildOrderButton fullWidth disabled={currentStep === build.build.length - 1} onPress={() => goToStep(currentStep + 1)}>
                            {getTranslation('builds.focus.next')}
                        </BuildOrderButton>
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            paddingBottom: 8,
        },
        heading: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        buttonsContainer: {
            flexDirection: 'row',
            padding: 16,
            gap: 12,
        },
        icon: {
            color: theme.textColor,
        },
    })
);

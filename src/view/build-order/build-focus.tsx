import React, { useRef, useState } from 'react';
import { FlatList, GestureResponderEvent, Modal, Platform, TouchableOpacity, View, ViewToken } from 'react-native';
import { Step } from '../components/build-order/step';
import { SafeAreaProvider, SafeAreaView } from '@/src/components/uniwind/safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { BuildOrderButton } from '../components/build-order-button';
import { useTranslation } from '@app/helper/translate';
import { IBuildOrder, IBuildOrderStandardResources } from '@/data/src/helper/builds';
import { Text } from '@app/components/text';
import { useAppTheme } from '@app/theming';

export const BuildFocus: React.FC<{
    build: IBuildOrder;
    visible: boolean;
    shownResources: Array<keyof IBuildOrderStandardResources>;
    onClose: (event: GestureResponderEvent) => void;
}> = ({ build, visible, onClose, shownResources }) => {
    const getTranslation = useTranslation();
    const [currentStep, setCurrentStep] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);
    const theme = useAppTheme();

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
        <Modal className="flex-1 bg-white dark:bg-blue-950" visible={visible} animationType="slide">
            <SafeAreaProvider
                className={
                    Platform.OS === 'web'
                        ? 'overflow-hidden w-[450px] max-w-full max-h-[900px] mx-auto my-auto border border-gray-200 dark:border-gray-800 rounded-lg pt-12'
                        : 'flex-1'
                }
            >
                <SafeAreaView className="flex-1 bg-white dark:bg-blue-950">
                    <View className="flex-row justify-between items-center p-4 pb-2">
                        <Text variant="header-lg">{build.title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <FontAwesome5 name="times" size={24} color={theme.textColor} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        decelerationRate={0.1}
                        snapToInterval={250}
                        viewabilityConfig={{
                            itemVisiblePercentThreshold: 100,
                        }}
                        onViewableItemsChanged={viewAbilityConfigCallbackPairs.current}
                        className="flex-1 bg-white dark:bg-blue-950"
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
                        contentContainerClassName="px-4 py-2 gap-4"
                    />

                    <View className="flex-row p-4 gap-3">
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


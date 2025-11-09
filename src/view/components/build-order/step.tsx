import { IBuildOrder, IBuildOrderStandardResources, IBuildOrderStep } from '@/data/src/helper/builds';
import { GestureResponderEvent, Pressable, View } from 'react-native';
import { ResourceAlloc } from './step-resource';
import { StepActions } from './step-actions';
import { Text } from '@app/components/text';
import { useEffect } from 'react';
import { useAppTheme } from '../../../theming';
import { startCase } from 'lodash';
import { useTranslation } from '@app/helper/translate';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

export interface StepProps {
    highlighted: boolean;
    index: number;
    count: number;
    step: IBuildOrderStep;
    build: IBuildOrder;
    shownResources: Array<keyof IBuildOrderStandardResources>;
    onPress: (event: GestureResponderEvent) => void;
}

export const Step: React.FC<StepProps> = ({ highlighted, step, build, onPress, index, count, shownResources }) => {
    const getTranslation = useTranslation();
    const { resources } = step;
    const opacity = useSharedValue(0);
    const theme = useAppTheme();

    useEffect(() => {
        const toValue = highlighted ? 1 : 0;
        opacity.value = withTiming(toValue, { duration: 250 });
    }, [opacity, highlighted]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(opacity.value, [0, 1], [0.25, 1]),
            backgroundColor: interpolateColor(
                opacity.value,
                [0, 1],
                [theme.skeletonColor, theme.backgroundColor]
            ),
        };
    });

    return (
        <Animated.View
            className="flex-col h-[235px] rounded-sm shadow-md"
            style={[
                animatedStyle,
            ]}
        >
            <Pressable onPress={onPress} className="flex-1 rounded-lg overflow-hidden">
                <View className="flex-row items-center justify-between p-4 bg-skeleton">
                    <Text variant="header">
                        {getTranslation('builds.step.currentstep', {
                            step: index + 1,
                        })}{' '}
                        <Text variant="body-xl">
                            {getTranslation('builds.step.maxstep', {
                                max: count,
                            })}
                        </Text>
                    </Text>
                </View>
                <View className="flex-1 justify-center items-center">
                    <View className="p-4">
                        <StepActions {...step} pop={step.age === 'feudalAge' ? build.pop[step.age] : undefined} />

                        <Text variant="header">{step.text}</Text>
                    </View>
                </View>
                <View className="flex-row items-center justify-between p-4 bg-skeleton">
                    {shownResources.map((resourceName) => (
                        <ResourceAlloc resource={startCase(resourceName)} count={resources[resourceName]} key={resourceName} />
                    ))}
                </View>
            </Pressable>
        </Animated.View>
    );
};

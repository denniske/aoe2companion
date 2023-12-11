import { createStylesheet } from '../../../theming-new';
import { IBuildOrder, IBuildOrderStep } from '../../../../../data/src/helper/builds';
import { Animated, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import { MyText } from '../my-text';
import { ResourceAlloc } from './step-resource';
import { StepActions } from './step-actions';
import { useEffect, useRef } from 'react';
import { useAppTheme } from '../../../theming';
import { getTranslation } from '../../../helper/translate';

export interface StepProps {
    highlighted: boolean;
    index: number;
    count: number;
    step: IBuildOrderStep;
    build: IBuildOrder;
    onPress: (event: GestureResponderEvent) => void;
}

export const Step: React.FC<StepProps> = ({ highlighted, step, build, onPress, index, count }) => {
    const { resources } = step;
    const styles = useStyles();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const theme = useAppTheme();

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: highlighted ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim, highlighted]);

    return (
        <Animated.View
            style={[
                styles.step,
                {
                    opacity: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.25, 1],
                    }),
                    backgroundColor: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [theme.skeletonColor, theme.backgroundColor],
                    }),
                },
            ]}
        >
            <Pressable onPress={onPress} style={styles.stepPressable}>
                <View style={styles.stepHeader}>
                    <MyText style={styles.text}>
                        {getTranslation('builds.step.currentstep', {
                            step: index + 1,
                        })}{' '}
                        <MyText style={[styles.text, styles.textNormal]}>
                            {getTranslation('builds.step.maxstep', {
                                max: count,
                            })}
                        </MyText>
                    </MyText>
                </View>
                <View style={styles.stepCentered}>
                    <View style={styles.stepBody}>
                        <StepActions {...step} pop={step.age === 'feudalAge' ? build.pop[step.age] : undefined} />

                        <MyText style={styles.text}>{step.text}</MyText>
                    </View>
                </View>
                <View style={styles.stepFooter}>
                    <ResourceAlloc resource="Wood" count={resources.wood} />
                    <ResourceAlloc resource="Food" count={resources.food} />
                    <ResourceAlloc resource="Gold" count={resources.gold} />
                </View>
            </Pressable>
        </Animated.View>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        step: {
            flexDirection: 'column',
            height: 235,
            borderRadius: 4,
            elevation: 4,
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
        },
        stepPressable: {
            flex: 1,
        },
        stepCentered: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        stepBody: {
            padding: 15,
        },
        stepFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.skeletonColor,
            padding: 15,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
        },
        stepHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.skeletonColor,
            padding: 15,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
        },
        text: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        textNormal: {
            fontWeight: 'normal',
        },
    })
);

import React, { Fragment, useMemo, useState } from 'react';
import { StyleSheet, View, Linking, ScrollView } from 'react-native';
import { createStylesheet } from '../../theming-new';
import { IBuildOrder, IBuildOrderStandardResources, sortBuildAges } from '../../../../data/src/helper/builds';
import { MyText } from '../components/my-text';
import { BuildFocus } from './build-focus';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../App2';
import { Button } from '../components/button';
import { Tag } from '../components/tag';
import { getDifficultyIcon, getDifficultyName } from '../../helper/difficulties';
import startCase from 'lodash/startCase';
import { getAgeIcon, getOtherIcon } from '../../helper/units';
import { BuildRating } from '../components/build-order/build-rating';
import { Image } from 'expo-image';
import { getTranslation } from '../../helper/translate';
import { StepActions } from '../components/build-order/step-actions';

const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const ResourceIcons: React.FC<{ shownResources: Array<keyof IBuildOrderStandardResources> }> = ({ shownResources }) => {
    const styles = useStyles();

    return (
        <View style={styles.stepResources}>
            {shownResources.map((resourceName) => (
                <View style={styles.stepResource} key={resourceName}>
                    <Image source={getOtherIcon(startCase(resourceName) as any)} style={styles.stepResourceImage} />
                </View>
            ))}
        </View>
    );
};

export const BuildDetail: React.FC<IBuildOrder> = (build) => {
    const styles = useStyles();
    const navigation = useNavigation<NavigationProp<RootStackParamList, 'Guide'>>();
    const route = useRoute<RouteProp<RootStackParamList, 'Guide'>>();
    const [focused, setFocused] = useState(!!route.params.focusMode);
    const difficultyIcon = getDifficultyIcon(build.difficulty);
    const ages = sortBuildAges(Object.entries(build.pop));
    const uptimes: Record<string, any> = build.uptime;

    const shownResources = useMemo(() => {
        const initialAllocations: IBuildOrderStandardResources = { food: 0, wood: 0, gold: 0, stone: 0, build: 0 };
        const allocations = build.build
            .map((step) => step.resources)
            .reduce((acc, resources) => {
                acc.food += resources.food;
                acc.wood += resources.wood;
                acc.gold += resources.gold;
                acc.stone += resources.stone;
                acc.build += resources.build;
                return acc;
            }, initialAllocations);

        return Object.entries(allocations)
            .filter(([_, totalOnResource]) => totalOnResource > 0)
            .map(([resourceName]) => resourceName) as Array<keyof IBuildOrderStandardResources>;
    }, [build]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <MyText>{build.description}</MyText>

            <MyText>
                {getTranslation('builds.detail.createdBy', {
                    author: build.author,
                })}{' '}
                {build.reference && (
                    <MyText onPress={() => Linking.openURL(build.reference ?? '')} style={styles.link}>
                        {getTranslation('builds.detail.source')}
                    </MyText>
                )}
            </MyText>

            <Image source={{ uri: build.imageURL }} style={styles.image} />

            <View style={styles.tagsContainer}>
                {ages.map(([ageName, agePop]) => (
                    <Tag key={ageName} icon={getAgeIcon(startCase(ageName.replace('Age', '')) as any)}>
                        {ageName === 'feudalAge'
                            ? getTranslation('builds.detail.pop', {
                                  pop: agePop,
                                  age: uptimes[ageName],
                              })
                            : getTranslation('builds.detail.vills', {
                                  pop: agePop,
                                  age: uptimes[ageName],
                              })}
                    </Tag>
                ))}
            </View>

            <View style={styles.tagsContainer}>
                {difficultyIcon && <Tag icon={difficultyIcon}>{getDifficultyName(build.difficulty)}</Tag>}
                {build.attributes.map((attribute) => (
                    <Tag key={attribute}>{startCase(attribute)}</Tag>
                ))}
            </View>

            <View style={styles.tagsContainer}>
                <BuildRating {...build} />
            </View>

            <Button onPress={() => setFocused(true)}>{getTranslation('builds.detail.focus')}</Button>

            <View style={[styles.stepRow, styles.stepRowDivider]}>
                <View style={styles.stepActions} />
                <ResourceIcons shownResources={shownResources} />
            </View>
            {build.build.map((step, index) => (
                <Fragment key={index.toString()}>
                    {step.type === 'newAge' ? (
                        <View style={[styles.stepRow, styles.ageRow]}>
                            <View style={[styles.stepActions, styles.ageActions]}>
                                {step.age && <Image source={getOtherIcon(capitalize(step.age) as any)} style={styles.agePic} />}
                                <MyText style={styles.ageName}>{startCase(step.age)}</MyText>
                            </View>

                            <ResourceIcons shownResources={shownResources} />
                        </View>
                    ) : (
                        <View style={styles.stepRow}>
                            <View style={styles.stepActions}>
                                <StepActions {...step} size="small" />
                                {step.text && <MyText style={styles.stepText}>{step.text}</MyText>}
                            </View>
                            <View style={styles.stepResources}>
                                {shownResources.map((resourceName) => (
                                    <View style={styles.stepResource} key={resourceName}>
                                        {step.resources[resourceName] > 0 && (
                                            <MyText style={styles.stepResourceText}>{step.resources[resourceName]}</MyText>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {step.type === 'ageUp' && index !== build.build.length - 1 && build.build[index + 1].type !== 'newAge' && (
                        <View style={[styles.stepRow, styles.ageRow]}>
                            <View style={styles.stepActions}>
                                <MyText style={styles.beforeAgeName}>
                                    {getTranslation('builds.detail.beforeAge', { age: startCase(step.age) })}
                                </MyText>
                            </View>

                            <ResourceIcons shownResources={shownResources} />
                        </View>
                    )}
                </Fragment>
            ))}

            <BuildFocus
                shownResources={shownResources}
                build={build}
                visible={focused}
                onClose={() => {
                    setFocused(false);
                    if (route.params.focusMode) {
                        navigation.goBack();
                    }
                }}
            />
        </ScrollView>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        contentContainer: {
            padding: 16,
            gap: 16,
        },
        tagsContainer: {
            flexDirection: 'row',
            gap: 4,
            justifyContent: 'center',
        },
        image: {
            height: 100,
            width: 100,
            alignSelf: 'center',
        },
        link: {
            color: theme.linkColor,
        },
        stepRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        stepRowDivider: {
            paddingBottom: 10,
            marginBottom: 10,
            borderBottomWidth: 1,
            borderColor: theme.borderColor,
        },
        ageRow: {
            paddingTop: 10,
            marginTop: 10,
            marginBottom: 10,
            borderTopWidth: 1,
            borderColor: theme.borderColor,
        },
        agePic: {
            width: 24,
            aspectRatio: 1,
            resizeMode: 'contain',
        },
        ageName: {
            fontSize: 20,
        },
        beforeAgeName: {
            fontStyle: 'italic',
            fontSize: 20,
        },
        ageActions: {
            flex: 1,
            gap: 4,
            flexDirection: 'row',
        },
        stepActions: {
            flex: 1,
        },
        stepResources: {
            flexDirection: 'row',
        },
        stepText: {
            fontSize: 14,
        },
        stepResource: {
            width: 25,
            justifyContent: 'center',
            alignItems: 'center',
        },
        stepResourceImage: {
            width: 16,
            height: 16,
        },
        stepResourceText: {
            fontWeight: 'bold',
        },
    })
);

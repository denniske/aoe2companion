import { HeaderTitle } from '@app/components/header-title';
import { Icon } from '@app/components/icon';
import { ScrollView } from '@app/components/scroll-view';
import { genericCivIcon, getCivIconLocal } from '@app/helper/civs';
import { Image } from '@/src/components/uniwind/image';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import startCase from 'lodash/startCase';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IBuildOrderStandardResources, sortBuildAges } from '@/data/src/helper/builds';
import { getDifficultyIcon, getDifficultyName } from '../../../helper/difficulties';
import { getAgeIcon, getOtherIcon } from '../../../helper/units';
import { createStylesheet } from '../../../theming-new';
import { BuildFocus } from '../../../view/build-order/build-focus';
import { BuildRating } from '../../../view/components/build-order/build-rating';
import { StepActions } from '../../../view/components/build-order/step-actions';
import { BuildOrderButton } from '../../../view/components/build-order-button';
import { MyText } from '../../../view/components/my-text';
import { Tag } from '../../../view/components/tag';
import { useTranslation } from '@app/helper/translate';
import { isValidUrl } from '@app/api/helper/util';
import { useBuild } from '@app/queries/all';
import { useFavoritedBuild } from '@app/service/favorite-builds';

const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const ResourceIcons: React.FC<{ shownResources: (keyof IBuildOrderStandardResources)[] }> = ({ shownResources }) => {
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

interface FavoriteHeaderButtonProps {
    id: string;
}

// Due to some bug in expo-router we cannot use useLocalSearchParams
// so we need to pass the params as a prop
export function FavoriteHeaderButton(props: FavoriteHeaderButtonProps) {
    const { id = '' } = props;
    const { toggleFavorite, isFavorited } = useFavoritedBuild(id);

    return (
        <TouchableOpacity hitSlop={10} onPress={toggleFavorite}>
            <Icon prefix={isFavorited ? 'fass' : 'fasr'} icon="heart" size={20} color="accent-[#ef4444]" />
        </TouchableOpacity>
    );
}

export default function BuildDetail() {
    const getTranslation = useTranslation();
    const styles = useStyles();
    const { id = '', focusMode } = useLocalSearchParams<{ id: string; focusMode: string }>();
    const { data: build } = useBuild(id);
    const [focused, setFocused] = useState(!!focusMode);


    useEffect(() => {
        if (Platform.OS === 'web') return;

        activateKeepAwakeAsync('guide-page');

        return () => {
            // It may happen that we did not activate the keep awake, so we need to catch the error.
            deactivateKeepAwake('guide-page').catch(() => {});
        };
    });

    const shownResources = useMemo(() => {
        if (!build) return [];
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
            .map(([resourceName]) => resourceName) as (keyof IBuildOrderStandardResources)[];
    }, [build]);

    if (!build) {
        return <View />;
    }

    const difficultyIcon = getDifficultyIcon(build.difficulty);
    const ages = sortBuildAges(Object.entries(build.pop));
    const uptimes: Record<string, any> = build.uptime;

    return (
        <ScrollView style={styles.container} contentContainerClassName="p-4 gap-4">
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <HeaderTitle
                            title={build.civilization}
                            subtitle={build.title.replace(build.civilization, '')}
                            icon={getCivIconLocal(build.civilization) ?? genericCivIcon}
                        />
                    ),
                    headerRight: () => <FavoriteHeaderButton id={id} />,
                }}
            />
            <MyText>{build.description}</MyText>

            <MyText>
                {getTranslation('builds.detail.createdBy', {
                    author: build.author,
                })}{' '}
                {build.reference && isValidUrl(build.reference) && (
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
                {difficultyIcon && <Tag icon={difficultyIcon}>{getDifficultyName(getTranslation, build.difficulty)}</Tag>}
                {build.attributes.map((attribute) => (
                    <Tag key={attribute}>{startCase(attribute)}</Tag>
                ))}
            </View>

            <View style={styles.tagsContainer}>
                <BuildRating {...build} />
            </View>

            <BuildOrderButton onPress={() => setFocused(true)}>{getTranslation('builds.detail.focus')}</BuildOrderButton>

            <View style={[styles.stepRow, styles.stepRowDivider]}>
                <View style={styles.stepActions} />
                <ResourceIcons shownResources={shownResources} />
            </View>
            {build.build.map((step, index) => (
                <Fragment key={index.toString()}>
                    {step.type === 'newAge' ? (
                        <View style={[styles.stepRow, styles.ageRow]}>
                            <View style={[styles.stepActions, styles.ageActions]}>
                                {step.age && <Image source={getAgeIcon(capitalize(step.age) as any)} contentFit="contain" style={styles.agePic} />}
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
                    if (focusMode) {
                        router.back();
                    }
                }}
            />
        </ScrollView>
    );
}

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
    } as const)
);

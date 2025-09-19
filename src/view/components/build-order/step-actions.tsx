import { createStylesheet } from '../../../theming-new';
import { IBuildOrderStep } from 'data/src/helper/builds';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import { getTechIcon } from '../../../helper/techs';
import {getAgeIcon, getOtherIcon, getUnitIcon} from '../../../helper/units';
import { FontAwesome5 } from '@expo/vector-icons';
import { getBuildingIcon } from '../../../helper/buildings';
import { MyText } from '../my-text';
import { startCase } from 'lodash';
import { Fragment } from 'react';
import { Image } from 'expo-image';
import { useTranslation } from '@app/helper/translate';

type Size = 'small' | 'large';

const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

const taskMap: Record<NonNullable<IBuildOrderStep['task']>, ImageSourcePropType> = {
    wood: getOtherIcon('Wood'),
    food: getOtherIcon('Food'),
    gold: getOtherIcon('Gold'),
    stone: getOtherIcon('Stone'),
    boar: getUnitIcon('Boar'),
    sheep: getUnitIcon('Sheep'),
    farm: getBuildingIcon('Farm'),
    berries: getOtherIcon('BerryBush'),
    // Need icons for the rest of these units!
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

const PlusIcon: React.FC<{ move?: boolean; size: Size }> = ({ move, size }) => {
    const styles = useStyles();

    return <FontAwesome5 name={move ? 'arrow-right' : 'plus'} size={size === 'small' ? 10 : 14} style={styles.plusIcon} />;
};

const TaskIcon: React.FC<{ item?: string; size: Size }> = ({ item, size }) => {
    const styles = useStyles();
    const taskIcon = item ? taskMap[item as unknown as NonNullable<IBuildOrderStep['task']>] : getBuildingIcon('House');
    const sizeNumber = size === 'small' ? 20 : 30;
    const textStyle = size === 'small' ? styles.smallText : styles.text;

    if (!taskIcon) {
        return <MyText style={textStyle}>{startCase(item)}</MyText>;
    }

    return <Image source={taskIcon} style={[item === 'berries' ? styles.pic2 : styles.pic, { height: sizeNumber }]} />;
};

function mapBuilding(building: string): string {
    switch (building) {
        case 'Wall':
            return 'StoneWall';
        default:
            return building;
    }
}

export const StepActions: React.FC<IBuildOrderStep & { pop?: string | number; size?: Size }> = (step) => {
    const getTranslation = useTranslation();
    const styles = useStyles();
    const { buildings, tech, type, count, task, from, to, age, unit, pop, action, resource, size = 'large' } = step;
    const hasBuildings = !!buildings?.length;
    const hasTech = !!tech?.length;
    const hasBuildingsOrTech = hasBuildings || hasTech;
    const sizeNumber = size === 'small' ? 20 : 30;
    const textStyle = size === 'small' ? styles.smallText : styles.text;


    console.log('tech', tech)

    return (
        <View
            style={[
                styles.row,
                {
                    gap: size === 'small' ? 4 : 8,
                },
            ]}
        >
            {hasBuildings && <MyText style={textStyle}>{getTranslation('builds.step.build')}</MyText>}
            {buildings?.map((building, index) => (
                <Fragment key={`${building.type}-${index}`}>
                    {index > 0 ? <PlusIcon size={size} /> : null}
                    {Array(building.count)
                        .fill(0)
                        .map((_, count) => (
                            <Image
                                key={`${building.type}-${count}-${index}`}
                                source={getBuildingIcon(mapBuilding(capitalize(building.type)) as any)}
                                style={[styles.buildingPic, { height: size === 'small' ? 20 : 40 }]}
                                alt={building.type}
                            />
                        ))}
                </Fragment>
            ))}

            {hasTech && <MyText style={textStyle}>{getTranslation('builds.step.research')}</MyText>}
            {tech?.map((tech, index) => (
                <Fragment key={tech}>
                    {index > 0 ? <PlusIcon size={size} /> : null}

                    <Image
                        source={getTechIcon(capitalize(tech) as any) || getUnitIcon(capitalize(tech) as any)}
                        style={[styles.buildingPic, { height: size === 'small' ? 20 : 40 }]}
                    />
                </Fragment>
            ))}

            {hasBuildingsOrTech && ['newVillagers', 'moveVillagers', 'trainUnit', 'ageUp', 'newAge'].includes(type) ? <PlusIcon size={size} /> : null}

            {type === 'newVillagers' && (
                <>
                    <MyText style={textStyle}>{getTranslation('builds.step.newvills', { count })}</MyText>
                    <TaskIcon item={task} size={size} />
                </>
            )}
            {type === 'moveVillagers' && (
                <>
                    <MyText style={textStyle}>{count}</MyText>
                    <TaskIcon item={from} size={size} />
                    <PlusIcon move size={size} />
                    <MyText style={textStyle}>{count}</MyText>
                    <TaskIcon item={to} size={size} />
                </>
            )}
            {type === 'lure' && (
                <>
                    <MyText style={textStyle}>{getTranslation('builds.step.lure', { count })}</MyText>
                    <TaskIcon item="deer" size={size} />
                </>
            )}
            {type === 'trade' && (
                <>
                    <MyText style={textStyle}>{getTranslation('builds.step.trade', { action: startCase(action), count })}</MyText>
                    <TaskIcon item={resource} size={size} />
                </>
            )}
            {type === 'collectGold' && <MyText style={textStyle}>{startCase(task)}</MyText>}
            {type === 'decision' && <MyText style={textStyle}>{getTranslation('builds.step.decision')}</MyText>}

            {type === 'trainUnit' && (
                <>
                    {count === '∞' ? (
                        <MyText style={textStyle}>
                            {getTranslation('builds.step.training.start', {
                                unit: startCase(unit),
                            })}
                        </MyText>
                    ) : (
                        <MyText style={textStyle}>
                            {getTranslation(count === 1 ? 'builds.step.training.singular' : 'builds.step.training.plural', {
                                count,
                                unit: startCase(unit),
                            })}
                        </MyText>
                    )}
                </>
            )}
            {type === 'ageUp' && (
                <>
                    <MyText style={textStyle}>{getTranslation(pop ? 'builds.step.ageupwithpop' : 'builds.step.ageup', { pop })}</MyText>
                    <Image source={getAgeIcon(capitalize(age!) as any)} style={[styles.pic, { height: sizeNumber }]} />
                </>
            )}
            {type === 'newAge' && (
                <>
                    <MyText style={textStyle}>{getTranslation(pop ? 'builds.step.newagewithpop' : 'builds.step.newage', { pop })}</MyText>
                    <Image source={getAgeIcon(capitalize(age!) as any)} style={[styles.pic, { height: sizeNumber }]} />
                </>
            )}
        </View>
    );
};

const useStyles = createStylesheet((theme, darkMode) =>
    StyleSheet.create({
        smallText: {
            fontSize: 14,
            fontWeight: '500',
        },
        text: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
        },
        buildingPic: {
            aspectRatio: 1,
            borderColor: theme.borderColor,
            borderWidth: 1,
        },
        pic: {
            aspectRatio: 1,
        },
        pic2: {
            aspectRatio: 1.5,
        },
        plusIcon: {
            color: theme.textNoteColor,
        },
    } as const)
);

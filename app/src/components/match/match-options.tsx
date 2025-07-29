import React, { Fragment } from 'react';
import { Canvas, Rect, vec, Line, Group, Circle, useSVG, ImageSVG } from '@shopify/react-native-skia';
import { ActivityIndicator, View } from 'react-native';
import { Image } from 'expo-image';
import { IAnalysis, IMatchNew } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { compact, sortBy, uniq } from 'lodash';
import { gaiaObjects, getBuildingSize } from '@app/view/components/match-map/map-utils';
import { getPath, getTileMap, setTiles, splitPath } from '@app/view/components/match-map/match-map3';
import groupBy from 'lodash/groupBy';
import { runOnJS, useAnimatedReaction, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import TimeScrubber from '@app/view/components/match-map/time-scrubber';
import Faded from '../../view/components/match-map/draw/faded';
import Wall, { getWallOrigin } from '../../view/components/match-map/draw/wall';
import Building, { getBuildingOrigin } from '@app/view/components/match-map/draw/building';
import Special, { getSpecialOrigin } from '@app/view/components/match-map/draw/special';
import Chat from '@app/view/components/match-map/chat';
import Legend from '../../view/components/match-map/legend';
import Uptimes from '@app/view/components/match-map/uptimes';
import Eapm from '@app/view/components/match-map/eapm';
import { useMatchAnalysis, useMatchAnalysisSvg, useWithRefetching } from '@app/queries/all';
import SkiaLoader from '@app/components/skia-loader';
import { Button } from '@app/components/button';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from '@app/helper/translate';
import { useAppTheme } from '@app/theming';
import { Card } from '@app/components/card';

interface Props {
    match: IMatchNew;
}

export default function MatchOptions(props: Props) {
    const { match } = props;
    const getTranslation = useTranslation();
    const theme = useAppTheme();

    return (
        <Card direction="vertical">
            <View className="flex-col gap-1">
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.gameMode')}:</Text>
                    <Text className="flex-1">{match.gameModeName}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.map')}:</Text>
                    <Text className="flex-1">{match.mapName}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.mapsize')}:</Text>
                    <Text className="flex-1">{match.mapSizeName}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.aidifficulty')}:</Text>
                    <Text className="flex-1">{match.difficultyName}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.resources')}:</Text>
                    <Text className="flex-1">{match.resourcesName}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.population')}:</Text>
                    <Text className="flex-1">{match.population}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.gamespeed')}:</Text>
                    <Text className="flex-1">{match.speedName}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.revealmap')}:</Text>
                    <Text className="flex-1">{match.revealMapName}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.startingage')}:</Text>
                    <Text className="flex-1">{match.startingAgeName}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.endingage')}:</Text>
                    <Text className="flex-1">{match.endingAgeName}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.treatylength')}:</Text>
                    <Text className="flex-1">{match.treatyLength} minutes</Text>
                </View>
                <View className="flex-row items-center gap-1">
                    <Text className="w-[50%]">{getTranslation('match.victory')}:</Text>
                    <Text className="flex-1">{match.victoryName}</Text>
                </View>

                <View className="flex-row gap-1 mt-2">
                    <View className="flex-col gap-1 w-[50%]">
                        <Text className="mb-1">{getTranslation('match.teamSettings')}</Text>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.lockTeams ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.lockTeams')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.teamTogether ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.teamTogether')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.teamPositions ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.teamPositions')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.sharedExploration ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.sharedExploration')}</Text>
                        </View>
                    </View>
                    <View className="flex-col gap-1">
                        <Text className="mb-1">{getTranslation('match.advancedSettings')}</Text>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.lockSpeed ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.lockSpeed')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.allowCheats ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.allowCheats')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.turboMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.turboMode')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.fullTechTree ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.fullTechTree')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.empireWarsMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.empireWarsMode')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.suddenDeathMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.suddenDeathMode')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.regicideMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.regicideMode')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.antiquityMode ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.antiquityMode')}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                            <FontAwesome5 name={match.recordGame ? 'check-square' : 'square'} size={14} color={theme.textNoteColor} />
                            <Text>{getTranslation('match.recordGame')}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Card>
    );
}

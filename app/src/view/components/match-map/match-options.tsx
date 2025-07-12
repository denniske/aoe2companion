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
import Faded from './draw/faded';
import Wall, { getWallOrigin } from './draw/wall';
import Building, { getBuildingOrigin } from '@app/view/components/match-map/draw/building';
import Special, { getSpecialOrigin } from '@app/view/components/match-map/draw/special';
import Chat from '@app/view/components/match-map/chat';
import Legend from './legend';
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
        // <View className="flex-col gap-1 bg-white dark:bg-blue-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <View className="flex-col gap-1">
        {/*<Card><View className="flex-col gap-1">*/}
            {/*<Text className="mb-1">{getTranslation('match.gameSettings')}</Text>*/}
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.gameMode')}:</Text>
                <Text>{match.gameModeName}</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.map')}:</Text>
                <Text>{match.mapName}</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.mapsize')}:</Text>
                <Text>{match.mapSizeName}</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.aidifficulty')}:</Text>
                <Text>{match.difficultyName}</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.resources')}:</Text>
                <Text>{match.resourcesName}</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.population')}:</Text>
                <Text>{match.population}</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.gamespeed')}:</Text>
                <Text>{match.speedName}</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.revealmap')}:</Text>
                <Text>{match.revealMapName}</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.startingage')}:</Text>
                <Text>{match.startingAgeName}</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.endingage')}:</Text>
                <Text>{match.endingAgeName}</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.treatylength')}:</Text>
                <Text>{match.treatyLength} minutes</Text>
            </View>
            <View className="flex-row items-center gap-1">
                <Text className="w-[180px]">{getTranslation('match.victory')}:</Text>
                <Text>{match.victoryName}</Text>
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
        {/*</View></Card>*/}
        </View>
    );
}

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
import { useTranslation } from '@app/helper/translate';

interface Props {
    match?: IMatchNew;
    matchError?: Error | null;
    matchLoading?: boolean;
}

export default function MatchAnalysis(props: Props) {
    const { match, matchError, matchLoading } = props;
    const [analyzeNow, setAnalyzeNow] = React.useState(false);

    const { data: analysis, error: analysisError, isLoading: analysisLoading } =
        useWithRefetching(useMatchAnalysis(match!.matchId, !!match && analyzeNow));

    const { data: analysisSvgUrl } =
        useWithRefetching(useMatchAnalysisSvg(match!.matchId, !!analysis));

    return (
        <View>
            {matchError && (
                <View className="bg-red-100 p-4 rounded-lg">
                    <Text className="text-red-800">{matchError?.message}</Text>
                </View>
            )}
            {analysisError && (
                <View className="bg-red-100 p-4 rounded-lg">
                    <Text className="text-red-800">{analysisError?.message}</Text>
                </View>
            )}
            {analysis && !analysisError && (
                <SkiaLoader
                    getComponent={() => import('@app/view/components/match-map/match-map')}
                    fallback={
                        <View className="flex-row items-center justify-center h-20">
                            <View className="flex-row justify-center my-3 gap-2">
                                <ActivityIndicator animating size="small" color="#999" />
                                <Text variant="body" className="text-center py-1">Loading Analysis (Skia)...</Text>
                            </View>
                        </View>
                    }
                    componentProps={{
                        match,
                        analysis,
                        analysisSvgUrl,
                    }}
                />
            )}

            {matchLoading ||
                (analysisLoading && (
                    <View className="flex-row items-center justify-center h-20">
                        <View className="flex-row justify-center my-3 gap-2">
                            <ActivityIndicator animating size="small" color="#999" />
                            <Text variant="body" className="text-center py-1">Loading Analysis...</Text>
                        </View>
                    </View>
                ))}

            {!analysis && !analysisError && !analyzeNow && match?.finished && (
                <View className="flex-row items-center justify-center h-20">
                    <View className="flex-row justify-center my-3 gap-2">
                        <Button onPress={() => setAnalyzeNow(true)}>Analyze match (Beta)</Button>
                    </View>
                </View>
            )}
        </View>
    );
}

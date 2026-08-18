import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { IMatchNew } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { useMatchAnalysis, useMatchAnalysisSvg, useWithRefetching } from '@app/queries/all';
import SkiaLoader from '@app/components/skia-loader';
import { Button } from '@app/components/button';
import { appConfig } from '@nex/dataset';
import { FetchNotOkError } from '@app/api/util';
import { useTranslation } from '@app/helper/translate';

interface Props {
    match?: IMatchNew;
    matchError?: Error | null;
    matchLoading?: boolean;
}

// Hoisted rather than written inline in JSX: React Compiler cannot lower a
// dynamic `import()` expression and bails out on the whole component. The lazy
// loading behaviour is unchanged — the import still only runs when SkiaLoader
// calls this.
const loadMatchMap = () => import('@app/view/components/match-map/match-map');

export default function MatchAnalysis(props: Props) {
    const getTranslation = useTranslation();
    const { match, matchError, matchLoading } = props;
    const [analyzeNow, setAnalyzeNow] = React.useState(false);

    const {
        data: analysis,
        error: analysisError,
        isLoading: analysisLoading,
        refetch: analysisRefetch,
        isRefetching: analysisIsRefetching,
    } = useWithRefetching(useMatchAnalysis(match!.matchId, !!match && analyzeNow));

    const { data: analysisSvgUrl } = useWithRefetching(useMatchAnalysisSvg(match!.matchId, !!analysis));

    return (
        <View>
            {!!(matchError) && (
                <View className="bg-red-100 p-4 rounded-lg">
                    <Text color="text-red-800">{matchError?.message}</Text>
                </View>
            )}
            {analysisError && !analysisIsRefetching && (
                <>
                    <View className="bg-red-100 p-4 rounded-lg">
                        <Text color="text-red-800">{analysisError?.message}</Text>
                    </View>
                    {(analysisError as FetchNotOkError)?.status === 503 && (
                        <View className="flex-row items-center justify-center h-20">
                            <View className="flex-row justify-center my-3 gap-2">
                                <Button onPress={() => analysisRefetch()}>{getTranslation('matchanalysis.retry')}</Button>
                            </View>
                        </View>
                    )}
                </>
            )}
            {analysis && !analysisError && (
                <SkiaLoader
                    getComponent={loadMatchMap}
                    fallback={
                        <View className="flex-row items-center justify-center h-20">
                            <View className="flex-row justify-center my-3 gap-2">
                                <ActivityIndicator animating size="small" color="#999" />
                                <Text variant="body" className="text-center py-1">
                                    {getTranslation('matchanalysis.loading.skia')}
                                </Text>
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
                            <Text variant="body" className="text-center py-1">
                                {getTranslation('matchanalysis.loading')}
                            </Text>
                        </View>
                    </View>
                ))}

            {!analysis && !analysisError && !analyzeNow && match?.finished && appConfig.game === 'aoe2' && (
                <View className="flex-row items-center justify-center h-20">
                    <View className="flex-row justify-center my-3 gap-2">
                        <Button onPress={() => setAnalyzeNow(true)}>{getTranslation('matchanalysis.analyzematch')}</Button>
                    </View>
                </View>
            )}
        </View>
    );
}

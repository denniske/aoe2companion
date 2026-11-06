import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { Link } from '@app/components/link';
import SkiaLoader from '@app/components/skia-loader';
import { useTranslation } from '@app/helper/translate';
import { useUploadedAnalysis, useWithRefetching } from '@app/queries/all';
import { getUploadedAnalysisSvgUrl } from '@app/api/helper/api';

// Same hoisting as match-analysis.tsx: React Compiler cannot lower an inline dynamic import().
const loadMatchMap = () => import('@app/view/components/match-map/match-map');

export default function UploadedAnalysisPage() {
    const getTranslation = useTranslation();
    const { uploadId } = useLocalSearchParams<{ uploadId: string }>();
    const { data, error, isLoading } = useWithRefetching(useUploadedAnalysis(uploadId));

    const loading = (text: string) => (
        <View className="flex-row items-center justify-center h-20 gap-2">
            <ActivityIndicator animating size="small" color="#999" />
            <Text>{text}</Text>
        </View>
    );

    return (
        <ScrollView contentContainerClassName="p-4 gap-4">
            <Stack.Screen options={{ title: data?.match.mapName ?? getTranslation('matchanalysis.upload.title') }} />

            {error && (
                <View className="bg-red-100 p-4 rounded-lg">
                    <Text color="text-red-800">{(error as Error).message}</Text>
                </View>
            )}

            {isLoading && loading(getTranslation('matchanalysis.loading'))}

            {data && (
                <>
                    {/* The analysis comes from a file anyone could have edited, so say so, and only
                        link to the official match instead of presenting this as its analysis. */}
                    <View className="bg-yellow-100 p-4 rounded-lg gap-1">
                        <Text color="text-yellow-900">{getTranslation('matchanalysis.upload.unverified')}</Text>
                        {data.matchedMatchId ? (
                            <Link href={`/matches/${data.matchedMatchId}`} color="text-blue-800">{getTranslation('matchanalysis.upload.viewmatch')}</Link>
                        ) : (
                            <Text variant="body-sm" color="text-yellow-900">
                                {getTranslation('matchanalysis.upload.nomatch')}
                            </Text>
                        )}
                    </View>

                    <SkiaLoader
                        getComponent={loadMatchMap}
                        fallback={loading(getTranslation('matchanalysis.loading.skia'))}
                        componentProps={{
                            match: data.match,
                            analysis: data.analysis,
                            analysisSvgUrl: getUploadedAnalysisSvgUrl(uploadId),
                        }}
                    />
                </>
            )}
        </ScrollView>
    );
}

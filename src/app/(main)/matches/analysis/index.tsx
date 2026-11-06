import React, { useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ScrollView } from '@app/components/scroll-view';
import { Text } from '@app/components/text';
import { Button } from '@app/components/button';
import { useTranslation } from '@app/helper/translate';
import { uploadRecording } from '@app/api/helper/api';
import { openLink } from '@app/helper/url';

// Picking a file on native needs expo-document-picker, a native module, which would need a new
// binary rather than an OTA update. Until then native sends users to the website.
const WEB_URL = 'https://www.aoe2companion.com/matches/analysis';

function pickFileOnWeb(): Promise<File | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.aoe2record,.zip';
        input.onchange = () => resolve(input.files?.[0] ?? null);
        input.click();
    });
}

export default function AnalysisUploadPage() {
    const getTranslation = useTranslation();
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onPick = async () => {
        const file = await pickFileOnWeb();
        if (!file) return;
        setError(null);
        setUploading(true);
        try {
            const uploadId = await uploadRecording(file);
            router.push(`/matches/analysis/${uploadId}`);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <ScrollView contentContainerClassName="p-4 gap-4">
            <Stack.Screen options={{ title: getTranslation('matchanalysis.upload.title') }} />
            <Text>{getTranslation('matchanalysis.upload.description')}</Text>
            <Text variant="body-sm" color="subtle">
                {getTranslation('matchanalysis.upload.location')}
            </Text>

            {error && (
                <View className="bg-red-100 p-4 rounded-lg">
                    <Text color="text-red-800">{error}</Text>
                </View>
            )}

            <View className="flex-row items-center gap-2">
                {Platform.OS === 'web' ? (
                    <Button onPress={onPick} disabled={uploading}>
                        {getTranslation('matchanalysis.upload.choose')}
                    </Button>
                ) : (
                    <Button onPress={() => openLink(WEB_URL)}>{getTranslation('matchanalysis.upload.openwebsite')}</Button>
                )}
                {uploading && (
                    <>
                        <ActivityIndicator animating size="small" color="#999" />
                        <Text>{getTranslation('matchanalysis.loading')}</Text>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

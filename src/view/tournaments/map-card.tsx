import { Button } from '@app/components/button';
import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { Image } from '@/src/components/uniwind/image';
import { Map } from '@app/api/liquipedia.types';
import { useState } from 'react';
import { View } from 'react-native';

import { BottomSheet } from '../bottom-sheet';
import { useTranslation } from '@app/helper/translate';

const MapAttribute: React.FC<{ label: string; value?: string }> = ({ label, value }) =>
    value === undefined ? null : (
        <View className="flex-row">
            <Text variant="label" className="w-24">
                {label}
            </Text>
            <Text className="flex-1">{value}</Text>
        </View>
    );

// The details are what Liquipedia's v3 API has on a map; its description is only on the wiki page, which the
// popup links to.
export const MapCard: React.FC<{ map: Map }> = ({ map }) => {
    const getTranslation = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View>
            <Card direction="vertical" className="p-4 w-36 gap-0" onPress={() => setIsVisible(true)}>
                {!!map.image && <Image source={{ uri: map.image }} contentFit="contain" style={{ aspectRatio: 2 }} />}
                <Text align="center" variant="label" className={map.image ? 'mt-2' : ''} numberOfLines={1}>
                    {map.name}
                </Text>
                {!!map.category && (
                    <Text align="center" variant="body-xs" numberOfLines={1}>
                        {map.category}
                    </Text>
                )}
            </Card>
            <BottomSheet closeButton isActive={isVisible} onClose={() => setIsVisible(false)} title={map.name}>
                <View className="mt-4 gap-4">
                    <View className="flex-row items-center gap-4">
                        {!!map.image && <Image source={{ uri: map.image }} contentFit="contain" className="w-36" style={{ aspectRatio: 2 }} />}
                        <View className="flex-1">
                            <MapAttribute label={getTranslation('tournaments.map.creator')} value={map.creator} />
                            <MapAttribute label={getTranslation('tournaments.map.type')} value={map.category} />
                        </View>
                    </View>
                    <Button align="center" href={`https://liquipedia.net/ageofempires/${encodeURIComponent(map.path)}`}>
                        {getTranslation('tournaments.gotoliquipedia')}
                    </Button>
                </View>
            </BottomSheet>
        </View>
    );
};

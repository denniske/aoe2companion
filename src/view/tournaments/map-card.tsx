import { useMap } from '@app/api/tournaments';
import { Card } from '@app/components/card';
import { Text } from '@app/components/text';
import { Image } from 'expo-image';
import { Map } from 'liquipedia';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { TournamentMarkdown } from './tournament-markdown';
import {BottomSheet} from '../bottom-sheet';

const MapAttribute: React.FC<{ label: string; value?: string }> = ({ label, value }) =>
    value === undefined ? null : (
        <View className="flex-row">
            <Text variant="label" className="w-24">
                {label}
            </Text>
            <Text className="flex-1">{value}</Text>
        </View>
    );

export const MapCard: React.FC<{ map: Map }> = ({ map }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { data: mapDetails, isLoading } = useMap(map.path ?? '', isVisible);

    return (
        <View>
            <Card direction="vertical" className="p-4 w-36 gap-0" disabled={!map.path} onPress={() => setIsVisible(true)}>
                {map.image && <Image source={{ uri: map.image }} contentFit="contain" style={{ aspectRatio: 2 }} />}
                <Text align="center" variant="label" className={map.image && 'mt-2'} numberOfLines={1}>
                    {map.name}
                </Text>
                {map.category && (
                    <Text align="center" variant="body-xs" numberOfLines={1}>
                        {map.category}
                    </Text>
                )}
            </Card>
            <BottomSheet closeButton isFullHeight isActive={isVisible} onClose={() => setIsVisible(false)} title={map.name ?? mapDetails?.name}>
                <View className="mt-4">
                    {isLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <View className="gap-2">
                            <View className="flex-row items-center gap-4">
                                {(mapDetails?.image || map.image) && (
                                    <Image
                                        source={{ uri: mapDetails?.image || map.image }}
                                        contentFit="contain"
                                        className="w-36"
                                        style={{ aspectRatio: 2 }}
                                    />
                                )}
                                <View className="flex-1">
                                    <MapAttribute label="Creator" value={mapDetails?.creator} />
                                    <MapAttribute label="Map Type" value={mapDetails?.type} />
                                    <MapAttribute label="Walls" value={mapDetails?.walls} />
                                    <MapAttribute
                                        label="Nomad"
                                        value={mapDetails?.nomad === undefined ? undefined : mapDetails.nomad ? 'Yes' : 'No'}
                                    />
                                </View>
                            </View>

                            {mapDetails?.description ? <TournamentMarkdown>{mapDetails.description}</TournamentMarkdown> : null}

                            {mapDetails?.overview ? <TournamentMarkdown>{mapDetails.overview}</TournamentMarkdown> : null}
                        </View>
                    )}
                </View>
            </BottomSheet>
        </View>
    );
};

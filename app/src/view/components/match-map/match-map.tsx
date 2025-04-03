import React from 'react';
import { Canvas, Rect } from '@shopify/react-native-skia';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { IAnalysis } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { compact } from 'lodash';
import { gaiaObjects } from '@app/view/components/match-map/map-utils';

interface Props {
    match: any;
    analysis: IAnalysis;
    analysisSvgUrl: string;
}

export default function MatchMap(props: Props) {
    const { match, analysis, analysisSvgUrl } = props;

    if (!analysis) {
        return <Text>Loading...</Text>;
    }

    const size = 60 * 4 - 2;

    const dimension = analysis.map.dimension;

    const townCenters = compact(
        analysis.players.flatMap((p) => {
            return p.objects
                ?.filter((o) => o.name === 'Town Center' && o.objectId === 620)
                ?.map((o) => ({
                    x: o.position.x,
                    y: o.position.y,
                    color: p.color,
                }));
        })
    );

    const gaiaDraw = Object.keys(gaiaObjects).map((key) => {
        const info = gaiaObjects[key as keyof typeof gaiaObjects];
        return analysis
            .gaia!.filter((o) => info.names.includes(o.name) || (info as any).objectIds?.includes(o.name))
            .map((o) => ({
                x: o.position.x,
                y: o.position.y,
                color: info.color,
            }));
    });

    return (
        <View>
            <View className="flex-row justify-center border border-gray-300">
                <View className="relative w-60 h-60 border border-gray-700">
                    <View className="scale-y-[0.5] -rotate-45">
                        <Image
                            cachePolicy={'none'}
                            contentFit={'fill'}
                            style={{ width: size, height: size }}
                            // className="scale-y-[0.5] -rotate-45"
                            source={{ uri: analysisSvgUrl }}
                        ></Image>
                        <Canvas
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: size,
                                height: size,
                            }}
                        >
                            {gaiaDraw.map((gaiaObj) =>
                                gaiaObj.map((unit, index) => {
                                    const x = (unit.x / dimension) * size; // * size / 100;
                                    const y = (unit.y / dimension) * size; // * size / 100;

                                    return (
                                        <Rect
                                            key={index}
                                            width={(3 / dimension) * size}
                                            height={(3 / dimension) * size}
                                            x={x}
                                            y={y}
                                            color={unit.color}
                                        />
                                    );
                                })
                            )}
                            {townCenters.map((unit, index) => {
                                const x = (unit.x / dimension) * size; // * size / 100;
                                const y = (unit.y / dimension) * size; // * size / 100;

                                return (
                                    <Rect key={index} width={(3 / dimension) * size} height={(3 / dimension) * size} x={x} y={y} color={unit.color} />
                                );
                            })}
                        </Canvas>
                    </View>
                </View>
            </View>
        </View>
    );
}

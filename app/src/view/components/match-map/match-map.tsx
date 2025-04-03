import React from 'react';
import { Canvas, Rect, vec, Line, Group } from '@shopify/react-native-skia';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { IAnalysis } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';
import { compact, uniq } from 'lodash';
import { gaiaObjects, getBuildingSize } from '@app/view/components/match-map/map-utils';

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

    // const size = 60 * 4 - 2;
    const size = (60 * 4)*4 - 2;

    const dimension = analysis.map.dimension;

    const townCenters = compact(
        analysis.players.flatMap((p) => {
            return p.objects
                ?.filter((o) => o.name === 'Town Center' && o.objectId === 620)
                ?.map((o) => ({
                    position: o.position,
                    color: p.color,
                }));
        })
    );

    const buildings = compact(
        analysis.players.flatMap((p) => {
            return p.queuedBuildings
                ?.filter((o) => o.unit !== 'Farm')
                ?.filter((o) => ![792, 796, 800, 804].includes(o.unitId))
                ?.map((o) => ({
                    position: o.position,
                    color: p.color,
                    unit: o.unit,
                    unitId: o.unitId,
                    ...getBuildingSize(o.unit),
                }));
        })
    );

    const gates: Record<number, any> = {
        63: { objectId: 63, name: 'Fortified Gate (up.)', angle: 'up', unitId: 63+3 },
        85: { objectId: 85, name: 'Fortified Gate (down.)', angle: 'down', unitId: 85+3 },
        660: { objectId: 660, name: 'Fortified Gate (hori.)', angle: 'hori', unitId: 660+3 },
        668: { objectId: 668, name: 'Fortified Gate (vert.)', angle: 'vert', unitId: 668+3 },
        64: { objectId: 64, name: 'Gate (up.)', angle: 'up', unitId: 64+3 },
        88: { objectId: 88, name: 'Gate (down.)', angle: 'down', unitId: 88+3 },
        659: { objectId: 659, name: 'Gate (hori.)', angle: 'hori', unitId: 659+3 },
        667: { objectId: 667, name: 'Gate (vert.)', angle: 'vert', unitId: 667+3 },
        789: { objectId: 789, name: 'Palisade Gate (up.)', angle: 'up', unitId: 789+3 },
        793: { objectId: 793, name: 'Palisade Gate (down.)', angle: 'down', unitId: 793+3 },
        797: { objectId: 797, name: 'Palisade Gate (hori.)', angle: 'hori', unitId: 797+3 },
        801: { objectId: 801, name: 'Palisade Gate (vert.)', angle: 'vert', unitId: 801+3 },
    };

    const gateAngleOffsets: Record<string, any> = {
        'up': {
            start: { x: -1.5, y: 0 },
            end: { x: 1.5, y: 0 },
        },
        'down': {
            start: { x: 0, y: -1.5 },
            end: { x: 0, y: 1.5 },
        },
        'hori': {
            start: { x: -1.5, y: -1.5 },
            end: { x: 1.5, y: 1.5 },
        },
        'vert': {
            start: { x: -1.5, y: 1.5 },
            end: { x: 1.5, y: -1.5 },
        },
    };

    // For gates we need to subtract 3 from the objectId
    const unitIdToObjectId = (x: number) => x-3;

    const wallBuildingsToWalls = compact(
        analysis.players.flatMap((p) => {
            return p.queuedBuildings
                ?.filter((o) => gates[unitIdToObjectId(o.unitId)])
                ?.map((o) => {
                    const gate = gates[unitIdToObjectId(o.unitId)];
                    const offset = gateAngleOffsets[gate.angle];
                    return {
                        position: { x: o.position.x + offset.start.x, y: o.position.y + offset.start.y },
                        positionEnd: { x: o.position.x + offset.end.x, y: o.position.y + offset.end.y },
                        // position: { x: o.position.x + offset.start.x+0.5, y: o.position.y + offset.start.y+0.5 },
                        // positionEnd: { x: o.position.x + offset.end.x+0.5, y: o.position.y + offset.end.y+0.5 },
                        color: 'black',
                        unit: o.unit,
                    };
                });
        })
    );

    // stone wall 117
    // gate down 88
    // gate up 64

    const playerObjectsToWalls = compact(
        analysis.players.flatMap((p) => {
            return p.objects
                ?.filter((o) => gates[o.objectId])
                // ?.filter((o) => [67, 91, 662, 670].includes(o.objectId+3))
                ?.map((o) => {

                    const gate = gates[o.objectId];
                    const offset = gateAngleOffsets[gate.angle];

                    return {
                        position: { x: o.position.x + offset.start.x, y: o.position.y + offset.start.y },
                        positionEnd: { x: o.position.x + offset.end.x, y: o.position.y + offset.end.y },
                        // position: { x: o.position.x + offset.start.x+0.5, y: o.position.y + offset.start.y+0.5 },
                        // positionEnd: { x: o.position.x + offset.end.x+0.5, y: o.position.y + offset.end.y+0.5 },
                        color: p.color,
                        // unit: o.unit,
                    };
                });
        })
    );

    // const objects = compact(
    //     analysis.players.flatMap((p) => {
    //         return p.objects
    //             ?.filter((o) => o.unit !== 'Farm')
    //             ?.map((o) => ({
    //                 position: o.position,
    //                 color: p.color,
    //                 unit: o.unit,
    //                 ...getBuildingSize(o.unit),
    //             }));
    //     })
    // );

    // console.log(uniq(buildings.map((b => b.unit))));

    const walls = compact(
        analysis.players.flatMap((p) => {
            return p.queuedWalls
                // ?.filter((o) => o.name === 'Town Center' && o.objectId === 620)
                ?.map((o) => ({
                    position: o.position,
                    positionEnd: o.positionEnd,
                    color: p.color,
                    unit: o.unit,
                }));
        })
    );

    // console.log(uniq(walls.map((b => b.unit))));

    const gaiaDraw = Object.keys(gaiaObjects).map((key) => {
        const info = gaiaObjects[key as keyof typeof gaiaObjects];
        return analysis
            .gaia!.filter((o) => info.names.includes(o.name) || (info as any).objectIds?.includes(o.name))
            .map((o) => ({
                position: o.position,
                color: info.color,
            }));
    });

    const coord = (x: number) => x / dimension * size;

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
                                    const x = coord(unit.position.x-1/2);
                                    const y = coord(unit.position.y-1/2);
                                    const width = coord(1);
                                    const height = coord(1);

                                    return (
                                        <Rect
                                            key={index}
                                            width={(1 / dimension) * size}
                                            height={(1 / dimension) * size}
                                            x={x}
                                            y={y}
                                            color={unit.color}
                                        />
                                    );
                                })
                            )}
                            {townCenters.map((unit, index) => {
                                const x = coord(unit.position.x);
                                const y = coord(unit.position.y);

                                return (
                                    <Rect key={index} width={coord(3)} height={coord(3)} x={x} y={y} color={unit.color} />
                                );
                            })}
                            {buildings.map((unit, index) => {
                                const x = coord(unit.position.x-unit.width/2);
                                const y = coord(unit.position.y-unit.height/2);
                                const width = coord(unit.width);
                                const height = coord(unit.height);
                                return (
                                    <Rect
                                        key={index}
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        color={unit.color}
                                    />
                                );
                            })}
                            {[...wallBuildingsToWalls, ...playerObjectsToWalls].map((unit, index) => {
                                const x = coord(unit.position.x-1/2);
                                const y = coord(unit.position.y-1/2);
                                const xEnd = coord(unit.positionEnd.x-1/2);
                                const yEnd = coord(unit.positionEnd.y-1/2);
                                const lx = coord(unit.position.x);
                                const ly = coord(unit.position.y);
                                const lxEnd = coord(unit.positionEnd.x);
                                const lyEnd = coord(unit.positionEnd.y);
                                const strokeWidth = coord(1);
                                const one = coord(1);
                                return (
                                    <>
                                        <Group
                                            opacity={0.5}
                                        >
                                        <Rect
                                            key={index}
                                            x={x}
                                            y={y}
                                            width={one}
                                            height={one}
                                            color={unit.color}
                                            // color={'yellow'}
                                        />
                                        <Rect
                                            key={index}
                                            x={xEnd}
                                            y={yEnd}
                                            width={one}
                                            height={one}
                                            color={unit.color}
                                            // color={'red'}
                                        />
                                        <Line
                                            p1={vec(lx, ly)}
                                            p2={vec(lxEnd, lyEnd)}
                                            style="stroke"
                                            strokeWidth={strokeWidth}
                                            strokeCap="round"
                                            strokeJoin={'bevel'}
                                            color={unit.color}
                                            blendMode="dstATop"
                                        />
                                        </Group>
                                    </>
                                );
                            })}
                            {/*{walls.map((unit, index) => {*/}
                            {/*    const x = coord(unit.position.x-unit.width/2);*/}
                            {/*    const y = coord(unit.position.y-unit.height/2);*/}
                            {/*    const width = coord(unit.width);*/}
                            {/*    const height = coord(unit.height);*/}
                            {/*    */}
                            {/*    // if ()*/}
                            {/*    */}
                            {/*    return (*/}
                            {/*        <Rect*/}
                            {/*            key={index}*/}
                            {/*            x={x}*/}
                            {/*            y={y}*/}
                            {/*            width={width}*/}
                            {/*            height={height}*/}
                            {/*            color={unit.color}*/}
                            {/*        />*/}
                            {/*    );*/}
                            {/*})}*/}
                        </Canvas>
                    </View>
                </View>
            </View>
        </View>
    );
}

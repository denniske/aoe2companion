import React, { Fragment } from 'react';
import { Canvas, Rect, vec, Line, Group, Circle, useSVG, ImageSVG } from '@shopify/react-native-skia';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { IAnalysis } from '@app/api/helper/api.types';
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

interface Props {
    match: any;
    analysis?: IAnalysis;
    analysisSvgUrl?: string;
}

function getTimestampMs(timestamp: string) {
    // timestamp = "0:12:24.994000"
    const parts = timestamp.replace('.', ':').split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    const microseconds = parseInt(parts[3]);
    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000 + microseconds/1000;
}

export default function MatchMap(props: Props) {
    const { match, analysis, analysisSvgUrl } = props;

    const time = useSharedValue<number>(0);


    if (!analysis || !analysisSvgUrl) {
        return <Text>Loading...</Text>;
    }

    const size = 60 * 4 - 2;
    // const size = (60 * 4)*4 - 2;

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
                // ?.filter((o) => !['Town Center'].includes(o.unit))
                ?.map((o) => ({
                    time: getTimestampMs(o.timestamp),
                    position: o.position,
                    color: p.color,
                    unit: o.unit,
                    unitId: o.unitId,
                    ...getBuildingSize(o.unit),
                }));
        })
    );

    const specials = compact(
        analysis.players.flatMap((p) => {
            return p.queuedBuildings
                ?.filter((o) => ['Town Center', 'Castle', 'Watch Tower'].includes(o.unit))
                ?.map((o) => ({
                    time: getTimestampMs(o.timestamp),
                    position: o.position,
                    color: p.color,
                    unit: o.unit,
                    unitId: o.unitId,
                    ...getBuildingSize(o.unit),
                }));
        })
    );

    console.log('buildings', uniq(buildings.map(b => b.unit)));
    console.log('specials', specials.map(b => b.unit));

    const gates: Record<number, any> = {
        63: { objectId: 63, name: 'Fortified Gate (up.)', angle: 'up' },
        85: { objectId: 85, name: 'Fortified Gate (down.)', angle: 'down' },
        660: { objectId: 660, name: 'Fortified Gate (hori.)', angle: 'hori' },
        668: { objectId: 668, name: 'Fortified Gate (vert.)', angle: 'vert' },
        64: { objectId: 64, name: 'Gate (up.)', angle: 'up' },
        88: { objectId: 88, name: 'Gate (down.)', angle: 'down' },
        659: { objectId: 659, name: 'Gate (hori.)', angle: 'hori' },
        667: { objectId: 667, name: 'Gate (vert.)', angle: 'vert' },
        789: { objectId: 789, name: 'Palisade Gate (up.)', angle: 'up' },
        793: { objectId: 793, name: 'Palisade Gate (down.)', angle: 'down' },
        797: { objectId: 797, name: 'Palisade Gate (hori.)', angle: 'hori' },
        801: { objectId: 801, name: 'Palisade Gate (vert.)', angle: 'vert' },
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
                        color: 'black',
                        unit: o.unit,
                    };
                });
        })
    );

    const playerObjectsGateToWalls = compact(
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

    // palisade wall 72
    // stone wall 117

    const playerObjectsSingleToWalls = compact(
        analysis.players.flatMap((p) => {
            return p.objects
                ?.filter((o) => [72, 117].includes(o.objectId))
                ?.map((o) => {
                    return {
                        position: { x: o.position.x, y: o.position.y },
                        positionEnd: { x: o.position.x, y: o.position.y },
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

    const playerQueuedWalls = compact(
        analysis.players.flatMap((p) => {
            return p.queuedWalls
                // ?.filter((o) => o.name === 'Town Center' && o.objectId === 620)
                ?.map((o) => ({
                    time: getTimestampMs(o.timestamp),
                    position: o.position,
                    positionEnd: o.positionEnd,
                    color: p.color,
                    // unit: o.unit,
                }));
        })
    );

    // let walls = [...playerQueuedWalls, ...wallBuildingsToWalls, ...playerObjectsGateToWalls, ...playerObjectsSingleToWalls];
    let walls = [...playerQueuedWalls];

    setTiles(analysis.map.tiles);
    // console.log('analysis.map.tiles', analysis.map.tiles);

    const blockedTerrainIdsSet = new Set([47, 46, 35, 96, 40, 4, 59, 101, 111, 28, 15, 58, 96, 22, 57, 95, 23, 1]);

    const gaiaSet = getTileMap(analysis.gaia! as any, x => x+0.5, y => y+0.5);
    const tileSet = getTileMap(analysis.map.tiles);

    // console.log('analysis.gaia!', analysis.gaia!);
    // console.log('gaiaSet', gaiaSet);

    const pred = (x: number, y: number) => {
        const tile = tileSet.get(`${x},${y}`);
        const gaiaTile = gaiaSet.get(`${x},${y}`) as any;

        // console.log(`(${x}, ${y}):`, gaiaTile?.name);

        // return tile != null && !blockedTerrainIdsSet.has(tile.terrain);
        return tile != null && !blockedTerrainIdsSet.has(tile.terrain)
            && (gaiaTile == null || (!gaiaTile.name.startsWith('Tree') && !gaiaTile.name.startsWith('Gold') && !gaiaTile.name.startsWith('Stone')));

    }

    console.log('walls', walls[0]);
    walls = walls.flatMap(w => getPath(w).flatMap(w => splitPath(w, pred)).map(x => ({...w, ...x})));

    // console.log(uniq(walls.map((b => b.unit))));
    // console.log('walls', walls);

    const gaiaDraw = Object.keys(gaiaObjects).map((key) => {
        const info = gaiaObjects[key as keyof typeof gaiaObjects];
        return analysis
            .gaia!.filter((o) => info.names.includes(o.name) || (info as any).objectIds?.includes(o.name))
            .map((o) => ({
                position: o.position,
                color: info.color,
            }));
    });

    const duration = getTimestampMs(analysis.duration);

    // console.log('duration', analysis.duration)
    // console.log(groupBy(analysis.gaia!.map((b => b.name)), x => x));

    const coord = (x: number) => x / dimension * size;


    const chat = sortBy(compact(
        analysis.players.flatMap((p) => {
            return p.chat
                // ?.filter((o) => o.name === 'Town Center' && o.objectId === 620)
                ?.map((o) => ({
                    ...o,
                    time: getTimestampMs(o.timestamp),
                    color: p.color,
                    playerName: p.name,
                }));
        })
    ), c => c.time);

    console.log('RERENDER MAP');

    return (
        <View>
            <View className="flex-row justify-center border0 border-gray-300">
                <View className="relative w-60 h-60 border0 border-gray-700">
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



                            {townCenters.map((unit, index) => {
                                const x = coord(unit.position.x);
                                const y = coord(unit.position.y);

                                // return (
                                //             <ImageSVG
                                //                 svg={svg}
                                //                 width={10}
                                //                 height={10}
                                //             />
                                // );

                                return (
                                    <Rect key={index} width={coord(3)} height={coord(3)} x={x} y={y} color={unit.color} />
                                );
                            })}
                            {buildings.map((unit, index) => {
                                return (
                                    <Faded key={index} time={time} color={unit.color} timeStart={unit.time} origin={getBuildingOrigin({unit, coord})} coord={coord}>
                                        <Building unit={unit} coord={coord} />
                                    </Faded>
                                );
                            })}
                            {/*{[...walls, ...wallBuildingsToWalls, ...playerObjectsGateToWalls, ...playerObjectsSingleToWalls].map((unit, index) => {*/}
                            {[...walls].map((unit, index) => {
                                return (
                                    <Faded key={index} time={time} color={unit.color} origin={getWallOrigin({unit, coord})} coord={coord} timeStart={unit.time} >
                                        <Wall unit={unit} coord={coord} />
                                    </Faded>
                                );

                                // return <FadedWall key={index} unit={unit} coord={coord} time={time} />

                                // const x = coord(unit.position.x-1/2+1/2);
                                // const y = coord(unit.position.y-1/2+1/2);
                                // const xEnd = coord(unit.positionEnd.x-1/2+1/2);
                                // const yEnd = coord(unit.positionEnd.y-1/2+1/2);
                                // const lx = coord(unit.position.x+1/2);
                                // const ly = coord(unit.position.y+1/2);
                                // const lxEnd = coord(unit.positionEnd.x+1/2);
                                // const lyEnd = coord(unit.positionEnd.y+1/2);
                                // const isDiagonal = unit.position.x !== unit.positionEnd.x && unit.position.y !== unit.positionEnd.y;
                                // const strokeWidth = coord(isDiagonal ? 1.33 : 1);
                                // const one = coord(1);
                                // const opacity = unit.time > time.value ? 0 : 1;
                                //
                                // if (x === xEnd && y === yEnd) {
                                //     return (
                                //         <Rect
                                //             key={index}
                                //             x={x}
                                //             y={y}
                                //             width={one}
                                //             height={one}
                                //             opacity={opacity}
                                //             color={unit.color}
                                //         />
                                //     );
                                // }
                                //
                                // return (
                                //     <Fragment key={index}>
                                //         <Group
                                //             opacity={opacity}
                                //         >
                                //         <Rect
                                //             x={x}
                                //             y={y}
                                //             width={one}
                                //             height={one}
                                //             color={unit.color}
                                //             // color={'yellow'}
                                //         />
                                //         <Rect
                                //             x={xEnd}
                                //             y={yEnd}
                                //             width={one}
                                //             height={one}
                                //             color={unit.color}
                                //             // color={'red'}
                                //         />
                                //         <Line
                                //             p1={vec(lx, ly)}
                                //             p2={vec(lxEnd, lyEnd)}
                                //             style="stroke"
                                //             strokeWidth={strokeWidth}
                                //             color={unit.color}
                                //             opacity={1}
                                //             // blendMode="dstATop"
                                //         />
                                //         </Group>
                                //     </Fragment>
                                // );
                            })}
                            {gaiaDraw.map((gaiaObj) =>
                                gaiaObj.map((unit, index) => {
                                    const x = coord(unit.position.x-1/2);
                                    const y = coord(unit.position.y-1/2);
                                    const width = coord(1);
                                    const height = coord(1);
                                    return (
                                        <Rect
                                            key={index}
                                            width={width}
                                            height={height}
                                            x={x}
                                            y={y}
                                            color={unit.color}
                                        />
                                    );
                                })
                            )}
                            {specials.map((unit, index) => {
                                return (
                                    <Faded key={index} time={time} color={unit.color} timeStart={unit.time} origin={getSpecialOrigin({unit, coord})} coord={coord}>
                                        <Special time={time} timeStart={unit.time} unit={unit} coord={coord} />
                                    </Faded>
                                );
                            })}
                        </Canvas>
                    </View>
                </View>
                <Chat time={time} chat={chat} />

            </View>
            <TimeScrubber time={time} duration={duration}></TimeScrubber>
        </View>
    );
}

import React from 'react';
import {Canvas, Rect} from '@shopify/react-native-skia';
import {View} from 'react-native';
import {Image} from 'expo-image';
import {IAnalysis, IMatchNew} from '@app/api/helper/api.types';
import {Text} from '@app/components/text';
import {compact, sortBy} from 'lodash';
import {gaiaObjects, getBuildingSize, isBuilding} from '@app/view/components/match-map/map-utils';
import {getPath, getTileMap, setTiles, splitPath} from '@app/view/components/match-map/map-path';
import {useSharedValue} from 'react-native-reanimated';
import TimeScrubber from '@app/view/components/match-map/time-scrubber';
import Faded from './draw/faded';
import Wall, {getWallOrigin} from './draw/wall';
import Building, {getBuildingOrigin} from '@app/view/components/match-map/draw/building';
import Special, {getSpecialOrigin} from '@app/view/components/match-map/draw/special';
import Chat from '@app/view/components/match-map/chat';
import Legend from './legend';
import Uptimes from '@app/view/components/match-map/uptimes';
import {Card} from '@app/components/card';
import Eapm from '@app/view/components/match-map/eapm';
import {aoe2PlayerColorsLightModeChatLegend} from '@app/helper/colors';
import Timeseries from '@app/view/components/match-map/timeseries';
import {useDarkMode} from '@app/hooks/use-dark-mode';

interface Props {
    match?: IMatchNew;
    analysis?: IAnalysis;
    analysisSvgUrl?: string;
}

export function getTimestampMs(timestamp: string) {
    // timestamp = "0:12:24.994000"
    // timestamp = "0:12:24"         (microseconds is optional)
    const parts = timestamp.replace('.', ':').split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);
    const microseconds = parseInt(parts[3] ?? 0);
    return (hours * 60 * 60 + minutes * 60 + seconds) * 1000 + microseconds/1000;
}

export default function MatchMap(props: Props) {
    const { match, analysis, analysisSvgUrl } = props;
    const darkMode = useDarkMode();

    const time = useSharedValue<number>(0);

    if (!match || !analysis || !analysisSvgUrl) {
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
                    color: p.colorHex,
                    unit: 'Town Center',
                }));
        })
    );

    const startBuildings = compact(
        analysis.players.flatMap((p) => {
            return p.objects
                ?.filter((o) => o.name !== 'Town Center' && isBuilding(o.name))
                ?.map((o) => ({
                    position: o.position,
                    color: p.colorHex,
                    unit: o.name,
                    unitId: o.objectId,
                    ...getBuildingSize(o.name),
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
                    color: p.colorHex,
                    unit: o.unit,
                    unitId: o.unitId,
                    ...getBuildingSize(o.unit),
                }));
        })
    );

    const getAnalysisPlayer = (color: number) => analysis.players.find(p => (p.colorId ?? 0)+1 === color);

    const teams = match.teams.map((team) => ({
        teamId: team.teamId,
        players: team.players.map((player) => {

            const colorHex = getAnalysisPlayer(player.color)?.colorHex;
            const color = darkMode == 'light' ? aoe2PlayerColorsLightModeChatLegend[colorHex as any] ?? colorHex : colorHex;

            return {
                profileId: player.profileId,
                name: player.name,
                color,
                civImageUrl: player.civImageUrl,
                eapmPerMinute: getAnalysisPlayer(player.color)?.eapmPerMinute,
                resignation: getAnalysisPlayer(player.color)?.resignation,
                uptimes: getAnalysisPlayer(player.color)?.uptimes,
                timeseries: getAnalysisPlayer(player.color)?.timeseries,
            };
        }),
    }));

    const specials = compact(
        analysis.players.flatMap((p) => {
            return p.queuedBuildings
                ?.filter((o) => ['Town Center', 'Castle', 'Watch Tower'].includes(o.unit))
                ?.map((o) => ({
                    time: getTimestampMs(o.timestamp),
                    position: o.position,
                    color: p.colorHex,
                    unit: o.unit,
                    unitId: o.unitId,
                    ...getBuildingSize(o.unit),
                }));
        })
    );

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
                        time: getTimestampMs(o.timestamp),
                        position: { x: o.position.x + offset.start.x, y: o.position.y + offset.start.y },
                        positionEnd: { x: o.position.x + offset.end.x, y: o.position.y + offset.end.y },
                        color:  p.colorHex,
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
                        color: p.colorHex,
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
                        color: p.colorHex,
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

    const playerQueuedWalls = compact(
        analysis.players.flatMap((p) => {
            return p.queuedWalls
                ?.map((o) => ({
                    time: getTimestampMs(o.timestamp),
                    position: o.position,
                    positionEnd: o.positionEnd,
                    color: p.colorHex,
                    // unit: o.unit,
                }));
        })
    );

    const staticWalls = [...playerObjectsGateToWalls];

    setTiles(analysis.map.tiles);

    const blockedTerrainIdsSet = new Set([47, 46, 35, 96, 40, 4, 59, 101, 111, 28, 15, 58, 96, 22, 57, 95, 23, 1]);

    const gaiaSet = getTileMap(analysis.gaia! as any, x => x+0.5, y => y+0.5);
    const tileSet = getTileMap(analysis.map.tiles);

    const pred = (x: number, y: number) => {
        const tile = tileSet.get(`${x},${y}`);
        const gaiaTile = gaiaSet.get(`${x},${y}`) as any;

        // console.log(`(${x}, ${y}):`, gaiaTile?.name);

        if (gaiaTile && !gaiaTile.name) {
            console.log(`(${x}, ${y}):`, gaiaTile);
            return true;
        }

        return tile != null && !blockedTerrainIdsSet.has(tile.terrain)
            && (gaiaTile == null || (!gaiaTile.name.startsWith('Tree') && !gaiaTile.name.startsWith('Gold') && !gaiaTile.name.startsWith('Stone')));

    }

    const playerQueuedWallsFinal = playerQueuedWalls.flatMap(w => getPath(w).flatMap(w => splitPath(w, pred)).map(x => ({...w, ...x})));

    const walls = [...wallBuildingsToWalls, ...playerQueuedWallsFinal];

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

    const coord = (x: number) => x / dimension * size;

    const chat = sortBy(
        compact(
            analysis.players.flatMap((p) =>
                p.chat?.map(ch => ({
                    ...ch,
                    time: getTimestampMs(ch.timestamp),
                    color: darkMode == 'light' ? (aoe2PlayerColorsLightModeChatLegend[p.colorHex as any] ?? p.colorHex) : p.colorHex,
                    playerName: p.name,
                }))
            )
        ),
        (c) => c.time
    ).map((chat, index) => ({ ...chat, index }));

    console.log('RERENDER MAP');

    return (
        <View className="gap-2">
            <Card direction="vertical" flat={true}>
                <View className="flex-row justify-center border0 border-gray-300">
                    <View className="relative w-60 h-60 border0 border-gray-700">
                        <View className="scale-y-[0.5]">
                            <View className="-rotate-45">
                                <Image
                                    cachePolicy={'none'}
                                    contentFit={'fill'}
                                    style={{ width: size, height: size }}
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
                                    {startBuildings.map((unit, index) => (
                                        <Building key={index} unit={unit} coord={coord} />
                                    ))}
                                    {buildings.map((unit, index) => (
                                        <Faded
                                            key={index}
                                            time={time}
                                            color={unit.color}
                                            timeStart={unit.time}
                                            origin={getBuildingOrigin({ unit, coord })}
                                            coord={coord}
                                        >
                                            <Building unit={unit} coord={coord} />
                                        </Faded>
                                    ))}
                                    {/*{[...walls, ...wallBuildingsToWalls, ...playerObjectsGateToWalls, ...playerObjectsSingleToWalls].map((unit, index) => {*/}

                                    {gaiaDraw.map((gaiaObj) =>
                                        gaiaObj.map((unit, index) => {
                                            const x = coord(unit.position.x - 1 / 2);
                                            const y = coord(unit.position.y - 1 / 2);
                                            const width = coord(1);
                                            const height = coord(1);
                                            return <Rect key={index} width={width} height={height} x={x} y={y} color={unit.color} />;
                                        })
                                    )}




                                    {[...playerObjectsSingleToWalls].map((unit, index) => (
                                        <Wall unit={unit} coord={coord} />
                                    ))}
                                    {[...staticWalls].map((unit, index) => (
                                        <Wall unit={unit} coord={coord} />
                                    ))}

                                    {[...walls].map((unit, index) => {
                                        return (
                                            <Faded
                                                key={index}
                                                time={time}
                                                color={unit.color}
                                                origin={getWallOrigin({ unit, coord })}
                                                coord={coord}
                                                timeStart={unit.time}
                                            >
                                                <Wall unit={unit} coord={coord} />
                                            </Faded>
                                        );
                                    })}

                                    {townCenters.map((unit, index) => (
                                        <Special key={index} unit={unit} coord={coord} />
                                    ))}
                                    {specials.map((unit, index) => (
                                        <Faded
                                            key={index}
                                            time={time}
                                            color={unit.color}
                                            timeStart={unit.time}
                                            origin={getSpecialOrigin({ unit, coord })}
                                            coord={coord}
                                        >
                                            <Special unit={unit} coord={coord} />
                                        </Faded>
                                    ))}
                                </Canvas>
                            </View>
                        </View>
                    </View>
                    <Chat time={time} chat={chat} />
                    <Legend time={time} legendInfo={teams as any} match={match} />
                </View>
                <TimeScrubber time={time} duration={duration}></TimeScrubber>
            </Card>
            <Card direction="vertical">
                <Eapm teams={teams as any} />
            </Card>
            <Card direction="vertical">
                <Timeseries teams={teams as any} metric="totalResources" title="Resources" description="Total resources" />
            </Card>
            <Card direction="vertical">
                <Timeseries teams={teams as any} metric="totalObjects" title="Objects" description="Total objects" />
            </Card>
            <Card direction="vertical">
                <Uptimes time={time} teams={teams as any} />
            </Card>
            <Card direction="vertical">
                <Text>
                    Match analysis works by parsing the replay file. This may not work for all matches (especially scenarios). This file contains a
                    list of actions made by each player e.g. create unit/building, research technology, etc.
                </Text>
                <Text>As we cannot use the game engine to replay the match, there are some limitations:</Text>
                <Text>- There is no way to know when Buildings are destroyed so they will still be shown on the map.</Text>
                <Text>The analysis is not 100% accurate and may contain errors. New patches might break the match analysis feature.</Text>
            </Card>
        </View>
    );
}

export const formatTimeFromMs = (milliseconds: number) => {
    'worklet';
    // return Math.round(milliseconds);
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export type ILegendInfo = Array<{
    teamId?: number
    players: Array<{
        profileId: number
        name: string
        civImageUrl: string
        color: string
        eapmPerMinute: Record<string, number>
        resignation?: {
            payload: {
                sequence: number
            }
            player: number
            timestamp: string
            type: string
        }
        uptimes: Array<{
            timestamp: string
            age: string
        }>
        timeseries: Array<{
            timestamp: string
            totalObjects: number
            totalResources: number
        }>
    }>
}>

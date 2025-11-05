import React, { useEffect } from 'react';
import { Canvas, Circle, Rect, useCanvasRef } from '@shopify/react-native-skia';
import { TextInput, View } from 'react-native';
import { Image } from '@/src/components/uniwind/image';
import { IAnalysis } from '@app/api/helper/api.types';
import { Text } from '@app/components/text';

function roundToNearest45Degrees(angle: number): number {
    return Math.round(angle / 45) * 45;
}

function getVecFromAngle(x: number) {
    x = normalizeAngle(x);
    const mapping: Record<number, any> = {
        0: { x: 1, y: 0 },
        45: { x: 1, y: 1 },
        90: { x: 0, y: 1 },
        135: { x: -1, y: 1 },
        180: { x: -1, y: 0 },
        225: { x: -1, y: -1 },
        270: { x: 0, y: -1 },
        315: { x: 1, y: -1 },
    };
    if (mapping[x] === undefined) {
        throw new Error('No angle found for ' + x);
    }
    return mapping[x];
}

function normalizeAngle(angle: number): number {
    return ((angle % 360) + 360) % 360;
}

interface IPath {
    position: { x: number, y: number };
    positionEnd: { x: number, y: number };
}

function getAngleInDegrees({ position, positionEnd }: IPath) {
    return Math.atan2(positionEnd.y - position.y, positionEnd.x - position.x) * 57.2958
}


export function getPath(path: IPath) {
    const { position, positionEnd } = path;
    const angle = getAngleInDegrees(path);
    // console.log();
    // console.log('position', position);
    // console.log('positionEnd', positionEnd);
    // console.log('angle', angle);
    const angleR = roundToNearest45Degrees(angle);
    // console.log('angleR', angleR);
    const angles = angleR > angle ? [angleR, angleR - 45] : [angleR, angleR + 45];
    // console.log('angles', angles);

    const stepsX = Math.abs(position.x-positionEnd.x);
    const stepsY = Math.abs(position.y-positionEnd.y);
    const stepsOrthogonal = Math.abs(stepsX-stepsY);
    const stepsDiagonal = Math.min(stepsX, stepsY);

    // console.log('stepsOrthogonal', stepsOrthogonal);
    // console.log('stepsDiagonal', stepsDiagonal);

    if (stepsOrthogonal == 0 || stepsDiagonal == 0) {
        return [{ position, positionEnd }];
    }

    let middle;

    let vec0 = getVecFromAngle(angles[0]);

    // Orthogonal
    if (angles[0] % 90 == 0) {
        middle = { x: position.x + stepsOrthogonal * vec0.x, y: position.y + stepsOrthogonal * vec0.y };
    } else {
        middle = { x: position.x + stepsDiagonal * vec0.x, y: position.y + stepsDiagonal * vec0.y };
    }

    // console.log('middle', middle);

    return [{ position, positionEnd: middle }, { position: middle, positionEnd }];
}


interface ITile {
    elevation: number;
    position: {
        x: number;
        y: number;
    };
    terrain: number;
}

let tiles: ITile[] = Array(6).fill(1).flatMap((_, x) => Array(6).fill(1).map((_, y) => (
    {
        elevation: 0,
        position: { x, y },
        terrain: 0,
    }
)));

export function setTiles(newTiles: ITile[]) {
    tiles = newTiles;
    tileSet = getTileMap(tiles);
}

function _isPassableTile(x: number, y: number, tileSet: Map<string, ITile>) {
    const tile = tileSet.get(`${x},${y}`);


    // console.log(`Tile at (${x}, ${y}):`, tile.terrain);
    return tile && tile.terrain !== 0;
}

function blockTile(x: number, y: number, tileSet: Map<string, ITile>) {
    const tile = tileSet.get(`${x},${y}`);
    if (!tile) {
        console.error(`Tile not found at position (${x}, ${y})`);
        return;
    } else {
        tile.terrain = 1;
    }
}

export function getTileMap(tiles: ITile[], movX = (x: number) => x, movY = (y: number) => y) {
    const tileMap = new Map<string, typeof tiles[0]>();

    tiles.forEach(tile => {
        const newX = movX(tile.position.x);
        const newY = movY(tile.position.y);
        const key = `${newX},${newY}`;
        tileMap.set(key, tile);
    });

    return tileMap;
}

let tileSet: Map<string, ITile> = getTileMap(tiles);

// console.log('Tiles:', tiles);
// console.log('Tile set:', tileSet);

// blockTile(1, 0, tileSet);
// blockTile(2, 0, tileSet);
// blockTile(5, 0, tileSet);

// blockTile(0, 0, tileSet);
// blockTile(1, 0, tileSet);
// blockTile(2, 0, tileSet);
// blockTile(3, 0, tileSet);
// blockTile(4, 0, tileSet);

// blockTile(1, 1, tileSet);
// blockTile(2, 2, tileSet);

// blockTile(0, 2, tileSet);
// blockTile(0, 3, tileSet);

type IPred = (x: number, y: number) => boolean;

export function splitPath(path: IPath, isPassableTile: IPred) {
    const { position, positionEnd } = path;
    const angle = getAngleInDegrees(path);
    // console.log();
    // console.log('position', position);
    // console.log('positionEnd', positionEnd);
    // console.log('angle', angle);
    const angleR = roundToNearest45Degrees(angle);
    // console.log('angleR', angleR);

    const stepsX = Math.abs(position.x-positionEnd.x);
    const stepsY = Math.abs(position.y-positionEnd.y);
    const length = Math.max(stepsX, stepsY) + 1;

    // console.log('length', length);

    let vec0 = getVecFromAngle(angleR);

    const paths = [];
    let start = null;

    for (let i = 0; i < length; i++) {

        const x = position.x + vec0.x * i;
        const y = position.y + vec0.y * i;

        if (isPassableTile(x, y) && start == null) {
            start = { x, y };
            // console.log('Start at', x, y);
        }

        if (!isPassableTile(x, y) && start != null) {
            // console.log('Blocked at', x, y);
            paths.push({ position: { x: start.x, y: start.y }, positionEnd: { x: position.x + vec0.x * (i - 1), y: position.y + vec0.y * (i - 1) } });
            start = null;
        }
    }

    if (start != null) {
        // console.log('Finalized at end');
        paths.push({ position: { x: start.x, y: start.y }, positionEnd: { x: position.x + vec0.x * (length - 1), y: position.y + vec0.y * (length - 1) } });
        start = null;
    }

    return paths;
}

// export default function MatchMap3() {
//
//     // console.log('RERENDER');
//
//     const path = {
//         position: { x: 0, y: 0 },
//         positionEnd: { x: 2, y: 5 },
//     };
//     const paths = [path];
//     // console.log(paths.flatMap(getPath).flatMap(splitPath));
//
//     // console.log(splitPath({x: 0, y: 0}, {x: 5, y: 0}));
//     // console.log(splitPath({x: 5, y: 5}, {x: 0, y: 0}));
//
//     // console.log(getPath({x: 0, y: 0}, {x: 0, y: 4}));
//     // console.log(getPath({x: 0, y: 0}, {x: 2, y: 4}));
//     // console.log(getPath({x: 0, y: 0}, {x: 4, y: 4}));
//     // console.log(getPath({x: 0, y: 0}, {x: 4, y: 2}));
//     // console.log(getPath({x: 0, y: 0}, {x: 4, y: 0}));
//     // console.log(getPath({x: 0, y: 0}, {x: 4, y: -1}));
//     // console.log(getPath({x: 0, y: 0}, {x: 4, y: -2}));
//
//     return (
//         <View>
//             <Text>Test</Text>
//         </View>
//     );
// }

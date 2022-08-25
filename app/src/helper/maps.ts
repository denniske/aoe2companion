import {AoeMap, getString} from '@nex/data';
import {getStringId} from './strings';
import {mapsData, mapsFallbackData} from "@nex/dataset";

export const maps = mapsData;
export const mapsFallback = mapsFallbackData;

export function getMapImage(map: AoeMap) {
    if (map == null || !(map in maps)) {
        return mapsFallback;
    }
    return maps[map];
}

export function getMapImageByLocationString(map: string) {
    if (map == null) {
        return mapsFallback;
    }
    const stringId = getStringId('map_type', map) as AoeMap;
    if (stringId == null || !(stringId in maps)) {
        return mapsFallback;
    }
    return maps[stringId as AoeMap];
}

export function getMapName(map: AoeMap) {
    if (map == null) {
        return 'Custom';
    }
    return getString('map_type', map);
}


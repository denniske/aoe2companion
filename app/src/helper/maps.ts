import {AoeMap, getString} from '@nex/data';
import {getStringId} from './strings';
import {mapsData} from "@nex/dataset";

export const maps = mapsData;

export function getMapImage(map: AoeMap) {
    if (map == null || !(map in maps)) {
        return require('../../assets/maps/cm_generic.png');
    }
    return maps[map];
}

export function getMapImageByLocationString(map: string) {
    if (map == null) {
        return require('../../assets/maps/cm_generic.png');
    }
    const stringId = getStringId('map_type', map) as AoeMap;
    if (stringId == null || !(stringId in maps)) {
        return require('../../assets/maps/cm_generic.png');
    }
    return maps[stringId as AoeMap];
}

export function getMapName(map: AoeMap) {
    if (map == null) {
        return 'Custom';
    }
    return getString('map_type', map);
}


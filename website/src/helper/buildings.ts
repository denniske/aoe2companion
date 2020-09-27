import {Building} from "@nex/data";

export function getBuildingIcon(building: Building) {
    return '/buildings/' + building + '.png';
}

import type { ImageSourceProp } from '@app/components/uniwind/image';
import {Building} from "@nex/data";

import { buildingIconImageDict } from '@/assets/buildings';


export function getBuildingIcon(building: Building): ImageSourceProp {
    return buildingIconImageDict[building];
}

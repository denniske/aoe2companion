import {Building} from "@nex/data";
import { ImageSourcePropType } from 'react-native';
import { buildingIconImageDict } from '@/assets/buildings';


export function getBuildingIcon(building: Building): ImageSourcePropType {
    return buildingIconImageDict[building];
}

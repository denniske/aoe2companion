import { Unit } from '@nex/data';
import {getUnitIcon} from './units';

export function getUnitIconColored(unit: Unit, color: number) {
    return getUnitIcon(unit);
}

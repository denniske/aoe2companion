import { Building } from './buildings';
import { Other, Unit } from './units';
import { Tech } from './techs';


export interface ITechTreeRow {
    title?: string;
    items?: {
        age?: Other,
        unit?: Unit,
        building?: Building;
        tech?: Tech;
        unique?: boolean;
        dependsOn?: any;
    }[];
}

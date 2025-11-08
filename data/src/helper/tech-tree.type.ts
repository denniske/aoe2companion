import { Building } from './buildings';
import { Other, Unit } from './units';
import { Age, Tech } from './techs';


export interface ITechTreeRow {
    title?: string;
    items?: ITechTreeRowItem[];
}

interface ITechTreeRowItem {
    age?: Age,
    unit?: Unit,
    building?: Building;
    tech?: Tech;
    unique?: boolean;
    dependsOn?: any;

}

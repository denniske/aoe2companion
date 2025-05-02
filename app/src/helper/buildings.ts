import {Building} from "@nex/data";


const buildingIcons = {
    'ArcheryRange': require('../../../app/assets/buildings/ArcheryRange.png'),
    'Barracks': require('../../../app/assets/buildings/Barracks.png'),
    'Blacksmith': require('../../../app/assets/buildings/Blacksmith.png'),
    'BombardTower': require('../../../app/assets/buildings/BombardTower.png'),
    'Castle': require('../../../app/assets/buildings/Castle.png'),
    'Caravanserai': require('../../../app/assets/buildings/Caravanserai.png'),
    'Dock': require('../../../app/assets/buildings/Dock.png'),
    'Donjon': require('../../../app/assets/buildings/Donjon.png'),
    'Farm': require('../../../app/assets/buildings/Farm.png'),
    'Feitoria': require('../../../app/assets/buildings/Feitoria.png'),
    'FishTrap': require('../../../app/assets/buildings/FishTrap.png'),
    'FortifiedWall': require('../../../app/assets/buildings/FortifiedWall.png'),
    'Folwark': require('../../../app/assets/buildings/Folwark.png'),
    'Gate': require('../../../app/assets/buildings/Gate.png'),
    'GuardTower': require('../../../app/assets/buildings/GuardTower.png'),
    'Harbor': require('../../../app/assets/buildings/Harbor.png'),
    'House': require('../../../app/assets/buildings/House.png'),
    'Keep': require('../../../app/assets/buildings/Keep.png'),
    'Krepost': require('../../../app/assets/buildings/Krepost.png'),
    'LumberCamp': require('../../../app/assets/buildings/LumberCamp.png'),
    'Market': require('../../../app/assets/buildings/Market.png'),
    'Mill': require('../../../app/assets/buildings/Mill.png'),
    'MiningCamp': require('../../../app/assets/buildings/MiningCamp.png'),
    'Monastery': require('../../../app/assets/buildings/Monastery.png'),
    'Outpost': require('../../../app/assets/buildings/Outpost.png'),
    'PalisadeGate': require('../../../app/assets/buildings/PalisadeGate.png'),
    'PalisadeWall': require('../../../app/assets/buildings/PalisadeWall.png'),
    'SiegeWorkshop': require('../../../app/assets/buildings/SiegeWorkshop.png'),
    'Stable': require('../../../app/assets/buildings/Stable.png'),
    'StoneWall': require('../../../app/assets/buildings/StoneWall.png'),
    'TownCenter': require('../../../app/assets/buildings/TownCenter.png'),
    'University': require('../../../app/assets/buildings/University.png'),
    'WatchTower': require('../../../app/assets/buildings/GuardTower.png'),
    'Wonder': require('../../../app/assets/buildings/Wonder.png'),
    'FortifiedChurch': require('../../../app/assets/buildings/FortifiedChurch.png'),
    'MuleCart': require('../../../app/assets/buildings/MuleCart.png'),
    'Pasture': require('../../../app/assets/buildings/Pasture.png'),
};

export function getBuildingIcon(building: Building) {
    return buildingIcons[building];
}

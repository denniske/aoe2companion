import {Building} from "@nex/data";


const buildingIcons = {
    'ArcheryRange': require('../../assets/buildings/ArcheryRange.png'),
    'Barracks': require('../../assets/buildings/Barracks.png'),
    'Blacksmith': require('../../assets/buildings/Blacksmith.png'),
    'BombardTower': require('../../assets/buildings/BombardTower.png'),
    'Castle': require('../../assets/buildings/Castle.png'),
    'Caravanserai': require('../../assets/buildings/Caravanserai.png'),
    'Dock': require('../../assets/buildings/Dock.png'),
    'Donjon': require('../../assets/buildings/Donjon.png'),
    'Farm': require('../../assets/buildings/Farm.png'),
    'Feitoria': require('../../assets/buildings/Feitoria.png'),
    'FishTrap': require('../../assets/buildings/FishTrap.png'),
    'FortifiedWall': require('../../assets/buildings/FortifiedWall.png'),
    'Folwark': require('../../assets/buildings/Folwark.png'),
    'Gate': require('../../assets/buildings/Gate.png'),
    'GuardTower': require('../../assets/buildings/GuardTower.png'),
    'Harbor': require('../../assets/buildings/Harbor.png'),
    'House': require('../../assets/buildings/House.png'),
    'Keep': require('../../assets/buildings/Keep.png'),
    'Krepost': require('../../assets/buildings/Krepost.png'),
    'LumberCamp': require('../../assets/buildings/LumberCamp.png'),
    'Market': require('../../assets/buildings/Market.png'),
    'Mill': require('../../assets/buildings/Mill.png'),
    'MiningCamp': require('../../assets/buildings/MiningCamp.png'),
    'Monastery': require('../../assets/buildings/Monastery.png'),
    'Outpost': require('../../assets/buildings/Outpost.png'),
    'PalisadeGate': require('../../assets/buildings/PalisadeGate.png'),
    'PalisadeWall': require('../../assets/buildings/PalisadeWall.png'),
    'SiegeWorkshop': require('../../assets/buildings/SiegeWorkshop.png'),
    'Stable': require('../../assets/buildings/Stable.png'),
    'StoneWall': require('../../assets/buildings/StoneWall.png'),
    'TownCenter': require('../../assets/buildings/TownCenter.png'),
    'University': require('../../assets/buildings/University.png'),
    'WatchTower': require('../../assets/buildings/GuardTower.png'),
    'Wonder': require('../../assets/buildings/Wonder.png'),
    'FortifiedChurch': require('../../assets/buildings/FortifiedChurch.png'),
    'MuleCart': require('../../assets/buildings/MuleCart.png'),
    'Pasture': require('../../assets/buildings/Pasture.png'),
};

export function getBuildingIcon(building: Building) {
    return buildingIcons[building];
}

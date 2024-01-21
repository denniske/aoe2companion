import {Age, Other, Unit, UnitLine, unitLines} from "@nex/data";
import {ImageSourcePropType} from "react-native";


const otherIcons = {
    'DarkAge': require('../../../app/assets/other/DarkAge.png'),
    'FeudalAge': require('../../../app/assets/other/FeudalAgeFull.png'),
    'CastleAge': require('../../../app/assets/other/CastleAge.png'),
    'ImperialAge': require('../../../app/assets/other/ImperialAge.png'),
    'Wood': require('../../../app/assets/other/Wood.png'),
    'Food': require('../../../app/assets/other/Food.png'),
    'Gold': require('../../../app/assets/other/Gold.png'),
    'Stone': require('../../../app/assets/other/Stone.png'),
    'BerryBush': require('../../../app/assets/other/BerryBush.png'),
    'Cross': require('../../../app/assets/other/Cross.png'),
    'Build': require('../../../app/assets/other/Build.png'),
};


export function getOtherIcon(other: Other) {
    return otherIcons[other];
}

const ageIcons = {
    'Dark': require('../../../app/assets/other/DarkAge.png'),
    'Feudal': require('../../../app/assets/other/FeudalAgeFull.png'),
    'Castle': require('../../../app/assets/other/CastleAge.png'),
    'Imperial': require('../../../app/assets/other/ImperialAge.png'),
};


export function getAgeIcon(age: Age) {
    return ageIcons[age];
}

interface UnitIconDict {
    [unit: string]: ImageSourcePropType;
}

const unitIcons: UnitIconDict = {
    'Centurion': require('../../assets/units/Centurion.png'),
    'Legionary': require('../../assets/units/Legionary.png'),
    'Dromon': require('../../assets/units/Dromon.png'),
    'Ghulam': require('../../assets/units/Ghulam.png'),
    'CamelScout': require('../../assets/units/CamelScout.png'),
    'ShrivamshaRider': require('../../assets/units/ShrivamshaRider.png'),
    'ChakramThrower': require('../../assets/units/ChakramThrower.png'),
    'Thirisadai': require('../../assets/units/Thirisadai.png'),
    'UrumiSwordsman': require('../../assets/units/UrumiSwordsman.png'),
    'ArmoredElephant': require('../../assets/units/ArmoredElephant.png'),
    'SiegeElephant': require('../../assets/units/SiegeElephant.png'),
    'Ratha': require('../../assets/units/Ratha.png'),

    'Savar': require('../../../app/assets/units/Savar.png'),
    'CompositeBowman': require('../../../app/assets/units/CompositeBowman.png'),
    'Monaspa': require('../../../app/assets/units/Monaspa.png'),
    'WarriorPriest': require('../../../app/assets/units/WarriorPriest.png'),
    'Obuch': require('../../../app/assets/units/Obuch.png'),
    'HussiteWagon': require('../../../app/assets/units/HussiteWagon.png'),
    'Houfnice': require('../../../app/assets/units/Houfnice.png'),
    'WingedHussar': require('../../../app/assets/units/WingedHussar.png'),
    'Coustillier': require('../../../app/assets/units/Coustillier.png'),
    'Serjeant': require('../../../app/assets/units/Serjeant.png'),
    'FlemishMilitia': require('../../../app/assets/units/FlemishMilitia.png'),
    'Sheep': require('../../../app/assets/units/Sheep.png'),
    'Boar': require('../../../app/assets/units/Boar.png'),
    'Kamayuk': require('../../../app/assets/units/Kamayuk.png'),
    'Slinger': require('../../../app/assets/units/Slinger.png'),
    'PlumedArcher': require('../../../app/assets/units/PlumedArcher.png'),
    'Archer': require('../../../app/assets/units/Archer.png'),
    'Crossbowman': require('../../../app/assets/units/Crossbowman.png'),
    'Arbalester': require('../../../app/assets/units/Arbalester.png'),
    'Skirmisher': require('../../../app/assets/units/Skirmisher.png'),
    'EliteSkirmisher': require('../../../app/assets/units/EliteSkirmisher.png'),
    'ImperialSkirmisher': require('../../../app/assets/units/ImperialSkirmisher.png'),
    'CavalryArcher': require('../../../app/assets/units/CavalryArcher.png'),
    'HeavyCavalryArcher': require('../../../app/assets/units/HeavyCavalryArcher.png'),
    'Longbowman': require('../../../app/assets/units/Longbowman.png'),
    'ChuKoNu': require('../../../app/assets/units/ChuKoNu.png'),
    'Mangudai': require('../../../app/assets/units/Mangudai.png'),
    'WarWagon': require('../../../app/assets/units/WarWagon.png'),
    'ElephantArcher': require('../../../app/assets/units/ElephantArcher.png'),
    'GenoeseCrossbowman': require('../../../app/assets/units/GenoeseCrossbowman.png'),
    'CamelArcher': require('../../../app/assets/units/CamelArcher.png'),
    'Genitour': require('../../../app/assets/units/Genitour.png'),
    'RattanArcher': require('../../../app/assets/units/RattanArcher.png'),
    'Kipchak': require('../../../app/assets/units/Kipchak.png'),
    'ScoutCavalry': require('../../../app/assets/units/ScoutCavalry.png'),
    'LightCavalry': require('../../../app/assets/units/LightCavalry.png'),
    'Hussar': require('../../../app/assets/units/Hussar.png'),
    'XolotlWarrior': require('../../../app/assets/units/XolotlWarrior.png'),
    'Knight': require('../../../app/assets/units/Knight.png'),
    'Cavalier': require('../../../app/assets/units/Cavalier.png'),
    'Paladin': require('../../../app/assets/units/Paladin.png'),
    'CamelRider': require('../../../app/assets/units/CamelRider.png'),
    'HeavyCamelRider': require('../../../app/assets/units/HeavyCamelRider.png'),
    'ImperialCamelRider': require('../../../app/assets/units/ImperialCamelRider.png'),
    'BattleElephant': require('../../../app/assets/units/BattleElephant.png'),
    'EliteBattleElephant': require('../../../app/assets/units/EliteBattleElephant.png'),
    'SteppeLancer': require('../../../app/assets/units/SteppeLancer.png'),
    'EliteSteppeLancer': require('../../../app/assets/units/EliteSteppeLancer.png'),
    'Cataphract': require('../../../app/assets/units/Cataphract.png'),
    'WarElephant': require('../../../app/assets/units/WarElephant.png'),
    'Mameluke': require('../../../app/assets/units/Mameluke.png'),
    'Tarkan': require('../../../app/assets/units/Tarkan.png'),
    'MagyarHuszar': require('../../../app/assets/units/MagyarHuszar.png'),
    'Boyar': require('../../../app/assets/units/Boyar.png'),
    'Konnik': require('../../../app/assets/units/Konnik.png'),
    'KonnikDismounted': require('../../../app/assets/units/KonnikDismounted.png'),
    'Leitis': require('../../../app/assets/units/Leitis.png'),
    'Keshik': require('../../../app/assets/units/Keshik.png'),
    'Militia': require('../../../app/assets/units/Militia.png'),
    'ManAtArms': require('../../../app/assets/units/ManAtArms.png'),
    'LongSwordsman': require('../../../app/assets/units/LongSwordsman.png'),
    'TwoHandedSwordsman': require('../../../app/assets/units/TwoHandedSwordsman.png'),
    'Champion': require('../../../app/assets/units/Champion.png'),
    'Spearman': require('../../../app/assets/units/Spearman.png'),
    'Pikeman': require('../../../app/assets/units/Pikeman.png'),
    'Halberdier': require('../../../app/assets/units/Halberdier.png'),
    'EagleScout': require('../../../app/assets/units/EagleScout.png'),
    'EagleWarrior': require('../../../app/assets/units/EagleWarrior.png'),
    'EliteEagleWarrior': require('../../../app/assets/units/EliteEagleWarrior.png'),
    'WoadRaider': require('../../../app/assets/units/WoadRaider.png'),
    'ThrowingAxeman': require('../../../app/assets/units/ThrowingAxeman.png'),
    'Huskarl': require('../../../app/assets/units/Huskarl.png'),
    'Samurai': require('../../../app/assets/units/Samurai.png'),
    'TeutonicKnight': require('../../../app/assets/units/TeutonicKnight.png'),
    'Berserk': require('../../../app/assets/units/Berserk.png'),
    'JaguarWarrior': require('../../../app/assets/units/JaguarWarrior.png'),
    'Condottiero': require('../../../app/assets/units/Condottiero.png'),
    'ShotelWarrior': require('../../../app/assets/units/ShotelWarrior.png'),
    'Gbeto': require('../../../app/assets/units/Gbeto.png'),
    'KarambitWarrior': require('../../../app/assets/units/KarambitWarrior.png'),
    'HandCannoneer': require('../../../app/assets/units/HandCannoneer.png'),
    'Scorpion': require('../../../app/assets/units/Scorpion.png'),
    'HeavyScorpion': require('../../../app/assets/units/HeavyScorpion.png'),
    'BatteringRam': require('../../../app/assets/units/BatteringRam.png'),
    'CappedRam': require('../../../app/assets/units/CappedRam.png'),
    'SiegeRam': require('../../../app/assets/units/SiegeRam.png'),
    'Mangonel': require('../../../app/assets/units/Mangonel.png'),
    'Onager': require('../../../app/assets/units/Onager.png'),
    'SiegeOnager': require('../../../app/assets/units/SiegeOnager.png'),
    'BombardCannon': require('../../../app/assets/units/BombardCannon.png'),
    'Trebuchet': require('../../../app/assets/units/Trebuchet.png'),
    'Petard': require('../../../app/assets/units/Petard.png'),
    'FlamingCamel': require('../../../app/assets/units/FlamingCamel.png'),
    'BallistaElephant': require('../../../app/assets/units/BallistaElephant.png'),
    'Janissary': require('../../../app/assets/units/Janissary.png'),
    'Longboat': require('../../../app/assets/units/Longboat.png'),
    'TurtleShip': require('../../../app/assets/units/TurtleShip.png'),
    'Conquistador': require('../../../app/assets/units/Conquistador.png'),
    'SiegeTower': require('../../../app/assets/units/SiegeTower.png'),
    'Caravel': require('../../../app/assets/units/Caravel.png'),
    'OrganGun': require('../../../app/assets/units/OrganGun.png'),
    'Arambai': require('../../../app/assets/units/Arambai.png'),
    'Galley': require('../../../app/assets/units/Galley.png'),
    'WarGalley': require('../../../app/assets/units/WarGalley.png'),
    'Galleon': require('../../../app/assets/units/Galleon.png'),
    'FireGalley': require('../../../app/assets/units/FireGalley.png'),
    'FireShip': require('../../../app/assets/units/FireShip.png'),
    'FastFireShip': require('../../../app/assets/units/FastFireShip.png'),
    'DemolitionRaft': require('../../../app/assets/units/DemolitionRaft.png'),
    'DemolitionShip': require('../../../app/assets/units/DemolitionShip.png'),
    'HeavyDemolitionShip': require('../../../app/assets/units/HeavyDemolitionShip.png'),
    'CannonGalleon': require('../../../app/assets/units/CannonGalleon.png'),
    'EliteCannonGalleon': require('../../../app/assets/units/EliteCannonGalleon.png'),
    'Monk': require('../../../app/assets/units/Monk.png'),
    'Missionary': require('../../../app/assets/units/Missionary.png'),
    'TradeCart': require('../../../app/assets/units/TradeCart.png'),
    'TradeCog': require('../../../app/assets/units/TradeCog.png'),
    'FishingShip': require('../../../app/assets/units/FishingShip.png'),
    'TransportShip': require('../../../app/assets/units/TransportShip.png'),
    'Villager': require('../../../app/assets/units/Villager.png'),
};

export function getUnitLineIcon(unitLine: UnitLine) {
    const unit = unitLines[unitLine].units[0] as Unit;
    return getUnitIcon(unit);
}

export function getEliteUniqueResearchIcon() {
    return require('../../../app/assets/units/EliteUniqueResearch.png');
}

const playerColors = [
    'blue',
    'red',
    'green',
    'yellow',
    'teal',
    'purple',
    'grey',
    'orange',
];

export function getUnitIcon(unit: Unit) {
    if (unitIcons[unit] == null) return require('../../../app/assets/units/EliteUniqueResearch.png');
    return unitIcons[unit];
}
